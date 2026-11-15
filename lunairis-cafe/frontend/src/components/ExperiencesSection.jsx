import SectionHeading from './SectionHeading.jsx';
import ExperienceCard from './ExperienceCard.jsx';
import { experiences } from '../data/experiences';

export default function ExperiencesSection() {
  return (
    <section className="section" id="experiencias">
      <SectionHeading
        eyebrow="DESCUBRE TU LADO CREATIVO"
        title="¿Qué te gustaría hacer hoy?"
        text="Elige una experiencia y convierte tu visita en algo especial."
      />

      <div className="experience-grid">
        {experiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </section>
  );
}
