const EmptyState = ({ icon, title, message, actionButton }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionButton}
    </div>
  )
}

export default EmptyState
