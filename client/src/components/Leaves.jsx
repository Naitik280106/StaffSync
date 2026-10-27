import { useState, useEffect } from 'react'
import API from '../api/axiosConfig'

const STATUS_STYLES = {
  Pending:  { bg: '#fef3c7', color: '#d97706' },
  Approved: { bg: '#dcfce7', color: '#16a34a' },
  Rejected: { bg: '#fef2f2', color: '#dc2626' },
}

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Other']

function Leaves() {
  const [leaves, setLeaves] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')

  const [form, setForm] = useState({
    employee: '', leaveType: 'Sick Leave',
    startDate: '', endDate: '', reason: '',
  })
  const [formErrors, setFormErrors] = useState({})

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }

  useEffect(() => {
    API.get('/employees').then((r) => setEmployees(r.data.data || [])).catch(() => {})
  }, [])

  const fetchLeaves = async () => {
    setLoading(true); setError('')
    try {
      const params = {}
      if (filterStatus) params.status = filterStatus
      const res = await API.get('/leaves', { params })
      setLeaves(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load leave requests')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchLeaves() }, [filterStatus])

  const validate = () => {
    const errs = {}
    if (!form.employee) errs.employee = 'Select an employee'
    if (!form.startDate) errs.startDate = 'Start date required'
    if (!form.endDate) errs.endDate = 'End date required'
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate))
      errs.endDate = 'End date must be after start date'
    if (!form.reason.trim()) errs.reason = 'Reason is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFormErrors(errs); return }
    setSubmitLoading(true); setError('')
    try {
      await API.post('/leaves', form)
      showSuccess('Leave request submitted!')
      setForm({ employee: '', leaveType: 'Sick Leave', startDate: '', endDate: '', reason: '' })
      setFormErrors({})
      setShowForm(false)
      fetchLeaves()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request')
    } finally { setSubmitLoading(false) }
  }

  const handleStatus = async (id, status) => {
    setError('')
    try {
      await API.put(`/leaves/${id}/status`, { status })
      showSuccess(`Leave request ${status.toLowerCase()}`)
      fetchLeaves()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this leave request?')) return
    try {
      await API.delete(`/leaves/${id}`)
      showSuccess('Leave request deleted')
      fetchLeaves()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete')
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: '' })
  }

  const daysBetween = (s, e) => {
    const diff = new Date(e) - new Date(s)
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1)
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2>Leave Management</h2>
          <p>Manage employee leave requests</p>
        </div>
        <button className="btn-primary-custom" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '＋ New Request'}
        </button>
      </div>

      {error && <div className="alert-box error">⚠️ {error}</div>}
      {success && <div className="alert-box success">✓ {success}</div>}

      {/* Form */}
      {showForm && (
        <div className="table-card mb-4">
          <div className="table-card-header"><h5>New Leave Request</h5></div>
          <form onSubmit={handleSubmit}>
            <div style={{ padding: '20px' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Employee *</label>
                  <select name="employee" value={form.employee} onChange={handleChange}
                    className={`form-control-custom ${formErrors.employee ? 'error' : ''}`}>
                    <option value="">— Select Employee —</option>
                    {employees.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
                  </select>
                  {formErrors.employee && <p className="form-error">{formErrors.employee}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Leave Type *</label>
                  <select name="leaveType" value={form.leaveType} onChange={handleChange} className="form-control-custom">
                    {LEAVE_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
                    className={`form-control-custom ${formErrors.startDate ? 'error' : ''}`} />
                  {formErrors.startDate && <p className="form-error">{formErrors.startDate}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">End Date *</label>
                  <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
                    min={form.startDate}
                    className={`form-control-custom ${formErrors.endDate ? 'error' : ''}`} />
                  {formErrors.endDate && <p className="form-error">{formErrors.endDate}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason *</label>
                <textarea name="reason" value={form.reason} onChange={handleChange} rows={3}
                  placeholder="Brief reason for leave…"
                  className={`form-control-custom ${formErrors.reason ? 'error' : ''}`}
                  style={{ resize: 'vertical' }} />
                {formErrors.reason && <p className="form-error">{formErrors.reason}</p>}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn-primary-custom" disabled={submitLoading}>
                  {submitLoading ? 'Submitting…' : 'Submit Request'}
                </button>
                <button type="button" className="btn-outline-custom" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="table-card">
        <div className="table-card-header">
          <h5>Leave Requests</h5>
          <div className="table-toolbar">
            <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state"><div className="spinner"></div><p>Loading…</p></div>
        ) : leaves.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗓️</div>
            <p style={{ fontWeight: 500 }}>No leave requests</p>
            <p style={{ fontSize: '0.85rem' }}>Click "New Request" to submit one</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{l.employee?.name || '—'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{l.employee?.department}</div>
                    </td>
                    <td><span className="dept-badge">{l.leaveType}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(l.startDate).toLocaleDateString()}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(l.endDate).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600 }}>{daysBetween(l.startDate, l.endDate)}</td>
                    <td style={{ maxWidth: 180, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span title={l.reason}>{l.reason.length > 40 ? l.reason.slice(0, 40) + '…' : l.reason}</span>
                    </td>
                    <td>
                      <span style={{
                        background: STATUS_STYLES[l.status]?.bg,
                        color: STATUS_STYLES[l.status]?.color,
                        padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 500,
                      }}>{l.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {l.status === 'Pending' && (
                          <>
                            <button className="btn-icon edit" onClick={() => handleStatus(l._id, 'Approved')} title="Approve">✅</button>
                            <button className="btn-icon danger" onClick={() => handleStatus(l._id, 'Rejected')} title="Reject">❌</button>
                          </>
                        )}
                        <button className="btn-icon danger" onClick={() => handleDelete(l._id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaves
