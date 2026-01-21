// Centralized error handler for Firebase operations
export default {
  handleError (error, userMessage = 'An error occurred. Please try again.') {
    console.error('Error:', error)

    // Extract user-friendly message from Firebase error
    let message = userMessage
    if (error.code) {
      switch (error.code) {
        case 'permission-denied':
          message = 'Permission denied. Please check your authentication.'
          break
        case 'unavailable':
          message =
            'Service is temporarily unavailable. Please try again later.'
          break
        case 'not-found':
          message = 'The requested item was not found.'
          break
        case 'already-exists':
          message = 'This item already exists.'
          break
        case 'failed-precondition':
          message = 'Operation failed. Please check your data and try again.'
          break
        default:
          if (error.message) {
            message = error.message
          }
      }
    } else if (error.message) {
      message = error.message
    }

    // In the future, this could trigger a toast notification or modal
    // For now, we'll return the message so components can handle it
    return {
      message,
      originalError: error
    }
  },

  // Helper method for common Firebase operation patterns
  async withErrorHandling (operation, userMessage) {
    try {
      return await operation()
    } catch (error) {
      const errorInfo = this.handleError(error, userMessage)
      throw errorInfo
    }
  }
}
