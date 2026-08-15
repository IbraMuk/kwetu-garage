"use client";

import { useState, useEffect } from 'react'
import { X, Car, User, Gauge, Hash, Palette, Settings, FileText, Calendar } from 'lucide-react'
import { Vehicle, Client } from '@/types'

interface VehicleFormProps {
  vehicle?: Vehicle | null
  onSubmit: (vehicleData: Partial<Vehicle>) => Promise<void>
  onCancel: () => void
}

export default function VehicleForm({ vehicle, onSubmit, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    client_id: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    vin: '',
    mileage: 0,
    fuel_type: 'essence',
    transmission: 'manuelle',
    color: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
    if (vehicle) {
      setFormData({
        client_id: vehicle.client_id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        license_plate: vehicle.license_plate,
        vin: vehicle.vin || '',
        mileage: vehicle.mileage,
        fuel_type: vehicle.fuel_type || 'essence',
        transmission: vehicle.transmission || 'manuelle',
        color: vehicle.color || '',
        notes: ''
      })
    }
  }, [vehicle])

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

    if (!formData.make.trim()) {
      newErrors.make = 'La marque est obligatoire'
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Le modèle est obligatoire'
    }

    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'L\'année doit être entre 1900 et l\'année prochaine'
    }

    if (!formData.license_plate.trim()) {
      newErrors.license_plate = 'La plaque d\'immatriculation est obligatoire'
    }

    if (formData.vin && formData.vin.length !== 17) {
      newErrors.vin = 'Le VIN doit contenir 17 caractères'
    }

    if (formData.mileage < 0) {
      newErrors.mileage = 'Le kilométrage ne peut pas être négatif'
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
            {vehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
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

            {/* Marque */}
            <div>
              <label className="form-label">
                Marque <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  className={`input pl-12 ${errors.make ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="Toyota, Peugeot, Renault..."
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.make && (
                <p className="mt-1 text-sm text-red-600">{errors.make}</p>
              )}
            </div>

            {/* Modèle */}
            <div>
              <label className="form-label">
                Modèle <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  className={`input pl-12 ${errors.model ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="Corolla, 208, Duster..."
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.model && (
                <p className="mt-1 text-sm text-red-600">{errors.model}</p>
              )}
            </div>

            {/* Année */}
            <div>
              <label className="form-label">
                Année <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  className={`input pl-12 ${errors.year ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="2024"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  disabled={isSubmitting}
                  min={1900}
                  max={new Date().getFullYear() + 1}
                />
              </div>
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">{errors.year}</p>
              )}
            </div>

            {/* Plaque d'immatriculation */}
            <div>
              <label className="form-label">
                Plaque d'immatriculation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  className={`input pl-12 ${errors.license_plate ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="DK-1234-AB"
                  value={formData.license_plate}
                  onChange={(e) => handleInputChange('license_plate', e.target.value.toUpperCase())}
                  disabled={isSubmitting}
                />
              </div>
              {errors.license_plate && (
                <p className="mt-1 text-sm text-red-600">{errors.license_plate}</p>
              )}
            </div>

            {/* VIN */}
            <div className="md:col-span-2">
              <label className="form-label">VIN (Numéro de série)</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  className={`input pl-12 ${errors.vin ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="17 caractères alphanumériques"
                  value={formData.vin}
                  onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                  disabled={isSubmitting}
                  maxLength={17}
                />
              </div>
              {errors.vin && (
                <p className="mt-1 text-sm text-red-600">{errors.vin}</p>
              )}
            </div>

            {/* Kilométrage */}
            <div>
              <label className="form-label">
                Kilométrage (km) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  className={`input pl-12 ${errors.mileage ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="0"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                  disabled={isSubmitting}
                  min={0}
                />
              </div>
              {errors.mileage && (
                <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>
              )}
            </div>

            {/* Type de carburant */}
            <div>
              <label className="form-label">Type de carburant</label>
              <div className="relative">
                <Settings className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  className="input pl-12"
                  value={formData.fuel_type}
                  onChange={(e) => handleInputChange('fuel_type', e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="essence">Essence</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybride">Hybride</option>
                  <option value="electrique">Électrique</option>
                  <option value="gpl">GPL</option>
                </select>
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="form-label">Transmission</label>
              <div className="relative">
                <Settings className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  className="input pl-12"
                  value={formData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="manuelle">Manuelle</option>
                  <option value="automatique">Automatique</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
            </div>

            {/* Couleur */}
            <div>
              <label className="form-label">Couleur</label>
              <div className="relative">
                <Palette className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  className="input pl-12"
                  placeholder="Noir, Blanc, Bleu..."
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
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
                  placeholder="Notes supplémentaires sur le véhicule..."
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
                  {vehicle ? 'Modification...' : 'Ajout...'}
                </>
              ) : (
                <>
                  {vehicle ? 'Modifier' : 'Ajouter'} le véhicule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
