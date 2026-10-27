function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-body" style={{ textAlign: 'center', paddingTop: '28px' }}>
          <div className="confirm-icon">⚠️</div>
          <h5 style={{ marginBottom: '8px' }}>Confirm Delete</h5>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{message}</p>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn-outline-custom" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn-danger-custom" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
