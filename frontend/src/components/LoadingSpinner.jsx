const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-spinner">
      <div className="text-center">
        <div className="spinner-border spinner-border-custom" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
