import { useMemo, useState } from 'react';
import FormFeedback from './FormFeedback.jsx';
import { useForm } from '../hooks/useForm';
import { ageGroups, bookingActivities, schedules } from '../data/booking';
import { getLocalToday } from '../utils/dates';
import { appendToStorageList, STORAGE_KEYS } from '../utils/storage';

const initialValues = {
  name: '',
  email: '',
  ageGroup: '',
  people: 1,
  activity: '',
  date: '',
  time: '',
  notes: '',
  consent: false
};

export default function BookingForm() {
  const { values, setValues, handleChange, reset } = useForm(initialValues);
  const [feedback, setFeedback] = useState({ text: '', success: false });
  const minDate = useMemo(getLocalToday, []);
  const times = schedules[values.ageGroup] || [];

  // Al cambiar el grupo de edad cambian los horarios, así que se borra el horario elegido
  const handleAgeChange = (event) => {
    const ageGroup = event.target.value;
    setValues((current) => ({ ...current, ageGroup, time: '' }));
  };

 const handleSubmit = async (event) => {
    event.preventDefault();

    const booking = {
      name: values.name,
      email: values.email,
      phone: values.phone || 'No especificado', // Campo de respaldo por si no está en el form
      ageGroup: values.ageGroup,
      guests: Number(values.people), // Aseguramos que sea número para el backend
      zone: values.activity,         // Mapeamos activity a zone
      date: values.date,
      time: values.time,
      note: values.notes,
      status: 'Pendiente'
    };

    if (booking.ageGroup === 'ninos' && booking.guests < 1) {
      setFeedback({ text: 'Verifica la cantidad de visitantes.', success: false });
      return;
    }

    try {
      setFeedback({ text: 'Enviando reserva...', success: false });

      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback({ text: data.message, success: true });
        if (typeof reset === 'function') reset(); // Limpia el formulario si tienes la función reset
      } else {
        setFeedback({ text: data.error || 'Ocurrió un error al reservar.', success: false });
      }
    } catch (error) {
      setFeedback({ text: 'No se pudo conectar con el servidor.', success: false });
    }
  };

  return (
    <form id="bookingForm" className="booking-form" onSubmit={handleSubmit}>
      <label htmlFor="visitorName">Nombre del visitante</label>
      <input id="visitorName" name="name" type="text" required placeholder="Tu nombre"
        value={values.name} onChange={handleChange} />

      <label htmlFor="visitorEmail">Correo electrónico</label>
      <input id="visitorEmail" name="email" type="email" required placeholder="correo@ejemplo.com"
        value={values.email} onChange={handleChange} />

      <label htmlFor="visitorAge">Grupo de edad</label>
      <select id="visitorAge" name="ageGroup" required value={values.ageGroup} onChange={handleAgeChange}>
        <option value="">Selecciona tu grupo</option>
        {ageGroups.map((group) => (
          <option key={group.value} value={group.value}>{group.optionLabel}</option>
        ))}
      </select>

      <label htmlFor="visitorCount">Cantidad de visitantes</label>
      <input id="visitorCount" name="people" type="number" min="1" max="10" required
        value={values.people} onChange={handleChange} />

      <label htmlFor="bookingActivity">Experiencia</label>
      <select id="bookingActivity" name="activity" required value={values.activity} onChange={handleChange}>
        <option value="">Selecciona una experiencia</option>
        {bookingActivities.map((activity) => (
          <option key={activity} value={activity}>{activity}</option>
        ))}
      </select>

      <label htmlFor="bookingDate">Fecha de visita</label>
      <input id="bookingDate" name="date" type="date" required min={minDate}
        value={values.date} onChange={handleChange} />

      <label htmlFor="bookingTime">Horario disponible</label>
      <select id="bookingTime" name="time" required disabled={!values.ageGroup}
        value={values.time} onChange={handleChange}>
        <option value="">
          {values.ageGroup ? 'Selecciona un horario' : 'Primero selecciona el grupo de edad'}
        </option>
        {times.map((time) => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>

      <label htmlFor="bookingNotes">¿Algo que debamos saber? (opcional)</label>
      <textarea id="bookingNotes" name="notes" rows="3" placeholder="Cuéntanos sobre tus preferencias..."
        value={values.notes} onChange={handleChange}></textarea>

      <label className="consent">
        <input type="checkbox" name="consent" required checked={values.consent} onChange={handleChange} />
        Acepto que se utilicen mis datos para gestionar esta reserva.
      </label>

      <button className="btn-primary" type="submit">Solicitar mi reserva</button>

      <FormFeedback id="bookingMessage" className="form-message" feedback={feedback} />
    </form>
  );
}
