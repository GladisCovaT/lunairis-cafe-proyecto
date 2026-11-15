import { useState } from 'react';
import { routineOptions } from '../data/routineOptions';

function RoutineResult({ result }) {
  // result: null (estado inicial), [] (nada seleccionado) o lista de actividades
  if (result === null) {
    return (
      <>
        <h3>Tu experiencia aparecerá aquí.</h3>
        <p>Selecciona tus actividades favoritas para comenzar.</p>
      </>
    );
  }

  if (result.length === 0) {
    return (
      <>
        <h3>¡Empecemos!</h3>
        <p>Selecciona al menos una actividad para diseñar tu rutina.</p>
      </>
    );
  }

  return (
    <>
      <h3>Tu experiencia Lunairis ✨</h3>
      <p>Hemos preparado esta propuesta con tus preferencias:</p>
      <ol>
        {result.map((activity) => (
          <li key={activity}>{activity}</li>
        ))}
      </ol>
      <p><strong>Un momento para ti, a tu manera.</strong></p>
      <a href="#reservas" className="experience-link">Reservar esta experiencia →</a>
    </>
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

  // El resultado sigue el orden de las opciones, no el orden en que se marcaron
  const createRoutine = () => {
    setResult(routineOptions.map((option) => option.value).filter((value) => selected.includes(value)));
  };

  return (
    <section className="section routine-section" id="rutina">
      <div className="routine-content">
        <span className="eyebrow">TU BIENESTAR COMIENZA CONTIGO</span>
        <h2>Diseña tu rutina ideal.</h2>
        <p>
          No todos necesitamos lo mismo. Elige las actividades que
          te gustaría realizar y crea una experiencia a tu medida.
        </p>

        <div className="routine-options">
          {routineOptions.map((option) => (
            <label key={option.value}>
              <input
                type="checkbox"
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={() => toggleOption(option.value)}
              />{' '}
              {option.label}
            </label>
          ))}
        </div>

        <button className="btn-primary" id="createRoutine" onClick={createRoutine}>
          Crear mi rutina
        </button>

        <div className="routine-result" id="routineResult" aria-live="polite">
          <RoutineResult result={result} />
        </div>
      </div>

      <div className="routine-image">
        <img src="/assets/images/routine.jpg" alt="Espacio creativo y relajante" />
      </div>
    </section>
  );
}
