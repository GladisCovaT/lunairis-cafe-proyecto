import { useState } from 'react';
import SectionHeading from './SectionHeading.jsx';
import FormFeedback from './FormFeedback.jsx';
import { useForm } from '../hooks/useForm';

const initialValues = { name: '', email: '', message: '' };

export default function ContactSection() {
  const { values, handleChange, reset } = useForm(initialValues);
  const [feedback, setFeedback] = useState({ text: '', success: false });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ text: 'Enviando mensaje...', success: false });

    try {
      // Petición al backend que ya tienes configurado en server.js
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          topic: 'Contacto Web',
          message: values.message
        })
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback({
          text: data.message || '¡Tu mensaje llegó a Lunairis. Gracias por escribirnos.',
          success: true
        });
        reset();
      } else {
        setFeedback({
          text: data.error || 'Revisa tu nombre, correo y mensaje (mínimo 10 caracteres).',
          success: false
        });
      }
    } catch (error) {
      setFeedback({
        text: 'No se pudo conectar con el servidor.',
        success: false
      });
    }
  };

  return (
    <section className="section contact-section" id="contacto">
      <SectionHeading
        eyebrow="ESTAMOS PARA ESCUCHARTE"
        title="Conectemos."
        text="Queremos conocer tus ideas, preguntas y propuestas."
      />

      <form id="contactForm" className="contact-form" onSubmit={handleSubmit}>
        <input 
          name="name" 
          type="text" 
          placeholder="Tu nombre" 
          required
          value={values.name} 
          onChange={handleChange} 
        />
        <input 
          name="email" 
          type="email" 
          placeholder="Tu correo" 
          required
          value={values.email} 
          onChange={handleChange} 
        />
        <textarea 
          name="message" 
          placeholder="Escríbenos..." 
          rows="5" 
          required
          value={values.message} 
          onChange={handleChange}
        ></textarea>
        
        <button className="btn-primary" type="submit">Enviar mensaje</button>
        <FormFeedback id="contactMessage" feedback={feedback} />
      </form>

      {/* Botones de redirección directa a redes, WhatsApp y GitHub */}
      <div className="contact-social-links" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '25px', flexWrap: 'wrap' }}>
        {/* WhatsApp */}
        <a 
          href="https://wa.me/57TU_NUMERO_AQUI?text=Hola%20Lunairis%20Café,%20me%20gustaría%20hacer%20una%20consulta." 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '30px', background: '#1b3b2b', color: 'white', fontWeight: '600', fontSize: '14px' }}
        >
          💬 WhatsApp
        </a>

        {/* Instagram */}
        <a 
          href="https://instagram.com/tu_usuario" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '30px', background: '#c49a70', color: 'white', fontWeight: '600', fontSize: '14px' }}
        >
          📸 Instagram
        </a>

        {/* GitHub */}
        <a 
          href="https://github.com/GladisCovaT" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '30px', background: '#24292e', color: 'white', fontWeight: '600', fontSize: '14px' }}
        >
          🐙 GitHub
        </a>
      </div>
    </section>
  );
}