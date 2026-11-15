export default function Toast({ message, show }) {
  return (
    <div className={`admin-toast${show ? ' show' : ''}`} id="adminToast" role="status" aria-live="polite">
      {message}
    </div>
  );
}
