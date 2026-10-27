import { useState, useEffect } from 'react'
import API from '../api/axiosConfig'
import EmployeeForm from './EmployeeForm'
import ConfirmModal from './ConfirmModal'
import EmployeeDetail from './EmployeeDetail'

function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Modal state
  const [showForm, setShowForm] = useState(false)
  const [editEmployee, setEditEmployee] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewEmployee, setViewEmployee] = useState(null)

  // Filters
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')

  // ── Fetch all employees ──────────────────────────────────
  const fetchEmployees = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await API.get('/employees')
      setEmployees(res.data.data || [])
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to load employees. Is the backend running and MongoDB connected?'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  // ── Create ───────────────────────────────────────────────
  const handleCreate = async (formData) => {
    setFormLoading(true)
    setError('')
    try {
      await API.post('/employees', formData)
      showSuccess('Employee added successfully!')
      setShowForm(false)
      fetchEmployees()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create employee')
    } finally {
      setFormLoading(false)
    }
  }

  // ── Update ───────────────────────────────────────────────
  const handleUpdate = async (formData) => {
    setFormLoading(true)
    setError('')
    try {
      await API.put(`/employees/${editEmployee._id}`, formData)
      showSuccess('Employee updated successfully!')
      setEditEmployee(null)
      fetchEmployees()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee')
    } finally {
      setFormLoading(false)
    }
  }

  // ── Delete ───────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true)
    setError('')
    try {
      await API.delete(`/employees/${deleteTarget._id}`)
      showSuccess('Employee deleted.')
      setDeleteTarget(null)
      fetchEmployees()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete employee')
    } finally {
      setDeleteLoading(false)
    }
  }

  // ── Filter ───────────────────────────────────────────────
  const departments = [...new Set(employees.map((e) => e.department))].sort()

  const filtered = employees.filter((emp) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.jobTitle.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q)
    const matchDept = !deptFilter || emp.department === deptFilter
    return matchSearch && matchDept
  })

  const initials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2>Employees</h2>
          <p>{employees.length} total employee{employees.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary-custom" onClick={() => setShowForm(true)}>
          ＋ Add Employee
        </button>
      </div>

      {error && <div className="alert-box error">⚠️ {error}</div>}
      {success && <div className="alert-box success">✓ {success}</div>}

      <div className="table-card">
        <div className="table-card-header">
          <h5>Employee Directory</h5>
          <div className="table-toolbar">
            <input
              type="text"
              className="search-input"
              placeholder="🔍  Search name, email, title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="filter-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading employees…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <p style={{ fontWeight: 500 }}>
              {employees.length === 0 ? 'No employees yet' : 'No results found'}
            </p>
            <p style={{ fontSize: '0.85rem' }}>
              {employees.length === 0
                ? 'Click "Add Employee" to get started'
                : 'Try adjusting your search or filter'}
            </p>
            {employees.length === 0 && (
              <button className="btn-primary-custom" onClick={() => setShowForm(true)}>
                ＋ Add First Employee
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Job Title</th>
                  <th>Phone</th>
                  <th>Joining Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div className="employee-name-cell">
                        <div className="avatar">{initials(emp.name)}</div>
                        <span
                          style={{ fontWeight: 500, cursor: 'pointer', color: 'var(--primary)' }}
                          onClick={() => setViewEmployee(emp)}
                        >
                          {emp.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{emp.email}</td>
                    <td><span className="dept-badge">{emp.department}</span></td>
                    <td>{emp.jobTitle}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{emp.phone}</td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {new Date(emp.joiningDate).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn-icon edit"
                          onClick={() => setEditEmployee(emp)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => setDeleteTarget(emp)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={null}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          loading={formLoading}
        />
      )}

      {/* Edit Form Modal */}
      {editEmployee && (
        <EmployeeForm
          employee={editEmployee}
          onSubmit={handleUpdate}
          onClose={() => setEditEmployee(null)}
          loading={formLoading}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmModal
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* Detail View */}
      {viewEmployee && (
        <EmployeeDetail
          employee={viewEmployee}
          onClose={() => setViewEmployee(null)}
          onEdit={(emp) => setEditEmployee(emp)}
        />
      )}
    </div>
  )
}

export default Employees
