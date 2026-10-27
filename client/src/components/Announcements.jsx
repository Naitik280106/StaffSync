import { useState, useEffect } from 'react'
import API from '../api/axiosConfig'

function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editTarget, setEditTarget] = useState(null) // null = create mode, object = edit mode

  const [form, setForm] = useState({ title: '', message: '', date: '' })
  const [formErrors, setFormErrors] = useState({})
  const [showForm, setShowForm] = useState(false)

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }

  const fetchAnnouncements = async () => {
    setLoading(true); setError('')
    try {
      const res = await API.get('/announcements')
      setAnnouncements(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load announcements')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchAnnouncements() }, [])

  const openCreate = () => {
    setEditTarget(null)
    setForm({ title: '', message: '', date: new Date().toISOString().split('T')[0] })
    setFormErrors({})
    setShowForm(true)
  }

  const openEdit = (a) => {
    setEditTarget(a)
    setForm({
      title: a.title,
      message: a.message,
      date: new Date(a.date).toISOString().split('T')[0],
    })
    setFormErrors({})
    setShowForm(true)
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFormErrors(errs); return }
    setSubmitLoading(true); setError('')
    try {
      if (editTarget) {
        await API.put(`/announcements/${editTarget._id}`, form)
        showSuccess('Announcement updated!')
      } else {
        await API.post('/announcements', form)
        showSuccess('Announcement posted!')
      }
      setShowForm(false)
      setEditTarget(null)
      fetchAnnouncements()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save announcement')
    } finally { setSubmitLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return
    try {
      await API.delete(`/announcements/${id}`)
      showSuccess('Announcement deleted')
      fetchAnnouncements()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete')
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: '' })
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2>Announcements</h2>
          <p>Company-wide announcements and notices</p>
        </div>
        <button className="btn-primary-custom" onClick={openCreate}>
          ＋ New Announcement
        </button>
      </div>

      {error && <div className="alert-box error">⚠️ {error}</div>}
      {success && <div className="alert-box success">✓ {success}</div>}

      {/* Form */}
      {showForm && (
        <div className="table-card mb-4">
          <div className="table-card-header">
            <h5>{editTarget ? 'Edit Announcement' : 'New Announcement'}</h5>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ padding: '20px' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange}
                    placeholder="Announcement title"
                    className={`form-control-custom ${formErrors.title ? 'error' : ''}`} />
                  {formErrors.title && <p className="form-error">{formErrors.title}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange}
                    className="form-control-custom" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                  placeholder="Write the announcement message…"
                  className={`form-control-custom ${formErrors.message ? 'error' : ''}`}
                  style={{ resize: 'vertical' }} />
                {formErrors.message && <p className="form-error">{formErrors.message}</p>}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn-primary-custom" disabled={submitLoading}>
                  {submitLoading ? 'Saving…' : editTarget ? 'Update' : 'Post Announcement'}
                </button>
                <button type="button" className="btn-outline-custom"
                  onClick={() => { setShowForm(false); setEditTarget(null) }}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Loading…</p></div>
      ) : announcements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📢</div>
          <p style={{ fontWeight: 500 }}>No announcements yet</p>
          <p style={{ fontSize: '0.85rem' }}>Click "New Announcement" to post one</p>
          <button className="btn-primary-custom" onClick={openCreate}>＋ New Announcement</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {announcements.map((a) => (
            <div key={a._id} className="table-card" style={{ padding: 0 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.3rem' }}>📢</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{a.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-icon edit" onClick={() => openEdit(a)} title="Edit">✏️</button>
                  <button className="btn-icon danger" onClick={() => handleDelete(a._id)} title="Delete">🗑️</button>
                </div>
              </div>
              <div style={{ padding: '14px 20px', color: 'var(--text-dark)', lineHeight: 1.6, fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                {a.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Announcements
