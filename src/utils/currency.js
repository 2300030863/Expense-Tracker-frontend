// Currency utility functions for country-based currency formatting

// Country to currency mapping
export const COUNTRY_CURRENCY_MAP = {
  'India': { code: 'INR', symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  'United States': { code: 'USD', symbol: '$', locale: 'en-US', name: 'US Dollar' },
  'United Kingdom': { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'British Pound' },
  'Canada': { code: 'CAD', symbol: 'C$', locale: 'en-CA', name: 'Canadian Dollar' },
  'Australia': { code: 'AUD', symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar' },
  'Germany': { code: 'EUR', symbol: '€', locale: 'de-DE', name: 'Euro' },
  'France': { code: 'EUR', symbol: '€', locale: 'fr-FR', name: 'Euro' },
  'Japan': { code: 'JPY', symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen' },
  'China': { code: 'CNY', symbol: '¥', locale: 'zh-CN', name: 'Chinese Yuan' },
  'Singapore': { code: 'SGD', symbol: 'S$', locale: 'en-SG', name: 'Singapore Dollar' },
  'United Arab Emirates': { code: 'AED', symbol: 'د.إ', locale: 'ar-AE', name: 'UAE Dirham' },
  'Saudi Arabia': { code: 'SAR', symbol: 'ر.س', locale: 'ar-SA', name: 'Saudi Riyal' },
  'Switzerland': { code: 'CHF', symbol: 'CHF', locale: 'de-CH', name: 'Swiss Franc' },
  'Sweden': { code: 'SEK', symbol: 'kr', locale: 'sv-SE', name: 'Swedish Krona' },
  'Norway': { code: 'NOK', symbol: 'kr', locale: 'nb-NO', name: 'Norwegian Krone' },
  'Denmark': { code: 'DKK', symbol: 'kr', locale: 'da-DK', name: 'Danish Krone' },
  'South Africa': { code: 'ZAR', symbol: 'R', locale: 'en-ZA', name: 'South African Rand' },
  'Brazil': { code: 'BRL', symbol: 'R$', locale: 'pt-BR', name: 'Brazilian Real' },
  'Mexico': { code: 'MXN', symbol: '$', locale: 'es-MX', name: 'Mexican Peso' },
  'South Korea': { code: 'KRW', symbol: '₩', locale: 'ko-KR', name: 'South Korean Won' },
  'Russia': { code: 'RUB', symbol: '₽', locale: 'ru-RU', name: 'Russian Ruble' },
  'Turkey': { code: 'TRY', symbol: '₺', locale: 'tr-TR', name: 'Turkish Lira' },
  'Indonesia': { code: 'IDR', symbol: 'Rp', locale: 'id-ID', name: 'Indonesian Rupiah' },
  'Malaysia': { code: 'MYR', symbol: 'RM', locale: 'ms-MY', name: 'Malaysian Ringgit' },
  'Thailand': { code: 'THB', symbol: '฿', locale: 'th-TH', name: 'Thai Baht' },
  'Philippines': { code: 'PHP', symbol: '₱', locale: 'en-PH', name: 'Philippine Peso' },
  'Vietnam': { code: 'VND', symbol: '₫', locale: 'vi-VN', name: 'Vietnamese Dong' },
  'Pakistan': { code: 'PKR', symbol: '₨', locale: 'en-PK', name: 'Pakistani Rupee' },
  'Bangladesh': { code: 'BDT', symbol: '৳', locale: 'bn-BD', name: 'Bangladeshi Taka' },
  'Sri Lanka': { code: 'LKR', symbol: 'Rs', locale: 'si-LK', name: 'Sri Lankan Rupee' },
  'New Zealand': { code: 'NZD', symbol: 'NZ$', locale: 'en-NZ', name: 'New Zealand Dollar' },
}

// List of countries for dropdown
export const COUNTRIES = Object.keys(COUNTRY_CURRENCY_MAP).sort()

// Get currency info for a country
export const getCurrencyInfo = (country) => {
  return COUNTRY_CURRENCY_MAP[country] || COUNTRY_CURRENCY_MAP['United States']
}

// Format currency based on country
export const formatCurrency = (amount, country) => {
  const currencyInfo = getCurrencyInfo(country)
  const value = parseFloat(amount || 0)
  
  try {
    return value.toLocaleString(currencyInfo.locale, {
      style: 'currency',
      currency: currencyInfo.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  } catch (error) {
    // Fallback formatting if locale is not supported
    return `${currencyInfo.symbol}${value.toFixed(2)}`
  }
}

// Get just the currency symbol
export const getCurrencySymbol = (country) => {
  return getCurrencyInfo(country).symbol
}

// Get currency code (e.g., USD, INR)
export const getCurrencyCode = (country) => {
  return getCurrencyInfo(country).code
}

// Get currency name (e.g., US Dollar, Indian Rupee)
export const getCurrencyName = (country) => {
  return getCurrencyInfo(country).name
}
