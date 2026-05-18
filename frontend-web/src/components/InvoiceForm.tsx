"use client";

import { useState, useEffect } from 'react'
import { X, FileText, User, Calendar, DollarSign, Hash } from 'lucide-react'
import { Invoice, Client } from '@/types'

interface InvoiceFormProps {
  invoice?: Invoice | null
  onSubmit: (invoiceData: Partial<Invoice>) => Promise<void>
  onCancel: () => void
}

export default function InvoiceForm({ invoice, onSubmit, onCancel }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    client_id: '',
    repair_id: '',
    invoice_number: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    total_amount: 0,
    status: 'pending' as "pending" | "paid" | "overdue" | "cancelled"
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
    if (invoice) {
      setFormData({
        client_id: invoice.client_id,
        repair_id: invoice.repair_id || '',
        invoice_number: invoice.invoice_number,
        issue_date: new Date(invoice.issue_date).toISOString().split('T')[0],
        due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '',
        total_amount: invoice.total_amount,
        status: invoice.status
      })
    } else {
      // Generate invoice number
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      setFormData(prev => ({ ...prev, invoice_number: `INV-${year}${month}-${random}` }))
    }
  }, [invoice])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.client_id) {
      newErrors.client_id = 'Le client est obligatoire'
    }

    if (!formData.invoice_number.trim()) {
      newErrors.invoice_number = 'Le numéro de facture est obligatoire'
    }

    if (!formData.issue_date) {
      newErrors.issue_date = 'La date d\'émission est obligatoire'
    }

    if (formData.total_amount < 0) {
      newErrors.total_amount = 'Le montant ne peut pas être négatif'
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

  const handleInputChange = (field: string, value: string | number) => {
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
            {invoice ? 'Modifier la facture' : 'Nouvelle facture'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client */}
            <div className="md:col-span-2">
              <label className="form-label">
                Client <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  className={`input pl-12 ${errors.client_id ? 'border-red-300 focus:border-red-500' : ''}`}
                  value={formData.client_id}
                  onChange={(e) => handleInputChange('client_id', e.target.value)}
                  disabled={isSubmitting || loading}
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.first_name} {client.last_name}
                      {client.is_professional && ` (${client.company_name})`}
                    </option>
                  ))}
                </select>
              </div>
              {errors.client_id && (
                <p className="mt-1 text-sm text-red-600">{errors.client_id}</p>
              )}
            </div>

            {/* Numéro de facture */}
            <div>
              <label className="form-label">
                Numéro de facture <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  className={`input pl-12 ${errors.invoice_number ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="INV-202405-0001"
                  value={formData.invoice_number}
                  onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.invoice_number && (
                <p className="mt-1 text-sm text-red-600">{errors.invoice_number}</p>
              )}
            </div>

            {/* Statut */}
            <div>
              <label className="form-label">Statut</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  className="input pl-12"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="pending">En attente</option>
                  <option value="paid">Payée</option>
                  <option value="overdue">En retard</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
            </div>

            {/* Date d'émission */}
            <div>
              <label className="form-label">
                Date d'émission <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  className={`input pl-12 ${errors.issue_date ? 'border-red-300 focus:border-red-500' : ''}`}
                  value={formData.issue_date}
                  onChange={(e) => handleInputChange('issue_date', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.issue_date && (
                <p className="mt-1 text-sm text-red-600">{errors.issue_date}</p>
              )}
            </div>

            {/* Date d'échéance */}
            <div>
              <label className="form-label">Date d'échéance</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  className="input pl-12"
                  value={formData.due_date}
                  onChange={(e) => handleInputChange('due_date', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Montant total */}
            <div className="md:col-span-2">
              <label className="form-label">
                Montant total (€) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  className={`input pl-12 ${errors.total_amount ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="0.00"
                  value={formData.total_amount}
                  onChange={(e) => handleInputChange('total_amount', parseFloat(e.target.value))}
                  disabled={isSubmitting}
                  min={0}
                  step={0.01}
                />
              </div>
              {errors.total_amount && (
                <p className="mt-1 text-sm text-red-600">{errors.total_amount}</p>
              )}
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
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {invoice ? 'Modification...' : 'Création...'}
                </>
              ) : (
                <>
                  {invoice ? 'Modifier' : 'Créer'} la facture
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
