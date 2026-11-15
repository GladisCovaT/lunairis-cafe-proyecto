import { ageGroups } from '../data/booking';

export default function BookingInfo() {
  return (
    <div className="booking-description">
      <h3>Un espacio para cada etapa.</h3>
      <p>
        Organizamos experiencias adaptadas a las edades,
        intereses y necesidades de nuestros visitantes.
      </p>

      <div className="age-info">
        {ageGroups.map((group) => (
          <div key={group.value}>
            <strong>{group.name}</strong>
            <span>{group.range}</span>
          </div>
        ))}
      </div>

      <p className="small-note">
        Los menores deben asistir con un adulto responsable
        y contar con su autorización. Los horarios y actividades
        infantiles se realizan con supervisión.
      </p>
    </div>
  );
}
