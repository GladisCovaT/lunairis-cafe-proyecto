import MessageCard from './MessageCard.jsx';

export default function MessagesTab({ active, messages, onStatusChange }) {
  const list = messages || [];

  return (
    <section className={`admin-tab${active ? ' active' : ''}`} id="tab-messages">
      <div className="tab-intro">
        <div>
          <p className="eyebrow">ESCUCHAR TAMBIÉN ES CUIDAR</p>
          <h2>Mensajes recibidos.</h2>
          <p>Lee las propuestas y conversaciones que llegan a Lunairis.</p>
        </div>
        <span className="panel-chip" id="messagesCountLabel">{list.length} mensajes</span>
      </div>

      <div className="message-list" id="adminMessageList">
        {list.length === 0 ? (
          <div className="panel-card empty-state">
            Aún no hay mensajes. Cuando alguien escriba desde el sitio, aparecerá aquí.
          </div>
        ) : (
          list.map((message) => (
            <MessageCard key={message.id} message={message} onStatusChange={onStatusChange} />
          ))
        )}
      </div>
    </section>
  );
}
