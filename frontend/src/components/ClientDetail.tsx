"use client";

import { useState, useEffect } from 'react'
import { X, Edit, Phone, Mail, MapPin, Building, Calendar, Car, DollarSign, FileText, Users } from 'lucide-react'
import { Client, Vehicle, Invoice } from '@/types'
import api from '@/lib/api'

interface ClientDetailProps {
  client: Client
  onClose: () => void
  onEdit: () => void
}

export default function ClientDetail({ client, onClose, onEdit }: ClientDetailProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'vehicles' | 'invoices'>('info')

  useEffect(() => {
    fetchClientData()
  }, [client.id])

  const fetchClientData = async () => {
    try {
      // Récupérer les véhicules du client
      const vehiclesResponse = await api.get(`/vehicles?client_id=${client.id}`)
      setVehicles(vehiclesResponse.data)

      // Récupérer les factures du client
      const invoicesResponse = await api.get(`/invoices?client_id=${client.id}`)
      setInvoices(invoicesResponse.data)
    } catch (error) {
      console.error('Error fetching client data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'overdue':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'cancelled':
        return 'bg-slate-50 text-slate-700 border-slate-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente'
      case 'paid':
        return 'Payée'
      case 'overdue':
        return 'En retard'
      case 'cancelled':
        return 'Annulée'
      default:
        return status
    }
  }

  const totalInvoices = invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0)
  const paidInvoices = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.total_amount, 0)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mr-4">
              {client.is_professional ? (
                <Building className="h-8 w-8 text-blue-600" />
              ) : (
                <Users className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {client.first_name} {client.last_name}
              </h2>
              {client.is_professional && client.company_name && (
                <p className="text-blue-600 font-medium">{client.company_name}</p>
              )}
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                client.is_professional 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}>
                {client.is_professional ? 'Professionnel' : 'Particulier'}
              </span>
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

        {/* Onglets */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'info'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'vehicles'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Véhicules
            {vehicles.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                {vehicles.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'invoices'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Factures
            {invoices.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                {invoices.length}
              </span>
            )}
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Onglet Informations */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-slate-900">Contact</h3>
                      
                      {client.email && (
                        <div className="flex items-center text-slate-600">
                          <Mail className="h-4 w-4 mr-3 text-slate-400" />
                          <span>{client.email}</span>
                        </div>
                      )}
                      
                      {client.phone && (
                        <div className="flex items-center text-slate-600">
                          <Phone className="h-4 w-4 mr-3 text-slate-400" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      
                      {client.address && (
                        <div className="flex items-start text-slate-600">
                          <MapPin className="h-4 w-4 mr-3 text-slate-400 mt-0.5" />
                          <span>{client.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Informations générales */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-slate-900">Informations générales</h3>
                      
                      <div className="flex items-center text-slate-600">
                        <Calendar className="h-4 w-4 mr-3 text-slate-400" />
                        <span>Client depuis le {new Date(client.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</span>
                      </div>

                      <div className="flex items-center text-slate-600">
                        <Car className="h-4 w-4 mr-3 text-slate-400" />
                        <span>{vehicles.length} véhicule{vehicles.length > 1 ? 's' : ''}</span>
                      </div>

                      <div className="flex items-center text-slate-600">
                        <FileText className="h-4 w-4 mr-3 text-slate-400" />
                        <span>{invoices.length} facture{invoices.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {client.notes && (
                    <div>
                      <h3 className="text-lg font-black text-slate-900 mb-3">Notes</h3>
                      <div className="p-4 bg-slate-50 rounded-xl text-slate-700">
                        {client.notes}
                      </div>
                    </div>
                  )}

                  {/* Résumé financier */}
                  {invoices.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Total facturé</p>
                            <p className="text-2xl font-black text-blue-900">
                              {totalInvoices.toLocaleString('fr-FR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })} $
                            </p>
                          </div>
                          <DollarSign className="h-8 w-8 text-blue-400" />
                        </div>
                      </div>

                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-emerald-600 font-medium">Montant payé</p>
                            <p className="text-2xl font-black text-emerald-900">
                              {paidInvoices.toLocaleString('fr-FR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })} $
                            </p>
                          </div>
                          <DollarSign className="h-8 w-8 text-emerald-400" />
                        </div>
                      </div>

                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-amber-600 font-medium">Solde dû</p>
                            <p className="text-2xl font-black text-amber-900">
                              {(totalInvoices - paidInvoices).toLocaleString('fr-FR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })} $
                            </p>
                          </div>
                          <DollarSign className="h-8 w-8 text-amber-400" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Onglet Véhicules */}
              {activeTab === 'vehicles' && (
                <div>
                  {vehicles.length === 0 ? (
                    <div className="text-center py-12">
                      <Car className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600 font-black text-lg mb-2">Aucun véhicule</p>
                      <p className="text-sm text-slate-500">Ce client n'a pas encore de véhicule enregistré</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vehicles.map(vehicle => (
                        <div key={vehicle.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mr-4">
                                <Car className="h-6 w-6 text-emerald-600" />
                              </div>
                              <div>
                                <h4 className="text-lg font-black text-slate-900">
                                  {vehicle.make} {vehicle.model}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  {vehicle.year} • {vehicle.license_plate} • {vehicle.mileage.toLocaleString()} km
                                </p>
                              </div>
                            </div>
                            <div className="text-sm text-slate-500">
                              Ajouté le {new Date(vehicle.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Onglet Factures */}
              {activeTab === 'invoices' && (
                <div>
                  {invoices.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600 font-black text-lg mb-2">Aucune facture</p>
                      <p className="text-sm text-slate-500">Ce client n'a pas encore de facture</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {invoices.map(invoice => (
                        <div key={invoice.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4">
                                <FileText className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="text-lg font-black text-slate-900">
                                  {invoice.invoice_number}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex px-3 py-1 text-xs font-black rounded-full border ${getStatusStyle(invoice.status)}`}>
                                {getStatusText(invoice.status)}
                              </span>
                              <p className="text-lg font-black text-slate-900 mt-1">
                                {invoice.total_amount.toLocaleString('fr-FR', {
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
