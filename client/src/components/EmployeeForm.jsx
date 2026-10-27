import { useState, useEffect } from 'react'

const EMPTY_FORM = {
  name: '',
  email: '',
  department: '',
  jobTitle: '',
  phone: '',
  joiningDate: '',
}

function FormField({ name, label, type = 'text', placeholder, value, onChange, error }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control-custom ${error ? 'error' : ''}`}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}

function EmployeeForm({ employee, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  // Pre-fill form when editing
  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department || '',
        jobTitle: employee.jobTitle || '',
        phone: employee.phone || '',
        joiningDate: employee.joiningDate
          ? new Date(employee.joiningDate).toISOString().split('T')[0]
          : '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [employee])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.department.trim()) errs.department = 'Department is required'
    if (!form.jobTitle.trim()) errs.jobTitle = 'Job title is required'
    if (!form.phone.trim()) errs.phone = 'Phone is required'
    if (!form.joiningDate) errs.joiningDate = 'Joining date is required'
    return errs
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit(form)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>{employee ? 'Edit Employee' : 'Add New Employee'}</h5>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <FormField name="name" label="Full Name" placeholder="Jane Doe" value={form.name} onChange={handleChange} error={errors.name} />
              <FormField name="email" label="Email" type="email" placeholder="jane@example.com" value={form.email} onChange={handleChange} error={errors.email} />
              <FormField name="department" label="Department" placeholder="Engineering" value={form.department} onChange={handleChange} error={errors.department} />
              <FormField name="jobTitle" label="Job Title" placeholder="Software Engineer" value={form.jobTitle} onChange={handleChange} error={errors.jobTitle} />
              <FormField name="phone" label="Phone" placeholder="9876543210" value={form.phone} onChange={handleChange} error={errors.phone} />
              <FormField name="joiningDate" label="Joining Date" type="date" value={form.joiningDate} onChange={handleChange} error={errors.joiningDate} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-outline-custom" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom" disabled={loading}>
              {loading ? 'Saving…' : employee ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmployeeForm
