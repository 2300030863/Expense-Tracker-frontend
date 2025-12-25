import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="container mx-auto text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Expense Tracker. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Layout



