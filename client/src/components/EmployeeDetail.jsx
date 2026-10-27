function EmployeeDetail({ employee, onClose, onEdit }) {
  const initials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  const rows = [
    { label: 'Email', value: employee.email },
    { label: 'Department', value: employee.department },
    { label: 'Job Title', value: employee.jobTitle },
    { label: 'Phone', value: employee.phone },
    {
      label: 'Joining Date',
      value: new Date(employee.joiningDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    },
    {
      label: 'Added On',
      value: new Date(employee.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    },
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>Employee Details</h5>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="detail-header">
          <div className="detail-avatar">{initials(employee.name)}</div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{employee.name}</div>
            <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>{employee.jobTitle}</div>
            <span
              style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '2px 10px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                marginTop: '4px',
                display: 'inline-block',
              }}
            >
              {employee.department}
            </span>
          </div>
        </div>
        <div className="detail-body">
          {rows.map((row) => (
            <div className="detail-row" key={row.label}>
              <span className="detail-label">{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn-outline-custom" onClick={onClose}>Close</button>
          <button className="btn-primary-custom" onClick={() => { onClose(); onEdit(employee) }}>
            ✏️ Edit
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDetail
