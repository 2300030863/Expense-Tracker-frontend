import { NavLink } from 'react-router-dom'
import { 
  Home, 
  CreditCard, 
  Tag, 
  Wallet, 
  Target, 
  BarChart3,
  Repeat,
  User,
  Menu,
  X,
  Shield,
  Crown
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const userNavigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: Home },
  { name: 'Transactions', href: '/app/transactions', icon: CreditCard },
  { name: 'Recurring', href: '/app/recurring-transactions', icon: Repeat },
  { name: 'Categories', href: '/app/categories', icon: Tag },
  { name: 'Accounts', href: '/app/accounts', icon: Wallet },
  { name: 'Budgets', href: '/app/budgets', icon: Target },
  { name: 'Reports', href: '/app/reports', icon: BarChart3 },
  { name: 'Profile', href: '/app/profile', icon: User },
]

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/app/admin', icon: Shield },
]

const ownerNavigation = [
  { name: 'Owner Dashboard', href: '/app/owner', icon: Crown },
]

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  
  const isOwner = user?.role === 'ROLE_OWNER'
  const isAdmin = user?.role === 'ROLE_ADMIN'
  const isGroupMember = user?.isGroupMember
  
  // Build navigation based on role
  let navigation = [...userNavigation]
  
  // Remove budgets and recurring transactions for group members only (admins and owners can see all)
  if (isGroupMember && !isAdmin && !isOwner) {
    navigation = navigation.filter(item => item.name !== 'Budgets' && item.name !== 'Recurring')
  }
  
  if (isOwner) {
    navigation = [...ownerNavigation, ...navigation]
  } else if (isAdmin) {
    navigation = [...adminNavigation, ...navigation]
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
          <h1 className="text-xl font-bold text-white">Expense Tracker</h1>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    <Icon size={20} className="mr-3" />
                    {item.name}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Sidebar



