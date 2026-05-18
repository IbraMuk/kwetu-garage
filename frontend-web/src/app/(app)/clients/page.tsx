"use client";

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Users, Phone, Mail, MapPin, Building, Eye, Download, Filter } from 'lucide-react'
import api from '@/lib/api'
import { Client } from '@/types'
import ClientForm from '@/components/ClientForm'
import ClientDetail from '@/components/ClientDetail'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showProfessionalOnly, setShowProfessionalOnly] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    filterClients()
  }, [clients, searchTerm, showProfessionalOnly])

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients')
      setClients(response.data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterClients = () => {
    let filtered = clients

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm) ||
        client.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrer par type
    if (showProfessionalOnly) {
      filtered = filtered.filter(client => client.is_professional)
    }

    setFilteredClients(filtered)
  }

  const handleAddClient = () => {
    setEditingClient(null)
    setShowForm(true)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setShowForm(true)
  }

  const handleViewClient = (client: Client) => {
    setSelectedClient(client)
    setShowDetail(true)
  }

  const handleDeleteClient = async (client: Client) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le client "${client.first_name} ${client.last_name}" ?`)) {
      try {
        await api.delete(`/clients/${client.id}`)
        setClients(clients.filter(c => c.id !== client.id))
      } catch (error) {
        console.error('Error deleting client:', error)
        alert('Erreur lors de la suppression du client')
      }
    }
  }

  const handleFormSubmit = async (clientData: Partial<Client>) => {
    try {
      if (editingClient) {
        // Mise à jour
        const response = await api.put(`/clients/${editingClient.id}`, clientData)
        setClients(clients.map(c => c.id === editingClient.id ? response.data : c))
      } else {
        // Création
        const response = await api.post('/clients', clientData)
        setClients([...clients, response.data])
      }
      setShowForm(false)
      setEditingClient(null)
    } catch (error) {
      console.error('Error saving client:', error)
      alert('Erreur lors de la sauvegarde du client')
    }
  }

  const handleExportClients = () => {
    const csvContent = [
      ['Nom', 'Prénom', 'Email', 'Téléphone', 'Adresse', 'Type', 'Entreprise', 'Date d\'ajout'],
      ...filteredClients.map(client => [
        client.last_name,
        client.first_name,
        client.email || '',
        client.phone || '',
        client.address || '',
        client.is_professional ? 'Professionnel' : 'Particulier',
        client.company_name || '',
        new Date(client.created_at).toLocaleDateString('fr-FR')
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `clients_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-200 rounded-full animate-ping"></div>
          </div>
          <p className="mt-4 text-gray-300 font-semibold">
            Chargement des clients...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportClients}
            className="btn btn-ghost"
            title="Exporter les clients"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button className="btn btn-primary" onClick={handleAddClient}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un client
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6 glass-panel !p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                className="input pl-12 pr-4 py-3"
                placeholder="Rechercher un client (nom, email, téléphone, entreprise)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-white/20 rounded"
                checked={showProfessionalOnly}
                onChange={(e) => setShowProfessionalOnly(e.target.checked)}
              />
              <span className="text-sm text-gray-300">Professionnels uniquement</span>
            </label>
            <div className="text-sm text-gray-400">
              {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Grille des clients */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-gray-300 font-black text-lg mb-2">
            {searchTerm || showProfessionalOnly ? 'Aucun client trouvé' : 'Aucun client'}
          </p>
          <p className="text-sm text-gray-400 font-medium mb-4">
            {searchTerm || showProfessionalOnly 
              ? 'Essayez de modifier vos filtres de recherche' 
              : 'Ajoutez votre premier client pour commencer'
            }
          </p>
          {!searchTerm && !showProfessionalOnly && (
            <button className="btn btn-primary" onClick={handleAddClient}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un client
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <div
              key={client.id}
              className="bg-white/80 backdrop-blur border border-white/10 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 group animate-slideUp"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Header de la carte */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    {client.is_professional ? (
                      <Building className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Users className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {client.first_name} {client.last_name}
                    </h3>
                    {client.is_professional && client.company_name && (
                      <p className="text-sm text-blue-600 font-medium">{client.company_name}</p>
                    )}
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  client.is_professional 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-white/5 text-gray-300 border border-white/10'
                }`}>
                  {client.is_professional ? 'Pro' : 'Particulier'}
                </span>
              </div>

              {/* Informations de contact */}
              <div className="space-y-2 mb-4">
                {client.email && (
                  <div className="flex items-center text-sm text-gray-300">
                    <Mail className="h-4 w-4 mr-2 text-slate-400" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center text-sm text-gray-300">
                    <Phone className="h-4 w-4 mr-2 text-slate-400" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-start text-sm text-gray-300">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400 mt-0.5" />
                    <span className="line-clamp-2">{client.address}</span>
                  </div>
                )}
              </div>

              {/* Date d'ajout */}
              <div className="text-xs text-gray-400 mb-4">
                Ajouté le {new Date(client.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleViewClient(client)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleEditClient(client)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal formulaire */}
      {showForm && (
        <ClientForm
          client={editingClient}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingClient(null)
          }}
        />
      )}

      {/* Modal détail */}
      {showDetail && selectedClient && (
        <ClientDetail
          client={selectedClient}
          onClose={() => {
            setShowDetail(false)
            setSelectedClient(null)
          }}
          onEdit={() => {
            setShowDetail(false)
            handleEditClient(selectedClient)
          }}
        />
      )}
    </div>
  )
}
