import { useState } from 'react';
import { routineOptions } from '../data/routineOptions';

function RoutineResult({ result }) {
  if (result === null) {
    return (
      <div className="result-placeholder">
        <span className="result-icon">✨</span>
        <div>
          <h4>Tu experiencia aparecerá aquí</h4>
          <p>Selecciona tus actividades favoritas para comenzar a diseñar tu momento.</p>
        </div>
      </div>
    );
  }

  if (result.length === 0) {
    return (
      <div className="result-placeholder warning">
        <h4>¡Empecemos!</h4>
        <p>Selecciona al menos una actividad para crear tu rutina ideal.</p>
      </div>
    );
  }

  return (
    <div className="result-card-active">
      <div className="result-header">
        <span className="badge-spark">✨ Experiencia Personalizada</span>
        <h3>Tu rutina en Lunaris</h3>
      </div>
      <p className="result-subtitle">Hemos preparado esta propuesta adaptada a tus preferencias:</p>
      <ul className="result-list">
        {result.map((activity, index) => (
          <li key={activity} className="result-item">
            <span className="item-number">0{index + 1}</span>
            <span>{activity}</span>
          </li>
        ))}
      </ul>
      <div className="result-footer">
        <p><strong>Un espacio creado solo para ti.</strong></p>
        <a href="#reservas" className="experience-link">Reservar esta experiencia →</a>
      </div>
    </div>
  );
}

export default function RoutineSection() {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);

  const toggleOption = (value) => {
    setSelected((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const createRoutine = () => {
    setResult(routineOptions.map((option) => option.value).filter((value) => selected.includes(value)));
  };

  return (
    <section className="section routine-section" id="rutina">
      <div className="routine-container">
        
        {/* Columna Izquierda: Controles y Opciones */}
        <div className="routine-content">
          <span className="eyebrow">TU BIENESTAR COMIENZA CONTIGO</span>
          <h2>Diseña tu rutina ideal.</h2>
          <p className="routine-desc">
            No todos necesitamos lo mismo. Elige las actividades que te gustaría realizar y crea una experiencia a tu medida.
          </p>

          {/* Opciones en Tarjetas Interactivas */}
          <div className="routine-options-grid">
            {routineOptions.map((option) => {
              const isChecked = selected.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={`routine-card-option ${isChecked ? 'active' : ''}`}
                  onClick={() => toggleOption(option.value)}
                >
                  <div className="checkbox-custom">
                    {isChecked && <span className="check-icon">✓</span>}
                  </div>
                  <span className="option-label">{option.label}</span>
                </div>
              );
            })}
          </div>

          <button className="btn-primary" id="createRoutine" onClick={createRoutine}>
            <span>Crear mi rutina</span>
            <span className="btn-arrow">✨</span>
          </button>

          {/* Resultado */}
          <div className="routine-result" id="routineResult" aria-live="polite">
            <RoutineResult result={result} />
          </div>
        </div>

        {/* Columna Derecha: Collage de Tarjetas de Fotos */}
        <div className="routine-collage-wrapper">
          <div className="photo-card main-photo">
            <img src="/assets/lunairis.jpg" alt="Café artesanal en Lunaris" />
            <div className="photo-tag">☕ Café de un hogar</div>
          </div>

          <div className="photo-card secondary-photo">
            <img src="/assets/videojuegos.jpg" alt="Zona de lectura y arte" />
            <div className="photo-tag">🎨 Demuestra que eres dentro de un mundo tecnologico</div>
          </div>

          <div className="photo-card secondary-photo">
            <img src="/assets/taller-flores.jpg" alt="Talleres y relajación" />
            <div className="photo-tag">🌸 Talleres de flores</div>
          </div>
        </div>
      </div>
    </section>
  );
}
