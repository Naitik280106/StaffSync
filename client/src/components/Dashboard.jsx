import { useState, useEffect, useMemo } from 'react'
import API from '../api/axiosConfig'

function Dashboard({ onNavigate }) {
  const [employees, setEmployees] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      API.get('/employees').catch(() => ({ data: { data: [] } })),
      API.get('/announcements').catch(() => ({ data: { data: [] } })),
    ]).then(([empRes, annRes]) => {
      setEmployees(empRes.data.data || [])
      setAnnouncements(annRes.data.data || [])
    }).catch(() => setError('Could not load data. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const deptMap = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1
    return acc
  }, {})
  const departments = Object.entries(deptMap).sort((a, b) => b[1] - a[1])

  const recent = [...employees]
    .sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate))
    .slice(0, 3)

  const joinedThisMonthCount = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    return employees.filter((e) => {
      if (!e.joiningDate) return false
      const d = new Date(e.joiningDate)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    }).length
  }, [employees])

  const initials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome back — here's your workforce overview</p>
      </div>

      {error && <div className="alert-box error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading data…</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon purple">👥</div>
                <div className="stat-info"><h3>{employees.length}</h3><p>Total Employees</p></div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon blue">🏢</div>
                <div className="stat-info"><h3>{departments.length}</h3><p>Departments</p></div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon green">🆕</div>
                <div className="stat-info">
                  <h3>{joinedThisMonthCount}</h3>
                  <p>Joined This Month</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon orange">📢</div>
                <div className="stat-info"><h3>{announcements.length}</h3><p>Announcements</p></div>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            {/* Department Breakdown */}
            <div className="col-lg-6">
              <div className="table-card">
                <div className="table-card-header"><h5>Department Breakdown</h5></div>
                <div style={{ padding: '16px 20px' }}>
                  {departments.length === 0 ? (
                    <p className="text-center text-muted py-3">No data yet</p>
                  ) : (
                    <ul className="dept-list">
                      {departments.map(([dept, count]) => (
                        <li key={dept}>
                          <span style={{ minWidth: '110px' }}>{dept}</span>
                          <div className="dept-bar-bg">
                            <div className="dept-bar-fill" style={{ width: `${(count / employees.length) * 100}%` }} />
                          </div>
                          <span className="dept-count">{count}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Hires */}
            <div className="col-lg-6">
              <div className="table-card">
                <div className="table-card-header">
                  <h5>Recent Hires</h5>
                  <button className="btn-primary-custom" onClick={() => onNavigate('employees')}>View All</button>
                </div>
                <div>
                  {recent.length === 0 ? (
                    <div className="empty-state" style={{ padding: '30px' }}><p>No employees yet</p></div>
                  ) : (
                    recent.map((emp) => (
                      <div key={emp._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
                        <div className="avatar">{initials(emp.name)}</div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{emp.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{emp.jobTitle} · {emp.department}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {new Date(emp.joiningDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Announcements on Dashboard */}
          <div className="table-card">
            <div className="table-card-header">
              <h5>Latest Announcements</h5>
              <button className="btn-primary-custom" onClick={() => onNavigate('announcements')}>View All</button>
            </div>
            {announcements.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px' }}>
                <p style={{ fontSize: '0.85rem' }}>No announcements yet</p>
              </div>
            ) : (
              announcements.slice(0, 3).map((a) => (
                <div key={a._id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>📢 {a.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(a.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {a.message.length > 120 ? a.message.slice(0, 120) + '…' : a.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
