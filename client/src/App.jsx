import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Employees from './components/Employees'
import Attendance from './components/Attendance'
import Leaves from './components/Leaves'
import Announcements from './components/Announcements'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':     return <Dashboard onNavigate={setCurrentPage} />
      case 'employees':     return <Employees />
      case 'attendance':    return <Attendance />
      case 'leaves':        return <Leaves />
      case 'announcements': return <Announcements />
      default:              return <Dashboard onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
