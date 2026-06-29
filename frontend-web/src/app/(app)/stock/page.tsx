"use client";

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Package, Filter, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import api from '@/lib/api'
import { Part } from '@/types'
import PartForm from '@/components/PartForm'
import PartDetail from '@/components/PartDetail'

export default function StockPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [filteredParts, setFilteredParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStockLevel, setSelectedStockLevel] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [editingPart, setEditingPart] = useState<Part | null>(null)

  useEffect(() => {
    fetchParts()
  }, [])

  useEffect(() => {
    filterParts()
  }, [parts, searchTerm, selectedStockLevel])

  const fetchParts = async () => {
    try {
      const response = await api.get('/parts')
      setParts(response.data)
    } catch (error) {
      console.error('Error fetching parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterParts = () => {
    let filtered = parts

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(part =>
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (part.reference && part.reference.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by stock level
    if (selectedStockLevel !== 'all') {
      filtered = filtered.filter(part => {
        if (selectedStockLevel === 'low') {
          return part.stock_quantity <= part.min_stock_level
        } else if (selectedStockLevel === 'ok') {
          return part.stock_quantity > part.min_stock_level
        }
        return true
      })
    }

    // Sort by name
    filtered.sort((a, b) => a.name.localeCompare(b.name))

    setFilteredParts(filtered)
  }

  const handleAddPart = () => {
    setEditingPart(null)
    setShowForm(true)
  }

  const handleEditPart = (part: Part) => {
    setEditingPart(part)
    setShowForm(true)
  }

  const handleViewPart = (part: Part) => {
    setSelectedPart(part)
    setShowDetail(true)
  }

  const handleDeletePart = async (part: Part) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la pièce "${part.name}" ?`)) {
      try {
        await api.delete(`/parts/${part.id}`)
        setParts(parts.filter(p => p.id !== part.id))
      } catch (error) {
        console.error('Error deleting part:', error)
        alert('Erreur lors de la suppression de la pièce')
      }
    }
  }

  const handleFormSubmit = async (partData: Partial<Part>) => {
    try {
      if (editingPart) {
        // Update
        const response = await api.put(`/parts/${editingPart.id}`, partData)
        setParts(parts.map(p => p.id === editingPart.id ? response.data : p))
      } else {
        // Create
        const response = await api.post('/parts', partData)
        setParts([...parts, response.data])
      }
      setShowForm(false)
      setEditingPart(null)
    } catch (error) {
      console.error('Error saving part:', error)
      alert('Erreur lors de la sauvegarde de la pièce')
    }
  }

  const getStockLevelStyle = (part: Part) => {
    if (part.stock_quantity <= part.min_stock_level) {
      return 'bg-red-50 text-red-700 border-red-200'
    } else if (part.stock_quantity <= part.min_stock_level * 2) {
      return 'bg-amber-50 text-amber-700 border-amber-200'
    }
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  const getStockLevelText = (part: Part) => {
    if (part.stock_quantity <= part.min_stock_level) {
      return 'Stock bas'
    } else if (part.stock_quantity <= part.min_stock_level * 2) {
      return 'Stock limité'
    }
    return 'En stock'
  }

  const getStockLevelIcon = (part: Part) => {
    if (part.stock_quantity <= part.min_stock_level) {
      return <AlertTriangle className="h-4 w-4" />
    } else if (part.stock_quantity <= part.min_stock_level * 2) {
      return <AlertTriangle className="h-4 w-4" />
    }
    return <CheckCircle className="h-4 w-4" />
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
            Chargement du stock...
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
          <h1 className="text-3xl font-black text-white mb-2">Stock</h1>
          <p className="text-gray-400">Gérez votre stock de pièces</p>
        </div>
        <button
          onClick={handleAddPart}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle pièce
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 glass-panel !p-4 animate-slideUp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Niveau de stock</label>
              <select
                value={selectedStockLevel}
                onChange={(e) => setSelectedStockLevel(e.target.value)}
                className="input"
              >
                <option value="all">Tous les niveaux</option>
                <option value="low">Stock bas</option>
                <option value="ok">Stock OK</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-400">
                {filteredParts.length} pièce{filteredParts.length > 1 ? 's' : ''}
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
            placeholder="Rechercher une pièce..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Part List */}
      {filteredParts.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Package className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-gray-300 font-black text-lg mb-2">
            {searchTerm || selectedStockLevel !== 'all' ? 'Aucune pièce trouvée' : 'Aucune pièce'}
          </p>
          <p className="text-sm text-gray-400 font-medium mb-4">
            {searchTerm || selectedStockLevel !== 'all' 
              ? 'Essayez de modifier vos filtres de recherche' 
              : 'Créez votre première pièce pour commencer'
            }
          </p>
          {!searchTerm && selectedStockLevel === 'all' && (
            <button className="btn btn-primary" onClick={handleAddPart}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle pièce
            </button>
          )}
        </div>
      ) : (
        <div className="glass-panel overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                    Pièce
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                    Prix unitaire
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                    Stock minimum
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="relative px-6 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredParts.map((part, index) => (
                  <tr
                    key={part.id}
                    className="hover:bg-white/10/50 transition-all duration-200 group animate-slideUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                          <Package className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-white">
                            {part.name}
                          </div>
                          {part.description && (
                            <div className="text-xs text-gray-400 truncate max-w-xs">
                              {part.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-300 font-mono">
                        {part.reference || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-black text-white">
                        {part.price.toLocaleString('fr-FR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} €
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-black text-white">
                        {part.stock_quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-300">
                        {part.min_stock_level}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1.5 text-xs font-black rounded-full border ${getStockLevelStyle(part)}`}>
                        {getStockLevelIcon(part)}
                        <span className="ml-1.5">{getStockLevelText(part)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewPart(part)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                          title="Voir"
                        >
                          <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleEditPart(part)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDeletePart(part)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <PartForm
          part={editingPart}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingPart(null)
          }}
        />
      )}

      {/* Detail Modal */}
      {showDetail && selectedPart && (
        <PartDetail
          part={selectedPart}
          onClose={() => {
            setShowDetail(false)
            setSelectedPart(null)
          }}
          onEdit={() => {
            setShowDetail(false)
            handleEditPart(selectedPart)
          }}
        />
      )}
    </div>
  )
}
