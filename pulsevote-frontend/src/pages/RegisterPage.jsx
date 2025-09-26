import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, loading, error, success, clearMessages } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => { clearMessages() }, [clearMessages])

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const getPasswordStrength = (password) => {
    let score = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    Object.values(checks).forEach(c => { if (c) score++ })
    return { score, checks }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!validateEmail(formData.email)) errors.email = 'Please enter a valid email address'

    if (!formData.password) errors.password = 'Password is required'
    else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters'
    else {
      const strength = getPasswordStrength(formData.password)
      if (strength.score < 3) errors.password = 'Password is too weak. Include uppercase, lowercase, numbers, and special characters.'
    }

    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match'

    if (!formData.acceptTerms) errors.acceptTerms = 'You must accept the terms and conditions'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    if (validationErrors[name]) setValidationErrors({ ...validationErrors, [name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearMessages()
    setIsSubmitting(true)
    if (!validateForm()) { setIsSubmitting(false); return }

    const result = await register(formData.email, formData.password)
    if (result.success) navigate('/dashboard', { replace: true })
    setIsSubmitting(false)
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const isFormValid = formData.email.trim() && formData.password && formData.confirmPassword && formData.acceptTerms && Object.values(validationErrors).every(v => !v)

  const strengthColor = (s) => (s < 2 ? 'text-error' : s < 4 ? 'text-warning' : 'text-success')
  const strengthText = (s) => (s < 2 ? 'Weak' : s < 4 ? 'Medium' : 'Strong')

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <h2 className="card-title text-2xl font-bold justify-center">Create Account</h2>
            <p className="text-base-content/70 mt-2">Join PulseVote today</p>
          </div>

          {error && (
            <div className="alert alert-error mb-4 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="form-control">
              <label className="label" htmlFor="email"><span className="label-text font-medium">Email Address</span></label>
              <div className="relative">
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className={`input input-bordered w-full pr-10 ${validationErrors.email ? 'input-error' : 'focus:input-primary'}`} autoComplete="email" aria-describedby={validationErrors.email ? 'email-error' : undefined} required />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
              </div>
              {validationErrors.email && (<label className="label"><span id="email-error" className="label-text-alt text-error">{validationErrors.email}</span></label>)}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password"><span className="label-text font-medium">Password</span></label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" className={`input input-bordered w-full pr-10 ${validationErrors.password ? 'input-error' : 'focus:input-primary'}`} autoComplete="new-password" aria-describedby={validationErrors.password ? 'password-error' : undefined} required />
                <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-base-200 rounded-md p-1 transition-colors" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/60 hover:text-base-content/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/60 hover:text-base-content/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((level) => (
                        <div key={level} className={`h-1 w-full rounded ${level <= passwordStrength.score ? (passwordStrength.score < 2 ? 'bg-error' : passwordStrength.score < 4 ? 'bg-warning' : 'bg-success') : 'bg-base-300'}`} />
                      ))}
                    </div>
                    <span className={`text-xs font-medium ${strengthColor(passwordStrength.score)}`}>{strengthText(passwordStrength.score)}</span>
                  </div>
                </div>
              )}

              {validationErrors.password && (<label className="label"><span id="password-error" className="label-text-alt text-error">{validationErrors.password}</span></label>)}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="confirmPassword"><span className="label-text font-medium">Confirm Password</span></label>
              <div className="relative">
                <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className={`input input-bordered w-full pr-10 ${validationErrors.confirmPassword ? 'input-error' : 'focus:input-primary'} ${formData.confirmPassword && formData.password === formData.confirmPassword ? 'input-success' : ''}`} autoComplete="new-password" aria-describedby={validationErrors.confirmPassword ? 'confirm-password-error' : undefined} required />
                <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-base-200 rounded-md p-1 transition-colors" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/60 hover:text-base-content/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/60 hover:text-base-content/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="mt-1 flex items-center gap-1 text-success text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  Passwords match
                </div>
              )}
              {validationErrors.confirmPassword && (<label className="label"><span id="confirm-password-error" className="label-text-alt text-error">{validationErrors.confirmPassword}</span></label>)}
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className={`checkbox checkbox-primary checkbox-sm ${validationErrors.acceptTerms ? 'checkbox-error' : ''}`} />
                <span className="label-text text-sm">I agree to the <a href="#" className="link link-primary">Terms and Conditions</a> and <a href="#" className="link link-primary">Privacy Policy</a></span>
              </label>
              {validationErrors.acceptTerms && (<span className="label-text-alt text-error text-xs mt-1">{validationErrors.acceptTerms}</span>)}
            </div>

            <div className="form-control mt-6">
              <button type="submit" className={`btn btn-primary w-full ${(loading || isSubmitting) ? 'loading' : ''} ${!isFormValid ? 'btn-disabled' : ''}`} disabled={loading || isSubmitting || !isFormValid}>
                {(loading || isSubmitting) ? (<><span className="loading loading-spinner loading-sm"></span>Creating account...</>) : ('Create Account')}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>
          <div className="text-center">
            <p className="text-sm text-base-content/70">Already have an account? <a href="/login" className="link link-primary font-medium">Sign in here</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage


