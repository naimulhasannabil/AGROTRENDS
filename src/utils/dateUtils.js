/**
 * Date Utility Functions
 * Handles custom date formats from the backend API
 */

/**
 * Formats a date string or timestamp into a readable format
 * Handles multiple date formats:
 * - Custom format: "29-01-2026 02:52:40" (DD-MM-YYYY HH:mm:ss)
 * - Unix timestamp: 1769676760
 * - ISO string: "2026-01-29T02:52:40.000Z"
 * 
 * @param {string|number} dateString - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string or 'N/A' if invalid
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A'
  
  try {
    let date
    
    // Handle timestamp (number)
    if (typeof dateString === 'number') {
      // Check if it's in seconds (Unix timestamp) or milliseconds
      const timestamp = dateString < 10000000000 ? dateString * 1000 : dateString
      date = new Date(timestamp)
    } 
    // Handle string dates
    else if (typeof dateString === 'string') {
      // Check if it's in custom format: "DD-MM-YYYY HH:mm:ss"
      if (dateString.includes('-') && dateString.split('-')[0].length <= 2) {
        // Parse custom format: "29-01-2026 02:52:40"
        const [datePart, timePart] = dateString.split(' ')
        const [day, month, year] = datePart.split('-')
        
        if (timePart) {
          const [hours, minutes, seconds] = timePart.split(':')
          // Create date object (month is 0-indexed in JavaScript)
          date = new Date(
            parseInt(year), 
            parseInt(month) - 1, 
            parseInt(day),
            parseInt(hours || 0),
            parseInt(minutes || 0),
            parseInt(seconds || 0)
          )
        } else {
          // Date only, no time
          date = new Date(
            parseInt(year), 
            parseInt(month) - 1, 
            parseInt(day)
          )
        }
      } else {
        // Try parsing as ISO string or other standard format
        date = new Date(dateString)
      }
    } else {
      return 'N/A'
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString)
      return 'N/A'
    }
    
    // Default formatting options
    const defaultOptions = {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      ...options
    }
    
    return date.toLocaleDateString('en-US', defaultOptions)
  } catch (error) {
    console.error('Error formatting date:', error, dateString)
    return 'N/A'
  }
}

/**
 * Formats a date with time
 * @param {string|number} dateString - The date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateString) => {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formats a date as a short date (MM/DD/YYYY)
 * @param {string|number} dateString - The date to format
 * @returns {string} Formatted short date string
 */
export const formatShortDate = (dateString) => {
  return formatDate(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/**
 * Formats a date as a relative time (e.g., "2 hours ago", "Yesterday")
 * @param {string|number} dateString - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    let date
    
    // Use the same parsing logic
    if (typeof dateString === 'number') {
      const timestamp = dateString < 10000000000 ? dateString * 1000 : dateString
      date = new Date(timestamp)
    } else if (typeof dateString === 'string') {
      if (dateString.includes('-') && dateString.split('-')[0].length <= 2) {
        const [datePart, timePart] = dateString.split(' ')
        const [day, month, year] = datePart.split('-')
        const [hours = 0, minutes = 0, seconds = 0] = (timePart || '').split(':')
        date = new Date(
          parseInt(year), 
          parseInt(month) - 1, 
          parseInt(day),
          parseInt(hours),
          parseInt(minutes),
          parseInt(seconds)
        )
      } else {
        date = new Date(dateString)
      }
    }
    
    if (isNaN(date.getTime())) {
      return 'N/A'
    }
    
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      if (days === 1) return 'Yesterday'
      return `${days} days ago`
    } else {
      return formatDate(dateString)
    }
  } catch (error) {
    console.error('Error formatting relative time:', error, dateString)
    return 'N/A'
  }
}

/**
 * Parse custom date format to JavaScript Date object
 * @param {string} dateString - Date in format "DD-MM-YYYY HH:mm:ss"
 * @returns {Date|null} JavaScript Date object or null if invalid
 */
export const parseCustomDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null
  
  try {
    // Check if it's in custom format: "DD-MM-YYYY HH:mm:ss"
    if (dateString.includes('-') && dateString.split('-')[0].length <= 2) {
      const [datePart, timePart] = dateString.split(' ')
      const [day, month, year] = datePart.split('-')
      
      if (timePart) {
        const [hours, minutes, seconds] = timePart.split(':')
        return new Date(
          parseInt(year), 
          parseInt(month) - 1, 
          parseInt(day),
          parseInt(hours || 0),
          parseInt(minutes || 0),
          parseInt(seconds || 0)
        )
      } else {
        return new Date(
          parseInt(year), 
          parseInt(month) - 1, 
          parseInt(day)
        )
      }
    }
    
    // Try standard parsing
    return new Date(dateString)
  } catch (error) {
    console.error('Error parsing date:', error, dateString)
    return null
  }
}

export default {
  formatDate,
  formatDateTime,
  formatShortDate,
  formatRelativeTime,
  parseCustomDate
}