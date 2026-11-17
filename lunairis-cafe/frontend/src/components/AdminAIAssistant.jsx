import React, { useState } from 'react';
import "../styles/AdminAIAssistant.css";

export default function AdminAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('http://localhost:3000/api/asistencia-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.success) {
        setResponse(data.resultado);
      } else {
        setResponse('Error: ' + (data.error || 'No se pudo generar'));
      }
    } catch (err) {
      setResponse('Error al conectar con el servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-float-container">
      {/* Botón flotante abajo a la derecha con imagen/icono de IA */}
      {!isOpen && (
        <button className="ai-float-btn" onClick={() => setIsOpen(true)} title="Asistente IA Lunairis">
          🤖
        </button>
      )}

      {/* Panel desplegable */}
      {isOpen && (
        <div className="ai-chat-modal">
          <div className="ai-modal-header">
            <h3>Asistencia IA - Lunairis</h3>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="ai-modal-body">
            <textarea
              placeholder="¿Qué deseas redactar o analizar? (Ej: Responder a una reseña...)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generando...' : 'Generar con IA'}
            </button>
            {response && <div className="ai-response-box">{response}</div>}
          </div>
        </div>
      )}
    </div>
  );
}