import { useState } from 'react';
import SectionHeading from './SectionHeading.jsx';
import FormFeedback from './FormFeedback.jsx';
import { useForm } from '../hooks/useForm';
import { appendToStorageList, STORAGE_KEYS } from '../utils/storage';

const initialValues = { name: '', email: '', message: '' };

export default function ContactSection() {
  const { values, handleChange, reset } = useForm(initialValues);
  const [feedback, setFeedback] = useState({ text: '', success: false });

  const handleSubmit = (event) => {
    event.preventDefault();

    appendToStorageList(STORAGE_KEYS.messages, {
      name: values.name,
      email: values.email,
      message: values.message,
      date: new Date().toISOString()
    });

    setFeedback({
      text: '¡Gracias por escribirnos! Tu mensaje se ha guardado en esta demostración.',
      success: true
    });
    reset();
  };

  return (
    <section className="section contact-section" id="contacto">
      <SectionHeading
        eyebrow="ESTAMOS PARA ESCUCHARTE"
        title="Conectemos."
        text="Queremos conocer tus ideas, preguntas y propuestas."
      />

      <form id="contactForm" className="contact-form" onSubmit={handleSubmit}>
        <input name="name" type="text" placeholder="Tu nombre" required
          value={values.name} onChange={handleChange} />
        <input name="email" type="email" placeholder="Tu correo" required
          value={values.email} onChange={handleChange} />
        <textarea name="message" placeholder="Escríbenos..." rows="5" required
          value={values.message} onChange={handleChange}></textarea>
        <button className="btn-primary" type="submit">Enviar mensaje</button>
        <FormFeedback id="contactMessage" feedback={feedback} />
      </form>
    </section>
  );
}
