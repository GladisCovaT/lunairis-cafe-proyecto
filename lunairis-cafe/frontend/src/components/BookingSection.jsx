import SectionHeading from './SectionHeading.jsx';
import BookingInfo from './BookingInfo.jsx';
import BookingForm from './BookingForm.jsx';

export default function BookingSection() {
  return (
    <section className="section booking-section" id="reservas">
      <SectionHeading
        eyebrow="TU ESPACIO TE ESTÁ ESPERANDO"
        title="Agenda tu momento Lunairis."
        text="Selecciona tu grupo de edad, experiencia y horario preferido."
      />

      <div className="booking-layout">
        <BookingInfo />
        <BookingForm />
      </div>
    </section>
  );
}
