"use client";

import { useState, useEffect } from 'react'
import { X, User, Mail, Phone, MapPin, Building, FileText } from 'lucide-react'
import { Client } from '@/types'

interface CustomerFormProps {
  customer?: Client | null
  onSubmit: (customerData: Partial<Client>) => Promise<void>
  onCancel: () => void
}

export default function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    company_name: '',
    is_professional: false,
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (customer) {
      setFormData({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        company_name: customer.company_name || '',
        is_professional: customer.is_professional || false,
        notes: customer.notes || ''
      })
    }
  }, [customer])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is not valid'
    }

    if (formData.phone && !/^[+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is not valid'
    }

    if (formData.is_professional && !formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required for professional customers'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user modifies the field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-2xl font-black text-slate-900">
            {customer ? 'Edit Customer' : 'Add Customer'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Customer Type */}
          <div className="mb-6">
            <label className="block text-sm font-black text-slate-700 uppercase tracking-wider mb-3">
              Customer Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="customerType"
                  checked={!formData.is_professional}
                  onChange={() => handleInputChange('is_professional', false)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300"
                />
                <span className="ml-2 text-sm text-slate-700">Individual</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="customerType"
                  checked={formData.is_professional}
                  onChange={() => handleInputChange('is_professional', true)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300"
                />
                <span className="ml-2 text-sm text-slate-700">Professional</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="form-label">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  className={`input pl-12 ${errors.first_name ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="form-label">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  className={`input pl-12 ${errors.last_name ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
              )}
            </div>

            {/* Company Name (if professional) */}
            {formData.is_professional && (
              <div className="md:col-span-2">
                <label className="form-label">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    className={`input pl-12 ${errors.company_name ? 'border-red-300 focus:border-red-500' : ''}`}
                    placeholder="Company name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.company_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="form-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  className={`input pl-12 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="form-label">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  className={`input pl-12 ${errors.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="+221 77 123 45 67"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="form-label">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <textarea
                  className="input pl-12 min-h-[80px] resize-none"
                  placeholder="Full address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="form-label">Notes</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <textarea
                  className="input pl-12 min-h-[100px] resize-none"
                  placeholder="Additional notes about the customer..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {customer ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  {customer ? 'Update' : 'Add'} Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
