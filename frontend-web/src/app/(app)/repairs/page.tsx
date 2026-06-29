"use client";

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Wrench, Filter, Eye, Calendar, DollarSign, Car, User } from 'lucide-react'
import api from '@/lib/api'
import { Repair } from '@/types'
import RepairForm from '@/components/RepairForm'
import RepairDetail from '@/components/RepairDetail'

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [filteredRepairs, setFilteredRepairs] = useState<Repair[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null)
  const [editingRepair, setEditingRepair] = useState<Repair | null>(null)

  useEffect(() => {
    fetchRepairs()
  }, [])

  useEffect(() => {
    filterRepairs()
  }, [repairs, searchTerm, selectedStatus])

  const fetchRepairs = async () => {
    try {
      const response = await api.get('/repairs')
      setRepairs(response.data)
    } catch (error) {
      console.error('Error fetching repairs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterRepairs = () => {
    let filtered = repairs

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(repair =>
        repair.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(repair => repair.status === selectedStatus)
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setFilteredRepairs(filtered)
  }

  const handleAddRepair = () => {
    setEditingRepair(null)
    setShowForm(true)
  }

  const handleEditRepair = (repair: Repair) => {
    setEditingRepair(repair)
    setShowForm(true)
  }

  const handleViewRepair = (repair: Repair) => {
    setSelectedRepair(repair)
    setShowDetail(true)
  }

  const handleDeleteRepair = async (repair: Repair) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la réparation "${repair.description}" ?`)) {
      try {
        await api.delete(`/repairs/${repair.id}`)
        setRepairs(repairs.filter(r => r.id !== repair.id))
      } catch (error) {
        console.error('Error deleting repair:', error)
        alert('Erreur lors de la suppression de la réparation')
      }
    }
  }

  const handleFormSubmit = async (repairData: Partial<Repair>) => {
    try {
      if (editingRepair) {
        // Update
        const response = await api.put(`/repairs/${editingRepair.id}`, repairData)
        setRepairs(repairs.map(r => r.id === editingRepair.id ? response.data : r))
      } else {
        // Create
        const response = await api.post('/repairs', repairData)
        setRepairs([...repairs, response.data])
      }
      setShowForm(false)
      setEditingRepair(null)
    } catch (error) {
      console.error('Error saving repair:', error)
      alert('Erreur lors de la sauvegarde de la réparation')
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
        return 'bg-white/5 text-gray-300 border-white/10'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-200 rounded-full animate-ping"></div>
          </div>
          <p className="mt-4 text-gray-300 font-semibold">
            Chargement des réparations...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">

      {/* Header avec bouton d'ajout */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Réparations</h1>
          <p className="text-gray-400">Gérez vos réparations</p>
        </div>
        <button
          onClick={handleAddRepair}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle réparation
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 glass-panel !p-4 animate-slideUp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Statut</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-400">
                {filteredRepairs.length} réparation{filteredRepairs.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            className="input pl-12 pr-4 py-3"
            placeholder="Rechercher une réparation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Repair List */}
      {filteredRepairs.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Wrench className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-gray-300 font-black text-lg mb-2">
            {searchTerm || selectedStatus !== 'all' ? 'Aucune réparation trouvée' : 'Aucune réparation'}
          </p>
          <p className="text-sm text-gray-400 font-medium mb-4">
            {searchTerm || selectedStatus !== 'all' 
              ? 'Essayez de modifier vos filtres de recherche' 
              : 'Créez votre première réparation pour commencer'
            }
          </p>
          {!searchTerm && selectedStatus === 'all' && (
            <button className="btn btn-primary" onClick={handleAddRepair}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle réparation
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRepairs.map((repair, index) => (
            <div
              key={repair.id}
              className="bg-white/80 backdrop-blur border border-white/10 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 group animate-slideUp"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Wrench className="h-7 w-7 text-amber-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-white">
                        {repair.description}
                      </h3>
                      <span className={`inline-flex px-3 py-1 text-xs font-black rounded-full border ${getStatusStyle(repair.status)}`}>
                        {getStatusText(repair.status)}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-300 mb-3">
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-2 text-slate-400" />
                        <span>Véhicule ID: {repair.vehicle_id}</span>
                      </div>
                      {repair.mechanic_id && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-slate-400" />
                          <span>Mécanicien ID: {repair.mechanic_id}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{new Date(repair.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="font-semibold">
                          {repair.total_cost.toLocaleString('fr-FR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => handleViewRepair(repair)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                    title="Voir"
                  >
                    <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleEditRepair(repair)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleDeleteRepair(repair)}
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

      {/* Form Modal */}
      {showForm && (
        <RepairForm
          repair={editingRepair}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingRepair(null)
          }}
        />
      )}

      {/* Detail Modal */}
      {showDetail && selectedRepair && (
        <RepairDetail
          repair={selectedRepair}
          onClose={() => {
            setShowDetail(false)
            setSelectedRepair(null)
          }}
          onEdit={() => {
            setShowDetail(false)
            handleEditRepair(selectedRepair)
          }}
        />
      )}
    </div>
  )
}
