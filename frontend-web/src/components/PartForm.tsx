"use client";

import { useState, useEffect } from 'react'
import { X, Package, Hash, DollarSign, FileText, Box } from 'lucide-react'
import { Part } from '@/types'

interface PartFormProps {
  part?: Part | null
  onSubmit: (partData: Partial<Part>) => Promise<void>
  onCancel: () => void
}

export default function PartForm({ part, onSubmit, onCancel }: PartFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    min_stock_level: 5
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (part) {
      setFormData({
        name: part.name,
        reference: part.reference || '',
        description: part.description || '',
        price: part.price,
        stock_quantity: part.stock_quantity,
        min_stock_level: part.min_stock_level
      })
    }
  }, [part])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la pièce est obligatoire'
    }

    if (formData.price < 0) {
      newErrors.price = 'Le prix ne peut pas être négatif'
    }

    if (formData.stock_quantity < 0) {
      newErrors.stock_quantity = 'La quantité ne peut pas être négative'
    }

    if (formData.min_stock_level < 0) {
      newErrors.min_stock_level = 'Le stock minimum ne peut pas être négatif'
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
            {part ? 'Modifier la pièce' : 'Nouvelle pièce'}
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
            {/* Nom */}
            <div className="md:col-span-2">
              <label className="form-label">
                Nom de la pièce <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  className={`input pl-12 ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="Filtre à huile, Plaquettes de frein..."
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Référence */}
            <div>
              <label className="form-label">Référence</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  className="input pl-12"
                  placeholder="REF-001"
                  value={formData.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Prix unitaire */}
            <div>
              <label className="form-label">
                Prix unitaire (€) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  className={`input pl-12 ${errors.price ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  disabled={isSubmitting}
                  min={0}
                  step={0.01}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            {/* Quantité en stock */}
            <div>
              <label className="form-label">
                Quantité en stock <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Box className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  className={`input pl-12 ${errors.stock_quantity ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="0"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value))}
                  disabled={isSubmitting}
                  min={0}
                />
              </div>
              {errors.stock_quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>
              )}
            </div>

            {/* Stock minimum */}
            <div>
              <label className="form-label">
                Stock minimum <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Box className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  className={`input pl-12 ${errors.min_stock_level ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="5"
                  value={formData.min_stock_level}
                  onChange={(e) => handleInputChange('min_stock_level', parseInt(e.target.value))}
                  disabled={isSubmitting}
                  min={0}
                />
              </div>
              {errors.min_stock_level && (
                <p className="mt-1 text-sm text-red-600">{errors.min_stock_level}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="form-label">Description</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <textarea
                  className="input pl-12 min-h-[100px] resize-none"
                  placeholder="Description de la pièce..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
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
                  {part ? 'Modification...' : 'Ajout...'}
                </>
              ) : (
                <>
                  {part ? 'Modifier' : 'Ajouter'} la pièce
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
