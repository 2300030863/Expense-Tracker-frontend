import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, CreditCard, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { GoogleLogin } from '@react-oauth/google'

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    // Save username for forgot password feature
    localStorage.setItem('lastUsername', formData.username)

    try {
      const result = await login(formData)
      if (result.success) {
        toast.success('Login successful!')
        navigate('/dashboard')
      } else {
        console.error('Login failed:', result.error)
        const errorMsg = typeof result.error === 'string' ? result.error : 'Login failed'
        setErrorMessage(errorMsg)
        // Show toast for non-blocked errors
        if (!errorMsg.toLowerCase().includes('block')) {
          toast.error(errorMsg)
        }
      }
    } catch (error) {
      const errorMsg = 'An unexpected error occurred'
      setErrorMessage(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true)
    setErrorMessage('')
    
    try {
      // Send the Google token to your backend for verification
      const result = await login({ 
        googleToken: credentialResponse.credential 
      })
      
      if (result.success) {
        toast.success('Login with Google successful!')
        navigate('/dashboard')
      } else {
        const errorMsg = typeof result.error === 'string' ? result.error : 'Google login failed'
        setErrorMessage(errorMsg)
        toast.error(errorMsg)
      }
    } catch (error) {
      const errorMsg = 'Google login failed. Please try again.'
      setErrorMessage(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    toast.error('Google login failed')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <CreditCard className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className={`rounded-md border-2 p-4 ${
              errorMessage.toLowerCase().includes('block') 
                ? 'bg-red-100 border-red-400' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className={`h-6 w-6 ${
                    errorMessage.toLowerCase().includes('block') 
                      ? 'text-red-600' 
                      : 'text-red-400'
                  }`} />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className={`text-base font-semibold ${
                    errorMessage.toLowerCase().includes('block') 
                      ? 'text-red-900' 
                      : 'text-red-800'
                  }`}>
                    {errorMessage.toLowerCase().includes('block') ? '⚠️ Account Blocked' : 'Login Failed'}
                  </h3>
                  <div className="mt-2 text-sm text-red-800">
                    <p className="font-medium">{errorMessage}</p>
                    {errorMessage.toLowerCase().includes('block') && (
                      <p className="mt-2 text-xs text-red-700">
                        Please contact your administrator for more information.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login



