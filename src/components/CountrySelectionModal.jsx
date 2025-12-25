import { useState } from 'react'
import { Globe, X } from 'lucide-react'
import { COUNTRIES, getCurrencyInfo } from '../utils/currency'
import { profileAPI } from '../services/api'
import toast from 'react-hot-toast'

function CountrySelectionModal({ isOpen, onClose, onCountrySelected, userProfile }) {
  const [selectedCountry, setSelectedCountry] = useState('India')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // Fetch current profile and update with selected country
      const currentProfile = userProfile || (await profileAPI.get()).data
      
      // Update user profile with all fields including new country
      await profileAPI.update({
        username: currentProfile.username,
        email: currentProfile.email,
        firstName: currentProfile.firstName || '',
        lastName: currentProfile.lastName || '',
        country: selectedCountry
      })
      
      toast.success(`Currency set to ${getCurrencyInfo(selectedCountry).name}`)
      onCountrySelected(selectedCountry)
      onClose()
    } catch (error) {
      console.error('Failed to save country:', error)
      const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to save country preference'
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  const currencyInfo = getCurrencyInfo(selectedCountry)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-primary-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Select Your Country
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Welcome!</span> Please select your country to set the appropriate currency symbol for your transactions.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Currency Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Currency Preview</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Currency:</span>
                    <span className="font-medium">{currencyInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Symbol:</span>
                    <span className="font-medium text-lg">{currencyInfo.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Code:</span>
                    <span className="font-medium">{currencyInfo.code}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <span className="text-xs text-gray-500">Example:</span>
                    <div className="text-xl font-bold text-primary-600 mt-1">
                      {currencyInfo.symbol}1,234.56
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                You can change this later in your profile settings.
              </p>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Country'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CountrySelectionModal
