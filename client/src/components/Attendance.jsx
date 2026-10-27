import { useState, useEffect } from 'react'
import API from '../api/axiosConfig'

const STATUS_COLORS = {
  Present: { bg: '#dcfce7', color: '#16a34a' },
  Absent: { bg: '#fef2f2', color: '#dc2626' },
  'On Leave': { bg: '#fef3c7', color: '#d97706' },
}

function Attendance() {
  const [records, setRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [form, setForm] = useState(() => ({
    employee: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    note: '',
  }))
  const [formErrors, setFormErrors] = useState({})

  // Filters
  const [filterDate, setFilterDate] = useState('')
  const [filterEmployee, setFilterEmployee] = useState('')

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  // Load employees for dropdown
  useEffect(() => {
    API.get('/employees')
      .then((r) => setEmployees(r.data.data || []))
      .catch(() => setError('Failed to load employees'))
  }, [])

  // Load attendance records
  const fetchRecords = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (filterDate) params.date = filterDate
      if (filterEmployee) params.employee = filterEmployee
      const res = await API.get('/attendance', { params })
      setRecords(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRecords() }, [filterDate, filterEmployee])

  const validate = () => {
    const errs = {}
    if (!form.employee) errs.employee = 'Select an employee'
    if (!form.date) errs.date = 'Date is required'
    if (!form.status) errs.status = 'Status is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFormErrors(errs); return }
    setSubmitLoading(true)
    setError('')
    try {
      await API.post('/attendance', form)
      showSuccess('Attendance marked successfully!')
      setForm({ employee: '', date: new Date().toISOString().split('T')[0], status: 'Present', note: '' })
      setFormErrors({})
      fetchRecords()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return
    try {
      await API.delete(`/attendance/${id}`)
      showSuccess('Record deleted')
      fetchRecords()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete record')
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: '' })
  }

  return (
    <div>
      <div className="page-header">
        <h2>Attendance</h2>
        <p>Mark and track daily employee attendance</p>
      </div>

      {error && <div className="alert-box error">⚠️ {error}</div>}
      {success && <div className="alert-box success">✓ {success}</div>}

      {/* Mark Attendance Form */}
      <div className="table-card mb-4">
        <div className="table-card-header"><h5>Mark Attendance</h5></div>
        <div style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Employee *</label>
                <select
                  name="employee"
                  value={form.employee}
                  onChange={handleChange}
                  className={`form-control-custom ${formErrors.employee ? 'error' : ''}`}
                >
                  <option value="">— Select Employee —</option>
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>{e.name} ({e.department})</option>
                  ))}
                </select>
                {formErrors.employee && <p className="form-error">{formErrors.employee}</p>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={`form-control-custom ${formErrors.date ? 'error' : ''}`}
                />
                {formErrors.date && <p className="form-error">{formErrors.date}</p>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Status *</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-control-custom"
                >
                  <option>Present</option>
                  <option>Absent</option>
                  <option>On Leave</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px', marginBottom: 0 }}>
              <label className="form-label">Note (optional)</label>
              <input
                type="text"
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="e.g. Half day, doctor appointment…"
                className="form-control-custom"
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <button type="submit" className="btn-primary-custom" disabled={submitLoading}>
                {submitLoading ? 'Saving…' : '✓ Mark Attendance'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Records Table */}
      <div className="table-card">
        <div className="table-card-header">
          <h5>Attendance Records</h5>
          <div className="table-toolbar">
            <input
              type="date"
              className="search-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              title="Filter by date"
            />
            <select
              className="filter-select"
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
            >
              <option value="">All Employees</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>{e.name}</option>
              ))}
            </select>
            {(filterDate || filterEmployee) && (
              <button
                className="btn-outline-custom"
                onClick={() => { setFilterDate(''); setFilterEmployee('') }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-state"><div className="spinner"></div><p>Loading records…</p></div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <p style={{ fontWeight: 500 }}>No attendance records found</p>
            <p style={{ fontSize: '0.85rem' }}>Use the form above to mark attendance</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 500 }}>{r.employee?.name || '—'}</td>
                    <td><span className="dept-badge">{r.employee?.department || '—'}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{r.date}</td>
                    <td>
                      <span style={{
                        background: STATUS_COLORS[r.status]?.bg,
                        color: STATUS_COLORS[r.status]?.color,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 500,
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{r.note || '—'}</td>
                    <td>
                      <button className="btn-icon danger" onClick={() => handleDelete(r._id)} title="Delete">🗑️</button>
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

export default Attendance
