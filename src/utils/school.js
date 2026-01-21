/**
 * Get the current school ID from localStorage
 * @returns {string|null} The school ID or null if not set
 */
export function getSchoolId () {
  return localStorage.getItem('hallpass_schoolId')
}

/**
 * Get the current school name from localStorage
 * @returns {string|null} The school name or null if not set
 */
export function getSchoolName () {
  return localStorage.getItem('hallpass_schoolName')
}

/**
 * Clear school data from localStorage (logout)
 */
export function clearSchool () {
  localStorage.removeItem('hallpass_schoolId')
  localStorage.removeItem('hallpass_schoolName')
}
