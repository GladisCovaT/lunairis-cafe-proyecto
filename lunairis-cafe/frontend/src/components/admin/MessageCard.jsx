import { messageStatuses } from '../../data/adminTabs';
import { formatDateTime } from '../../utils/format';

export default function MessageCard({ message, onStatusChange }) {
  const mailto = `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent('Lunairis Café - ' + message.topic)}`;

  return (
    <article className="message-card">
      <div>
        <h3>{message.name} <span className="status-pill">{message.status}</span></h3>
        <div className="message-meta">
          {message.email} · {message.topic} · {formatDateTime(message.createdAt)}
        </div>
        <p>{message.message}</p>
        <a href={mailto}>Responder por correo ↗</a>
      </div>
      <select
        aria-label="Estado del mensaje"
        value={message.status}
        onChange={(event) => onStatusChange(message.id, event.target.value)}
      >
        {messageStatuses.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    </article>
  );
}
