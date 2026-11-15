// Mensaje de confirmación/error bajo un formulario
export default function FormFeedback({ id, className, feedback }) {
  return (
    <p
      id={id}
      className={className}
      aria-live="polite"
      style={feedback.success ? { color: '#174d3c' } : undefined}
    >
      {feedback.text}
    </p>
  );
}
