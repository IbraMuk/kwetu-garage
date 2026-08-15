"use client";

import { useState, useEffect } from 'react'
import { X, Edit, Car, User, Gauge, Hash, Calendar, Settings, Palette, FileText, Wrench, DollarSign } from 'lucide-react'
import { Vehicle, Client, Repair } from '@/types'
import api from '@/lib/api'

interface VehicleDetailProps {
  vehicle: Vehicle
  onClose: () => void
  onEdit: () => void
}

export default function VehicleDetail({ vehicle, onClose, onEdit }: VehicleDetailProps) {
  const [client, setClient] = useState<Client | null>(null)
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVehicleDetails()
  }, [vehicle.id])

  const fetchVehicleDetails = async () => {
    try {
      // Fetch client information
      const clientResponse = await api.get(`/clients/${vehicle.client_id}`)
      setClient(clientResponse.data)

      // Fetch vehicle repairs
      const repairsResponse = await api.get(`/repairs?vehicle_id=${vehicle.id}`)
      setRepairs(repairsResponse.data)
    } catch (error) {
      console.error('Error fetching vehicle details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRepairStatusStyle = (status: string) => {
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

  const getRepairStatusText = (status: string) => {
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

  const totalRepairsCost = repairs.reduce((sum, repair) => sum + repair.total_cost, 0)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mr-4">
              <Car className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {vehicle.make} {vehicle.model}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-600 font-medium">{vehicle.year}</span>
                <span className="text-slate-400">•</span>
                <span className="text-sm text-slate-600 font-medium">{vehicle.license_plate}</span>
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
              {/* Vehicle Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Kilométrage */}
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center">
                    <Gauge className="h-5 w-5 text-emerald-600 mr-3" />
                    <div>
                      <p className="text-sm text-emerald-600 font-medium">Kilométrage</p>
                      <p className="text-lg font-black text-emerald-900">
                        {vehicle.mileage.toLocaleString('fr-FR')} km
                      </p>
                    </div>
                  </div>
                </div>

                {/* VIN */}
                {vehicle.vin && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center">
                      <Hash className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">VIN</p>
                        <p className="text-lg font-black text-blue-900 font-mono text-xs">
                          {vehicle.vin}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Type de carburant */}
                {vehicle.fuel_type && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 text-slate-600 mr-3" />
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Carburant</p>
                        <p className="text-lg font-black text-slate-900 capitalize">
                          {vehicle.fuel_type}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transmission */}
                {vehicle.transmission && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 text-slate-600 mr-3" />
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Transmission</p>
                        <p className="text-lg font-black text-slate-900 capitalize">
                          {vehicle.transmission}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Couleur */}
                {vehicle.color && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center">
                      <Palette className="h-5 w-5 text-slate-600 mr-3" />
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Couleur</p>
                        <p className="text-lg font-black text-slate-900 capitalize">
                          {vehicle.color}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date d'ajout */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-slate-600 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Ajouté le</p>
                      <p className="text-lg font-black text-slate-900">
                        {new Date(vehicle.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              {client && (
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-3">Propriétaire</h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mr-4">
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

              {/* Réparations */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-3">Historique des réparations</h3>
                {repairs.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                    <Wrench className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-black text-lg mb-1">Aucune réparation</p>
                    <p className="text-sm text-slate-500">Ce véhicule n'a pas encore de réparations enregistrées</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {repairs.map((repair) => (
                      <div key={repair.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mr-3">
                              <Wrench className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">
                                {repair.description}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(repair.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-black rounded-full border ${getRepairStatusStyle(repair.status)}`}>
                              {getRepairStatusText(repair.status)}
                            </span>
                            <p className="text-sm font-black text-slate-900 mt-1">
                              {repair.total_cost.toLocaleString('fr-FR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })} $
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Résumé financier */}
              {repairs.length > 0 && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-6 w-6 text-emerald-600 mr-3" />
                      <div>
                        <p className="text-sm text-emerald-600 font-medium">Total des réparations</p>
                        <p className="text-2xl font-black text-emerald-900">
                          {totalRepairsCost.toLocaleString('fr-FR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })} $
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-emerald-600 font-medium">{repairs.length} réparation{repairs.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Mis à jour le {new Date(vehicle.updated_at).toLocaleDateString('fr-FR', {
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
