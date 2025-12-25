import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mail, ArrowLeft, CreditCard, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function ForgotPassword() {
  const { user } = useAuth()
  const location = useLocation()
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [lastUsername, setLastUsername] = useState('')

  // Auto-populate from last login
  useEffect(() => {
    // Get last username from localStorage
    const savedUsername = localStorage.getItem('lastUsername')
    if (savedUsername) {
      setLastUsername(savedUsername)
      setIdentifier(savedUsername)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/forgot-password', { identifier })
      toast.success(response.data.message || 'Password reset link sent to registered email')
      setEmailSent(true)
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send reset email'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              If your account is registered in our system, we've sent a password reset link to your registered email address.
            </p>
            <p className="mt-4 text-center text-sm text-gray-600">
              Click the link in the email to reset your password. The link will expire in 24 hours.
            </p>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> The reset link is automatically sent to the email address registered with your account, not to any email you entered. If you don't receive an email, the username/email may not be registered in our system.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Login
            </Link>
          </div>

          <div className="text-center text-sm text-gray-600">
            Didn't receive the email?{' '}
            <button
              onClick={() => setEmailSent(false)}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your username or email, and we'll send a password reset link to your registered email address.
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">🔒 How it works:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Enter your <strong>username</strong> or <strong>email</strong></li>
                  <li>Reset link will be sent <strong>automatically to your registered email</strong></li>
                  <li>Works for User, Admin, and Owner accounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
              Username or Email *
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="input-field pl-10"
                placeholder="Enter your username or email"
              />
            </div>
            <p className="mt-1 text-xs text-gray-600">
              Reset link will be sent to your registered email automatically
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center justify-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
