// Browser identifier utility
// Generates and stores a unique ID for this browser instance

const BROWSER_ID_KEY = 'hallpass_browserId'

export function getBrowserId () {
  let browserId = localStorage.getItem(BROWSER_ID_KEY)

  if (!browserId) {
    // Generate a unique ID for this browser
    browserId = generateBrowserId()
    localStorage.setItem(BROWSER_ID_KEY, browserId)
  }

  return browserId
}

function generateBrowserId () {
  // Generate a unique ID using timestamp + random
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${randomPart}`
}
