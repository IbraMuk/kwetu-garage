"use client";

import { useState, useEffect } from 'react'
import { X, Edit, Wrench, Car, User, Calendar, DollarSign, FileText, Clock } from 'lucide-react'
import { Repair, Vehicle, Client } from '@/types'
import api from '@/lib/api'

interface RepairDetailProps {
  repair: Repair
  onClose: () => void
  onEdit: () => void
}

export default function RepairDetail({ repair, onClose, onEdit }: RepairDetailProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRepairDetails()
  }, [repair.id])

  const fetchRepairDetails = async () => {
    try {
      // Fetch vehicle information
      const vehicleResponse = await api.get(`/vehicles/${repair.vehicle_id}`)
      setVehicle(vehicleResponse.data)

      // Fetch client information from vehicle
      if (vehicleResponse.data.client_id) {
        const clientResponse = await api.get(`/clients/${vehicleResponse.data.client_id}`)
        setClient(clientResponse.data)
      }
    } catch (error) {
      console.error('Error fetching repair details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'in_progress':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente'
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

  const calculateDuration = () => {
    if (repair.start_date && repair.end_date) {
      const start = new Date(repair.start_date)
      const end = new Date(repair.end_date)
      const diffMs = end.getTime() - start.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)
      
      if (diffDays > 0) {
        return `${diffDays} jour${diffDays > 1 ? 's' : ''}`
      } else {
        return `${diffHours} heure${diffHours > 1 ? 's' : ''}`
      }
    }
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-amber-50">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mr-4">
              <Wrench className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Réparation
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex px-3 py-1 text-xs font-black rounded-full border ${getStatusStyle(repair.status)}`}>
                  {getStatusText(repair.status)}
                </span>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-3">Description</h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-700">{repair.description}</p>
                </div>
              </div>

              {/* Vehicle Information */}
              {vehicle && (
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-3">Véhicule</h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mr-4">
                          <Car className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900">
                            {vehicle.make} {vehicle.model}
                          </p>
                          <p className="text-sm text-slate-600">
                            {vehicle.year} · {vehicle.license_plate} · {vehicle.mileage.toLocaleString('fr-FR')} km
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Client Information */}
              {client && (
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-3">Client</h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900">
                            {client.first_name} {client.last_name}
                          </p>
                          {client.is_professional && client.company_name && (
                            <p className="text-sm text-blue-600 font-medium">{client.company_name}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cost and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cost */}
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center">
                    <DollarSign className="h-6 w-6 text-emerald-600 mr-3" />
                    <div>
                      <p className="text-sm text-emerald-600 font-medium">Coût total</p>
                      <p className="text-2xl font-black text-emerald-900">
                        {repair.total_cost.toLocaleString('fr-FR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} €
                      </p>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                {calculateDuration() && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center">
                      <Clock className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Durée</p>
                        <p className="text-2xl font-black text-blue-900">
                          {calculateDuration()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-slate-600 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Date de création</p>
                      <p className="text-base font-black text-slate-900">
                        {new Date(repair.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {repair.start_date && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-slate-600 mr-3" />
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Date de début</p>
                        <p className="text-base font-black text-slate-900">
                          {new Date(repair.start_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {repair.end_date && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-slate-600 mr-3" />
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Date de fin</p>
                        <p className="text-base font-black text-slate-900">
                          {new Date(repair.end_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              {repair.notes && (
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-3">Notes</h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-slate-700">{repair.notes}</p>
                  </div>
                </div>
              )}

              {/* Updated date */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Mis à jour le {new Date(repair.updated_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
