// DaisyUI Toast Utility
// This utility provides a simple interface for showing DaisyUI toasts

class ToastManager {
  constructor() {
    this.toastContainer = null
    this.init()
  }

  init() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
      this.toastContainer = document.createElement('div')
      this.toastContainer.id = 'toast-container'
      this.toastContainer.className = 'toast toast-top toast-end z-50'
      document.body.appendChild(this.toastContainer)
    } else {
      this.toastContainer = document.getElementById('toast-container')
    }
  }

  show(message, type = 'info', duration = 4000) {
    const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const toastElement = document.createElement('div')
    toastElement.id = toastId
    toastElement.className = `alert ${this.getAlertClass(type)} animate-fade-in`
    
    // Create toast content
    const icon = this.getIcon(type)
    const content = `
      <div class="flex items-center gap-3">
        ${icon}
        <span>${message}</span>
        <button class="btn btn-sm btn-circle btn-ghost" onclick="this.closest('.alert').remove()">
          ✕
        </button>
      </div>
    `
    
    toastElement.innerHTML = content
    this.toastContainer.appendChild(toastElement)
    
    // Auto remove after duration
    setTimeout(() => {
      const toast = document.getElementById(toastId)
      if (toast) {
        toast.classList.add('animate-slide-out')
        setTimeout(() => toast.remove(), 200)
      }
    }, duration)
    
    return toastId
  }

  getAlertClass(type) {
    switch (type) {
      case 'success':
        return 'alert-success'
      case 'error':
        return 'alert-error'
      case 'warning':
        return 'alert-warning'
      case 'info':
        return 'alert-info'
      default:
        return 'alert-info'
    }
  }

  getIcon(type) {
    switch (type) {
      case 'success':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `
      case 'error':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `
      case 'warning':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        `
      case 'info':
      default:
        return `
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `
    }
  }

  dismiss(id) {
    const toast = document.getElementById(id)
    if (toast) {
      toast.classList.add('animate-slide-out')
      setTimeout(() => toast.remove(), 200)
    }
  }

  dismissAll() {
    const toasts = this.toastContainer.querySelectorAll('.alert')
    toasts.forEach(toast => {
      toast.classList.add('animate-slide-out')
      setTimeout(() => toast.remove(), 200)
    })
  }
}

// Create global instance
const toast = new ToastManager()

// Export convenience methods
export const showToast = {
  success: (message, duration) => toast.show(message, 'success', duration),
  error: (message, duration) => toast.show(message, 'error', duration),
  warning: (message, duration) => toast.show(message, 'warning', duration),
  info: (message, duration) => toast.show(message, 'info', duration),
  loading: (message) => toast.show(message, 'info', Infinity),
  dismiss: (id) => toast.dismiss(id),
  dismissAll: () => toast.dismissAll()
}

export default showToast
