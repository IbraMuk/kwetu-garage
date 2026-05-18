"use client";

import { useState, useEffect } from 'react'
import { X, Edit, Calendar, Clock, User, Car, Wrench, FileText, MapPin, Phone, Mail, CheckCircle, AlertTriangle } from 'lucide-react'
import { Appointment, Client, Vehicle } from '@/types'

interface AppointmentDetailProps {
  appointment: Appointment
  onClose: () => void
  onEdit: () => void
}

export default function AppointmentDetail({ appointment, onClose, onEdit }: AppointmentDetailProps) {
  const [client, setClient] = useState<Client | null>(null)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointmentDetails()
  }, [appointment.id])

  const fetchAppointmentDetails = async () => {
    try {
      // Récupérer les informations du client
      const clientResponse = await fetch(`/api/clients/${appointment.client_id}`)
      if (clientResponse.ok) {
        const clientData = await clientResponse.json()
        setClient(clientData)
      }

      // Récupérer les informations du véhicule
      const vehicleResponse = await fetch(`/api/vehicles/${appointment.vehicle_id}`)
      if (vehicleResponse.ok) {
        const vehicleData = await vehicleResponse.json()
        setVehicle(vehicleData)
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'in_progress':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'completed':
        return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Planifié'
      case 'confirmed':
        return 'Confirmé'
      case 'in_progress':
        return 'En cours'
      case 'completed':
        return 'Terminé'
      case 'cancelled':
        return 'Annulé'
      default:
        return status
    }
  }

  const appointmentDate = new Date(appointment.appointment_date)
  const isPast = appointmentDate < new Date()
  const isToday = appointmentDate.toDateString() === new Date().toDateString()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mr-4">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {appointment.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex px-3 py-1 text-xs font-black rounded-full border ${getStatusStyle(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </span>
                {isPast && appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Passé
                  </span>
                )}
                {isToday && (
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aujourd'hui
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="btn btn-ghost"
              title="Modifier"
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Date et heure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Date</p>
                      <p className="text-lg font-black text-blue-900">
                        {appointmentDate.toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-emerald-600 mr-3" />
                    <div>
                      <p className="text-sm text-emerald-600 font-medium">Heure</p>
                      <p className="text-lg font-black text-emerald-900">
                        {appointmentDate.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Durée */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-slate-600 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Durée estimée</p>
                      <p className="text-lg font-black text-slate-900">
                        {appointment.duration_minutes} minutes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 font-medium">Fin prévue</p>
                    <p className="text-lg font-black text-slate-900">
                      {new Date(appointmentDate.getTime() + appointment.duration_minutes * 60000).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Client et véhicule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900">Client</h3>
                  {client ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center mb-3">
                        <User className="h-5 w-5 text-slate-600 mr-2" />
                        <p className="text-base font-black text-slate-900">
                          {client.first_name} {client.last_name}
                        </p>
                      </div>
                      {client.email && (
                        <div className="flex items-center text-sm text-slate-600 mb-2">
                          <Mail className="h-4 w-4 mr-2 text-slate-400" />
                          <span>{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center text-sm text-slate-600 mb-2">
                          <Phone className="h-4 w-4 mr-2 text-slate-400" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.address && (
                        <div className="flex items-start text-sm text-slate-600">
                          <MapPin className="h-4 w-4 mr-2 text-slate-400 mt-0.5" />
                          <span className="line-clamp-2">{client.address}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Client non trouvé</p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900">Véhicule</h3>
                  {vehicle ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center mb-3">
                        <Car className="h-5 w-5 text-slate-600 mr-2" />
                        <p className="text-base font-black text-slate-900">
                          {vehicle.make} {vehicle.model}
                        </p>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Année:</span>
                          <span>{vehicle.year}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Plaque:</span>
                          <span>{vehicle.license_plate}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Kilométrage:</span>
                          <span>{vehicle.mileage.toLocaleString()} km</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Véhicule non trouvé</p>
                  )}
                </div>
              </div>

              {/* Description */}
              {appointment.description && (
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-3">Description</h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                    {appointment.description}
                  </div>
                </div>
              )}

              {/* Notes */}
              {appointment.notes && (
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-3">Notes</h3>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-slate-700">
                    {appointment.notes}
                  </div>
                </div>
              )}

              {/* Informations système */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Créé le {new Date(appointment.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  {appointment.updated_at !== appointment.created_at && (
                    <> • Mis à jour le {new Date(appointment.updated_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
