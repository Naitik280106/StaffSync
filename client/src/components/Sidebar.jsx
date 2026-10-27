function Sidebar({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'dashboard',     label: 'Dashboard',     icon: '📊' },
    { id: 'employees',     label: 'Employees',     icon: '👥' },
    { id: 'attendance',    label: 'Attendance',    icon: '📅' },
    { id: 'leaves',        label: 'Leave Requests', icon: '🗓️' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h4>⚡ StaffSync</h4>
        <span>HR Management System</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
