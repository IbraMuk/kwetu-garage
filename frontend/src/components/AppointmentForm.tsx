"use client";

import { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, Car, Wrench, FileText, Check } from 'lucide-react'
import { Appointment, Client, Vehicle } from '@/types'

interface AppointmentFormProps {
  appointment?: Appointment | null
  onSubmit: (appointmentData: Partial<Appointment>) => Promise<void>
  onCancel: () => void
}

export default function AppointmentForm({ appointment, onSubmit, onCancel }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    client_id: '',
    vehicle_id: '',
    mechanic_id: '',
    title: '',
    description: '',
    appointment_date: '',
    appointment_time: '',
    duration_minutes: 60,
    status: 'scheduled' as Appointment['status'],
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [mechanics, setMechanics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
    fetchMechanics()
    if (appointment) {
      setFormData({
        client_id: appointment.client_id,
        vehicle_id: appointment.vehicle_id,
        mechanic_id: appointment.mechanic_id || '',
        title: appointment.title,
        description: appointment.description || '',
        appointment_date: new Date(appointment.appointment_date).toISOString().split('T')[0],
        appointment_time: new Date(appointment.appointment_date).toISOString().split('T')[1].substring(0, 5),
        duration_minutes: appointment.duration_minutes,
        status: appointment.status,
        notes: appointment.notes || ''
      })
      // Fetch vehicles for this client
      fetchVehicles(appointment.client_id)
    }
  }, [appointment])

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

  const fetchVehicles = async (clientId: string) => {
    try {
      const response = await fetch(`/api/vehicles?client_id=${clientId}`)
      const data = await response.json()
      setVehicles(data)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  const fetchMechanics = async () => {
    try {
      // Mock data for mechanics
      setMechanics([
        { id: 'mech1', name: 'Pierre Ndiaye' },
        { id: 'mech2', name: 'Marie Fall' },
        { id: 'mech3', name: 'Ibrahima Sow' }
      ])
    } catch (error) {
      console.error('Error fetching mechanics:', error)
    }
  }

  const handleClientChange = async (clientId: string) => {
    setFormData(prev => ({ ...prev, client_id: clientId, vehicle_id: '' }))
    await fetchVehicles(clientId)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.client_id) {
      newErrors.client_id = 'Le client est obligatoire'
    }

    if (!formData.vehicle_id) {
      newErrors.vehicle_id = 'Le véhicule est obligatoire'
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire'
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = 'La date est obligatoire'
    }

    if (!formData.appointment_time) {
      newErrors.appointment_time = 'L\'heure est obligatoire'
    }

    if (formData.duration_minutes < 15) {
      newErrors.duration_minutes = 'La durée minimale est de 15 minutes'
    }

    if (formData.duration_minutes > 480) {
      newErrors.duration_minutes = 'La durée maximale est de 8 heures'
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
      const { appointment_time, ...rest } = formData
      const appointmentData: Partial<Appointment> = {
        ...rest,
        appointment_date: `${formData.appointment_date}T${appointment_time}:00`,
      }
      await onSubmit(appointmentData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Effacer l'erreur quand l'utilisateur modifie le champ
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
            {appointment ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulaire */}
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
                  onChange={(e) => handleClientChange(e.target.value)}
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

            {/* Véhicule */}
            <div className="md:col-span-2">
              <label className="form-label">
                Véhicule <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  className={`input pl-12 ${errors.vehicle_id ? 'border-red-300 focus:border-red-500' : ''}`}
                  value={formData.vehicle_id}
                  onChange={(e) => handleInputChange('vehicle_id', e.target.value)}
                  disabled={isSubmitting || !formData.client_id}
                >
                  <option value="">Sélectionner un véhicule</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.license_plate}
                    </option>
                  ))}
                </select>
              </div>
              {errors.vehicle_id && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicle_id}</p>
              )}
            </div>

            {/* Mécanicien */}
            <div className="md:col-span-2">
              <label className="form-label">Mécanicien</label>
              <div className="relative">
                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  className="input pl-12"
                  value={formData.mechanic_id}
                  onChange={(e) => handleInputChange('mechanic_id', e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Non assigné</option>
                  {mechanics.map(mechanic => (
                    <option key={mechanic.id} value={mechanic.id}>
                      {mechanic.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Titre */}
            <div className="md:col-span-2">
              <label className="form-label">
                Titre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  className={`input pl-12 ${errors.title ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="Titre du rendez-vous"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="form-label">Description</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <textarea
                  className="input pl-12 min-h-[80px] resize-none"
                  placeholder="Description du rendez-vous..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="form-label">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  className={`input pl-12 ${errors.appointment_date ? 'border-red-300 focus:border-red-500' : ''}`}
                  value={formData.appointment_date}
                  onChange={(e) => handleInputChange('appointment_date', e.target.value)}
                  disabled={isSubmitting}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {errors.appointment_date && (
                <p className="mt-1 text-sm text-red-600">{errors.appointment_date}</p>
              )}
            </div>

            {/* Heure */}
            <div>
              <label className="form-label">
                Heure <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="time"
                  className={`input pl-12 ${errors.appointment_time ? 'border-red-300 focus:border-red-500' : ''}`}
                  value={formData.appointment_time}
                  onChange={(e) => handleInputChange('appointment_time', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {errors.appointment_time && (
                <p className="mt-1 text-sm text-red-600">{errors.appointment_time}</p>
              )}
            </div>

            {/* Durée */}
            <div>
              <label className="form-label">
                Durée (minutes) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  className={`input pl-12 ${errors.duration_minutes ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="60"
                  value={formData.duration_minutes}
                  onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value))}
                  disabled={isSubmitting}
                  min="15"
                  max="480"
                  step="15"
                />
              </div>
              {errors.duration_minutes && (
                <p className="mt-1 text-sm text-red-600">{errors.duration_minutes}</p>
              )}
            </div>

            {/* Statut */}
            <div>
              <label className="form-label">Statut</label>
              <div className="relative">
                <Check className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  className="input pl-12"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="scheduled">Planifié</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="form-label">Notes</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <textarea
                  className="input pl-12 min-h-[100px] resize-none"
                  placeholder="Notes supplémentaires sur le rendez-vous..."
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
                  {appointment ? 'Modification...' : 'Création...'}
                </>
              ) : (
                <>
                  {appointment ? 'Modifier' : 'Créer'} le rendez-vous
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
