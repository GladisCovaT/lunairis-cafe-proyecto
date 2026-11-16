import { useState } from 'react';
import { formatPrice } from '../utils/format';

export default function CartDetails({ items, total, hidden, onRemove, onClose }) {
  const [step, setStep] = useState('cart'); // 'cart', 'checkout', 'success'
  const [paymentData, setPaymentData] = useState({ name: '', card: '' });
  const [loading, setLoading] = useState(false);

  if (hidden) return null;

  const handleSimulatedPayment = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulamos el tiempo de respuesta del banco (1.5 segundos)
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  const handleCloseModal = () => {
    setStep('cart'); // Reinicia siempre al carrito al cerrar
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="cart-backdrop" style={backdropStyle}>
      <div className="cart-side-panel" style={sidePanelStyle}>
        
        {/* PASO 1: VISTA DEL CARRITO */}
        {step === 'cart' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1b3b2b', fontSize: '20px' }}>Tu pedido</h3>
              
              {/* Botón X circular, compacto y alineado */}
              <button 
                onClick={handleCloseModal} 
                style={closeButtonStyle} 
                title="Cerrar"
              >
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', margin: '40px 0' }}>Tu carrito está vacío.</p>
            ) : (
              <>
                <div style={{ maxHeight: '50vh', overflowY: 'auto', marginBottom: '20px' }}>
                  {items.map((item) => (
                    <div key={item.id} style={itemRowStyle}>
                      <span style={{ fontSize: '14px', color: '#333' }}>
                        {item.name} × {item.quantity} — <strong>{formatPrice(item.price * item.quantity)}</strong>
                      </span>
                      <button 
                        aria-label="Quitar producto" 
                        onClick={() => onRemove(item.id)}
                        style={removeButtonStyle}
                      >
                        −
                      </button>
                    </div>
                  ))}
                </div>

                <hr style={{ border: '0', borderTop: '1px solid #eaeaea', margin: '15px 0' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <strong style={{ fontSize: '16px', color: '#1b3b2b' }}>Total:</strong>
                  <strong style={{ fontSize: '18px', color: '#1b3b2b' }}>{formatPrice(total)}</strong>
                </div>

                <button onClick={() => setStep('checkout')} style={primaryButtonStyle}>
                  Proceder al pago de demostración
                </button>
              </>
            )}

            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              <small style={{ color: '#888', fontSize: '12px' }}>Pedido de demostración. Confirma disponibilidad con el establecimiento.</small>
            </p>
          </div>
        )}

        {/* PASO 2: FORMULARIO DE PAGO SIMULADO */}
        {step === 'checkout' && (
          <div>
            <h3 style={{ color: '#1b3b2b', marginBottom: '5px' }}>Pago de Demostración</h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
              Entorno seguro simulado. No se realizarán cargos reales.
            </p>

            <form onSubmit={handleSimulatedPayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Nombre del titular</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej. Ana Cova" 
                  style={inputStyle}
                  value={paymentData.name} 
                  onChange={e => setPaymentData({...paymentData, name: e.target.value})} 
                />
              </div>

              <div>
                <label style={labelStyle}>Número de tarjeta (Demo)</label>
                <input 
                  type="text" 
                  required 
                  placeholder="4242 •••• •••• 4242" 
                  maxLength="19" 
                  style={inputStyle}
                  value={paymentData.card} 
                  onChange={e => setPaymentData({...paymentData, card: e.target.value})} 
                />
              </div>

              <button type="submit" style={primaryButtonStyle} disabled={loading}>
                {loading ? 'Procesando pago...' : `Pagar ${formatPrice(total)}`}
              </button>
              
              <button type="button" onClick={() => setStep('cart')} style={secondaryButtonStyle}>
                ← Volver al carrito
              </button>
            </form>
          </div>
        )}

        {/* PASO 3: MENSAJE DE ÉXITO */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>🎉</div>
            <h3 style={{ color: '#1b3b2b', fontSize: '22px' }}>¡Pedido Exitoso!</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: '15px 0 30px 0' }}>
              Tu pago de demostración se ha completado con éxito. El equipo de Lunairis Café ya ha recibido tu orden.
            </p>
            <button 
              onClick={handleCloseModal} 
              style={primaryButtonStyle}
            >
              Entendido / Cerrar
            </button>
          </div>
        )}

      </div>
    </div>
  );
}


/* ==========================================
   ESTILOS PROFESIONALES (Limpios y Modernos)
   ================================---------- */
const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.45)', // Oscurece y desvanece el fondo
  backdropFilter: 'blur(4px)',             // Efecto difuminado elegante
  display: 'flex',
  justifyContent: 'flex-end',              // Panel pegado a la derecha
  zIndex: 9999
};

const sidePanelStyle = {
  width: '100%',
  maxWidth: '420px',
  height: '100%',
  backgroundColor: '#ffffff',
  padding: '30px',
  boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  overflowY: 'auto'
};

const itemRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #f2f2f2'
};

const removeButtonStyle = {
  background: '#f8d7da',
  color: '#721c24',
  border: 'none',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px'
};

const closeButtonStyle = {
  background: 'transparent',
  color: '#1b3b2b',
  border: '1px solid #1b3b2b',
  borderRadius: '50%',          // Completamente circular
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  flexShrink: 0
};

const primaryButtonStyle = {
  background: '#1b3b2b', // Verde esmeralda Lunairis
  color: '#ffffff',
  border: 'none',
  padding: '12px 20px',
  borderRadius: '25px',
  fontWeight: '600',
  fontSize: '14px',
  cursor: 'pointer',
  width: '100%',
  boxShadow: '0 4px 10px rgba(27, 59, 43, 0.2)',
  transition: 'all 0.2s ease'
};

const secondaryButtonStyle = {
  background: 'transparent',
  color: '#1b3b2b',
  border: '1px solid #1b3b2b',
  padding: '10px 18px',
  borderRadius: '25px',
  fontWeight: '600',
  fontSize: '14px',
  cursor: 'pointer',
  width: '100%',
  transition: 'all 0.2s ease'
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '6px',
  color: '#444'
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #dcdcdc',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box'
};