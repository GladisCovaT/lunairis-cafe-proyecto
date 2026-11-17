
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { rateLimit } from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';

// ==========================================
// CONFIGURACION INICIAL
// ==========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const FRONTEND_DIR = path.resolve(
  __dirname,
  '../../frontend/dist'
);

const MONGODB_URI = process.env.MONGODB_URI;
console.log('ENV cargado:', !!process.env.MONGODB_URI);
console.log('Ruta del ENV:', path.resolve(__dirname, '../../.env'));
console.log('MongoStore URI disponible:', !!MONGODB_URI);

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!MONGODB_URI) {
  throw new Error('Falta configurar MONGODB_URI en el archivo .env');
}

if (IS_PRODUCTION && !SESSION_SECRET) {
  throw new Error('Falta configurar SESSION_SECRET en producción.');
}

if (IS_PRODUCTION) {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');

// ==========================================
// CONFIGURACION CORS
// ==========================================

const allowedOrigins = (
  process.env.FRONTEND_ORIGIN ||
  'http://localhost:5173,http://127.0.0.1:5173'
)
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origen no autorizado por CORS.'));
  },
  credentials: true
}));

// ==========================================
// SEGURIDAD
// ==========================================

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https:'],
      fontSrc: ["'self'", 'data:', 'https:'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: IS_PRODUCTION ? [] : null
    }
  }
}));

app.use(express.json({
  limit: '30kb'
}));

app.use(express.urlencoded({
  extended: false,
  limit: '10kb'
}));

// ==========================================
// CONEXION MONGODB ATLAS
// ==========================================

const storeSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },

  products: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },

  messages: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },

  orders: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },

  reservations: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  }

}, {
  timestamps: true,
  minimize: false
});

const Store = mongoose.model('LunairisData', storeSchema);

// ==========================================
// FUNCIONES DE ALMACENAMIENTO
// ==========================================

let writeQueue = Promise.resolve();

async function ensureStore() {
  await Store.findOneAndUpdate(
    { key: 'main' },
    {
      $setOnInsert: {
        key: 'main',
        products: [],
        messages: [],
        orders: [],
        reservations: []
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );
}

async function readData() {
  const data = await Store.findOne({
    key: 'main'
  }).lean();

  if (!data) {
    throw new Error('No se encontró el almacenamiento de Lunairis.');
  }

  return {
    products: data.products || [],
    messages: data.messages || [],
    orders: data.orders || [],
    reservations: data.reservations || []
  };
}

function updateData(callback) {
  const task = writeQueue.then(async () => {
    const document = await Store.findOne({
      key: 'main'
    });

    if (!document) {
      throw new Error('No existe el almacenamiento principal.');
    }

    const data = {
      products: document.products || [],
      messages: document.messages || [],
      orders: document.orders || [],
      reservations: document.reservations || []
    };

    const result = callback(data);

    document.set({
      products: data.products,
      messages: data.messages,
      orders: data.orders,
      reservations: data.reservations
    });

    await document.save();

    return result;
  });

  writeQueue = task.catch(() => {});

  return task;
}

 // ==========================================
 // CONFIGURACION DE SESIONES
 // ==========================================

app.use(session({
  name: 'lunairis.sid',

  secret: SESSION_SECRET || 'lunairis-clave-local-desarrollo',

  resave: false,

  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    collectionName: 'sessions',
    ttl: 60 * 60 * 4
  }),

  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: IS_PRODUCTION,
    maxAge: 1000 * 60 * 60 * 4
  }
}));

// ==========================================
// CONFIGURACION DE GEMINI
// ==========================================

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    })
  : null;

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// ==========================================
// LIMITES DE SOLICITUDES
// ==========================================

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 6,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function cleanText(value, maxLength = 500) {
  return typeof value === 'string'
    ? value.trim().slice(0, maxLength)
    : '';
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T12:00:00`);

  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value;
}

function requireAdmin(req, res, next) {
  if (!req.session.admin) {
    return res.status(401).json({
      error: 'Debes iniciar sesión como administrador.'
    });
  }

  next();
}

function validProduct(body = {}) {
  const name = cleanText(body.name, 70);
  const category = cleanText(body.category, 40);
  const description = cleanText(body.description, 240);
  const tagline = cleanText(body.tagline, 90);
  const price = Number(body.price);

  if (
    !name ||
    !category ||
    !description ||
    !Number.isFinite(price) ||
    price < 1000 ||
    price > 1000000
  ) {
    return null;
  }

  return {
    name,
    category,
    description,
    tagline: tagline || 'Un momento para disfrutar',
    price: Math.round(price),
    icon: cleanText(body.icon, 4) || '☕',
    featured: Boolean(body.featured),
    active: body.active !== false
  };
}

// ==========================================
// ASISTENTE DE INTELIGENCIA ARTIFICIAL
// GEMINI - LUNAIRIS CAFE
// ==========================================

app.post(
  '/api/asistencia-ia',
  aiLimiter,
  requireAdmin,
  async (req, res) => {
    try {
      const prompt = cleanText(req.body?.prompt, 2000);

      if (!prompt || prompt.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Escribe un mensaje para continuar.'
        });
      }

      if (!ai) {
        return res.status(503).json({
          success: false,
          error: 'Falta configurar GEMINI_API_KEY en el archivo .env.'
        });
      }

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,

        contents: prompt,

        config: {
          systemInstruction: `
            Eres el asistente inteligente de Lunairis Café,
            una cafetería y negocio recreativo.

            Tu función es ayudar al administrador
            con la gestión y organización del negocio.

            Tu personalidad debe ser amable,
            creativa, profesional y cercana.

            Responde siempre en español.

            Puedes ayudar con:

            - Organización del negocio.
            - Ideas de marketing y publicidad.
            - Atención al cliente.
            - Productos y servicios.
            - Estrategias comerciales.
            - Organización de pedidos.
            - Organización de reservas.
            - Experiencias para los visitantes.
            - Ideas de actividades recreativas.
            - Mejoras para Lunairis Café.

            No inventes precios, horarios,
            productos ni información específica
            que no haya sido proporcionada.

            Cuando no conozcas un dato,
            indícalo claramente.
          `,

          maxOutputTokens: 1200,

          temperature: 0.7
        }
      });

      const resultado = response.text?.trim();

      if (!resultado) {
        return res.status(502).json({
          success: false,
          error: 'Gemini no devolvió una respuesta.'
        });
      }

      return res.json({
        success: true,
        resultado
      });

    } catch (error) {
      console.error(
        'Error de Gemini:',
        error.message
      );

      return res.status(502).json({
        success: false,
        error: 'No se pudo generar la respuesta con Gemini. Inténtalo nuevamente.'
      });
    }
  }
);

// ==========================================
// COMPROBACION DEL SERVIDOR
// ==========================================

app.get('/api/health', async (_req, res) => {
  res.json({
    ok: true,
    app: 'Lunairis Café API',
    database: mongoose.connection.readyState === 1
      ? 'connected'
      : 'disconnected',
    gemini: Boolean(ai)
  });
});

// ==========================================
// PRODUCTOS PUBLICOS
// ==========================================

app.get('/api/products', async (_req, res, next) => {
  try {
    const data = await readData();

    res.json(
      data.products.filter(product => product.active)
    );

  } catch (error) {
    next(error);
  }
});

// ==========================================
// FORMULARIO DE CONTACTO
// ==========================================

app.post(
  '/api/contact',
  contactLimiter,
  async (req, res, next) => {
    try {
      const name = cleanText(req.body.name, 80);
      const email = cleanText(req.body.email, 120).toLowerCase();
      const topic = cleanText(req.body.topic, 80);
      const message = cleanText(req.body.message, 1200);

      if (
        name.length < 2 ||
        !isValidEmail(email) ||
        message.length < 10
      ) {
        return res.status(400).json({
          error: 'Revisa tu nombre, correo y mensaje (mínimo 10 caracteres).'
        });
      }

      const saved = await updateData(data => {
        const item = {
          id: crypto.randomUUID(),
          name,
          email,
          topic: topic || 'Mensaje general',
          message,
          status: 'Nuevo',
          createdAt: new Date().toISOString()
        };

        data.messages.unshift(item);

        return item;
      });

      res.status(201).json({
        message: 'Tu mensaje llegó a Lunairis. Gracias por escribirnos.',
        id: saved.id
      });

    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// PEDIDOS
// ==========================================

app.post(
  '/api/orders',
  contactLimiter,
  async (req, res, next) => {
    try {
      const name = cleanText(req.body.name, 80);
      const phone = cleanText(req.body.phone, 30);
      const note = cleanText(req.body.note, 400);

      const requestedItems = Array.isArray(req.body.items)
        ? req.body.items
        : [];

      if (
        name.length < 2 ||
        phone.length < 7 ||
        requestedItems.length < 1 ||
        requestedItems.length > 20
      ) {
        return res.status(400).json({
          error: 'Completa tu nombre, teléfono y agrega al menos un producto.'
        });
      }

      const saved = await updateData(data => {
        const items = [];

        for (const requested of requestedItems) {
          const product = data.products.find(
            item => item.id === requested.id && item.active
          );

          const quantity = Number(requested.quantity);

          if (
            !product ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 20
          ) {
            continue;
          }

          items.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity
          });
        }

        if (!items.length) {
          throw new Error('PRODUCTS_UNAVAILABLE');
        }

        const total = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        const order = {
          id: crypto.randomUUID(),
          name,
          phone,
          note,
          items,
          total,
          status: 'Pendiente',
          createdAt: new Date().toISOString()
        };

        data.orders.unshift(order);

        return order;
      });

      res.status(201).json({
        message: 'Tu pedido fue registrado. El equipo de Lunairis se pondrá en contacto contigo.',
        orderId: saved.id
      });

    } catch (error) {
      if (error.message === 'PRODUCTS_UNAVAILABLE') {
        return res.status(400).json({
          error: 'No encontramos los productos del pedido. Actualiza el catálogo e inténtalo de nuevo.'
        });
      }

      next(error);
    }
  }
);

// ==========================================
// RESERVAS
// ==========================================

app.post(
  '/api/reservas',
  contactLimiter,
  async (req, res, next) => {
    try {
      const name = cleanText(req.body.name, 80);
      const email = cleanText(req.body.email, 120).toLowerCase();
      const phone = cleanText(req.body.phone, 30);
      const date = cleanText(req.body.date, 20);
      const time = cleanText(req.body.time, 20);
      const guests = Number(req.body.guests);
      const zone = cleanText(req.body.zone, 50);
      const note = cleanText(req.body.note, 300);

      if (
        name.length < 2 ||
        !isValidEmail(email) ||
        phone.length < 7 ||
        !isValidDate(date) ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
        !Number.isInteger(guests) ||
        guests < 1 ||
        guests > 30
      ) {
        return res.status(400).json({
          error: 'Revisa los datos de tu reserva.'
        });
      }

      const saved = await updateData(data => {
        const reservation = {
          id: crypto.randomUUID(),
          name,
          email,
          phone,
          date,
          time,
          guests,
          zone: zone || 'General',
          note,
          status: 'Pendiente',
          createdAt: new Date().toISOString()
        };

        data.reservations.unshift(reservation);

        return reservation;
      });

      res.status(201).json({
        message: '¡Reserva solicitada con éxito! Nos pondremos en contacto para confirmarla.',
        reservationId: saved.id
      });

    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// INICIO DE SESION ADMINISTRADOR
// ==========================================

app.post(
  '/api/admin/login',
  loginLimiter,
  async (req, res, next) => {
    try {
      const email = cleanText(req.body.email, 120).toLowerCase();

      const password = typeof req.body.password === 'string'
        ? req.body.password
        : '';

      const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
      const passwordHash = process.env.ADMIN_PASSWORD_HASH || '';

      if (
        !adminEmail ||
        !passwordHash ||
        passwordHash === 'PEGA_AQUI_EL_HASH_BCRYPT'
      ) {
        return res.status(503).json({
          error: 'Falta configurar ADMIN_EMAIL y ADMIN_PASSWORD_HASH en el archivo .env.'
        });
      }

      const valid = email === adminEmail &&
        await bcrypt.compare(password, passwordHash);

      if (!valid) {
        return res.status(401).json({
          error: 'Correo o contraseña incorrectos.'
        });
      }

      req.session.regenerate(error => {
        if (error) {
          return next(error);
        }

        req.session.admin = {
          email: adminEmail
        };

        req.session.save(saveError => {
          if (saveError) {
            return next(saveError);
          }

          res.json({
            message: 'Sesión iniciada.',
            email: adminEmail
          });
        });
      });

    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// COMPROBAR SESION ADMINISTRADOR
// ==========================================

app.get('/api/admin/session', (req, res) => {
  res.json({
    authenticated: Boolean(req.session.admin),
    email: req.session.admin?.email || null
  });
});

// ==========================================
// CERRAR SESION
// ==========================================

app.post(
  '/api/admin/logout',
  requireAdmin,
  (req, res, next) => {
    req.session.destroy(error => {
      if (error) {
        return next(error);
      }

      res.clearCookie('lunairis.sid', {
        httpOnly: true,
        sameSite: 'lax',
        secure: IS_PRODUCTION
      });

      res.json({
        message: 'Sesión cerrada.'
      });
    });
  }
);

// ==========================================
// PANEL ADMINISTRATIVO - ESTADISTICAS
// ==========================================

app.get(
  '/api/admin/dashboard',
  requireAdmin,
  async (_req, res, next) => {
    try {
      const data = await readData();

      const now = Date.now();

      const lastSevenDays = Array.from(
        { length: 7 },
        (_, index) => {
          const date = new Date(now);

          date.setDate(date.getDate() - (6 - index));

          const key = date.toISOString().slice(0, 10);

          const count = data.orders.filter(
            order => order.createdAt?.slice(0, 10) === key
          ).length;

          return {
            label: date.toLocaleDateString('es-CO', {
              weekday: 'short'
            }).replace('.', ''),
            count
          };
        }
      );

      res.json({
        stats: {
          products: data.products.filter(item => item.active).length,

          messages: data.messages.length,

          newMessages: data.messages.filter(
            item => item.status === 'Nuevo'
          ).length,

          orders: data.orders.length,

          pendingOrders: data.orders.filter(
            item => item.status === 'Pendiente'
          ).length,

          revenue: data.orders
            .filter(item => item.status !== 'Cancelado')
            .reduce((sum, item) => sum + item.total, 0)
        },

        weeklyOrders: lastSevenDays
      });

    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// ADMINISTRAR PRODUCTOS
// ==========================================

app.get(
  '/api/admin/products',
  requireAdmin,
  async (_req, res, next) => {
    try {
      res.json((await readData()).products);
    } catch (error) {
      next(error);
    }
  }
);

app.post(
  '/api/admin/products',
  requireAdmin,
  async (req, res, next) => {
    try {
      const product = validProduct(req.body);

      if (!product) {
        return res.status(400).json({
          error: 'Completa nombre, categoría, descripción y un precio válido.'
        });
      }

      const saved = await updateData(data => {
        const item = {
          id: crypto.randomUUID(),
          ...product,
          createdAt: new Date().toISOString()
        };

        data.products.unshift(item);

        return item;
      });

      res.status(201).json(saved);

    } catch (error) {
      next(error);
    }
  }
);

app.put(
  '/api/admin/products/:id',
  requireAdmin,
  async (req, res, next) => {
    try {
      const product = validProduct(req.body);

      if (!product) {
        return res.status(400).json({
          error: 'Completa los campos del producto y revisa el precio.'
        });
      }

      const updated = await updateData(data => {
        const index = data.products.findIndex(
          item => item.id === req.params.id
        );

        if (index === -1) {
          return null;
        }

        data.products[index] = {
          ...data.products[index],
          ...product,
          updatedAt: new Date().toISOString()
        };

        return data.products[index];
      });

      if (!updated) {
        return res.status(404).json({
          error: 'Producto no encontrado.'
        });
      }

      res.json(updated);

    } catch (error) {
      next(error);
    }
  }
);

app.delete(
  '/api/admin/products/:id',
  requireAdmin,
  async (req, res, next) => {
    try {
      const deleted = await updateData(data => {
        const index = data.products.findIndex(
          item => item.id === req.params.id
        );

        if (index === -1) {
          return false;
        }

        data.products.splice(index, 1);

        return true;
      });

      if (!deleted) {
        return res.status(404).json({
          error: 'Producto no encontrado.'
        });
      }

      res.json({
        message: 'Producto eliminado.'
      });

    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// MENSAJES DEL CONTACTO
// ==========================================

app.get(
  '/api/admin/messages',
  requireAdmin,
  async (_req, res, next) => {
    try {
      res.json((await readData()).messages);
    } catch (error) {
      next(error);
    }
  }
);

app.patch(
  '/api/admin/messages/:id',
  requireAdmin,
  async (req, res, next) => {
    try {
      const status = cleanText(req.body.status, 20);

      if (!['Nuevo', 'En seguimiento', 'Respondido'].includes(status)) {
        return res.status(400).json({
          error: 'Estado no válido.'
        });
      }

      const item = await updateData(data => {
        const message = data.messages.find(
          entry => entry.id === req.params.id
        );

        if (!message) {
          return null;
        }

        message.status = status;

        return message;
      });

      if (!item) {
        return res.status(404).json({
          error: 'Mensaje no encontrado.'
        });
      }

      res.json(item);

    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// ADMINISTRAR PEDIDOS
// ==========================================

app.get(
  '/api/admin/orders',
  requireAdmin,
  async (_req, res, next) => {
    try {
      res.json((await readData()).orders);
    } catch (error) {
      next(error);
    }
  }
);

app.patch(
  '/api/admin/orders/:id',
  requireAdmin,
  async (req, res, next) => {
    try {
      const status = cleanText(req.body.status, 20);

      if (
        ![
          'Pendiente',
          'En preparación',
          'Listo',
          'Entregado',
          'Cancelado'
        ].includes(status)
      ) {
        return res.status(400).json({
          error: 'Estado no válido.'
        });
      }

      const item = await updateData(data => {
        const order = data.orders.find(
          entry => entry.id === req.params.id
        );

        if (!order) {
          return null;
        }

        order.status = status;
        order.updatedAt = new Date().toISOString();

        return order;
      });

      if (!item) {
        return res.status(404).json({
          error: 'Pedido no encontrado.'
        });
      }

      res.json(item);

    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// ADMINISTRAR RESERVAS
// ==========================================

app.get(
  '/api/admin/reservations',
  requireAdmin,
  async (_req, res, next) => {
    try {
      res.json((await readData()).reservations);
    } catch (error) {
      next(error);
    }
  }
);

app.patch(
  '/api/admin/reservations/:id',
  requireAdmin,
  async (req, res, next) => {
    try {
      const status = cleanText(req.body.status, 20);

      if (
        !['Pendiente', 'Confirmada', 'Cancelada'].includes(status)
      ) {
        return res.status(400).json({
          error: 'Estado de reserva no válido.'
        });
      }

      const item = await updateData(data => {
        const reservation = data.reservations.find(
          entry => entry.id === req.params.id
        );

        if (!reservation) {
          return null;
        }

        reservation.status = status;
        reservation.updatedAt = new Date().toISOString();

        return reservation;
      });

      if (!item) {
        return res.status(404).json({
          error: 'Reserva no encontrada.'
        });
      }

      res.json(item);

    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// RUTAS NO ENCONTRADAS
// ==========================================

app.use('/api', (_req, res) => {
  res.status(404).json({
    error: 'Ruta de API no encontrada.'
  });
});

// ==========================================
// SERVIR FRONTEND
// ==========================================

app.use(express.static(FRONTEND_DIR, {
  extensions: ['html']
}));

// ==========================================
// MANEJADOR DE ERRORES
// ==========================================

app.use((error, _req, res, _next) => {
  console.error('Error del servidor:', error);

  if (res.headersSent) {
    return;
  }

  res.status(error.status || 500).json({
    error: error.status && error.status < 500
      ? error.message
      : 'Ocurrió un error interno. Inténtalo nuevamente.'
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

async function startServer() {
  try {
    console.log('Conectando con MongoDB Atlas...');

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log('MongoDB Atlas conectado correctamente.');

    await ensureStore();

    console.log('Almacenamiento de Lunairis preparado.');

    app.listen(PORT, () => {
      console.log('------------------------------------');
      console.log('LUNAIRIS CAFE');
      console.log(`Servidor: http://localhost:${PORT}`);
      console.log('MongoDB: Conectado');
      console.log(`Gemini: ${ai ? 'Configurado' : 'Sin configurar'}`);
      console.log('------------------------------------');
    });

  } catch (error) {
    console.error('Error al iniciar Lunairis Café:', error.message);

    await mongoose.disconnect().catch(() => {});

    process.exit(1);
  }
}

startServer();
