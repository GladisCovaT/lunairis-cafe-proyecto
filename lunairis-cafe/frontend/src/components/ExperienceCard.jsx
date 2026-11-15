import { useReveal } from '../hooks/useReveal';

export default function ExperienceCard({ experience }) {
  const [ref, visible] = useReveal();

  return (
    <article ref={ref} className={`experience-card reveal${visible ? ' visible' : ''}`}>
      <img src={experience.image} alt={experience.alt} />
      <div className="experience-info">
        <span className="category-tag">{experience.tag}</span>
        <h3>{experience.title}</h3>
        <p>{experience.text}</p>
        <a href="#reservas" className="experience-link">Reservar experiencia →</a>
      </div>
    </article>
  );
}
