'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, AlertTriangle, Package } from 'lucide-react'
import api from '@/lib/api'
import { Part } from '@/types'

export default function PartsList() {
  const [parts, setParts] = useState<Part[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showLowStock, setShowLowStock] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchParts()
  }, [showLowStock])

  const fetchParts = async () => {
    try {
      const response = await api.get('/parts', {
        params: { low_stock: showLowStock }
      })
      setParts(response.data)
    } catch (error) {
      console.error('Error fetching parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500 font-medium">Chargement des pièces...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pièces détachées</h2>
          <p className="mt-1 text-sm text-slate-500">
            Gestion des pièces détachées et du stock.
          </p>
        </div>
        <button className="btn btn-primary self-start sm:self-auto">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une pièce
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            className="input pl-11"
            placeholder="Rechercher une pièce..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)}
          />
          <span className="text-sm text-slate-600">Stock faible uniquement</span>
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pièce
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Stock minimum
                </th>
                <th className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredParts.map((part) => (
                <tr 
                  key={part.id} 
                  className={`hover:bg-slate-50/50 transition-colors ${
                    part.stock_quantity <= part.min_stock_level ? 'bg-red-50/50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                        part.stock_quantity <= part.min_stock_level ? 'bg-red-100' : 'bg-violet-100'
                      }`}>
                        <Package className={`h-5 w-5 ${
                          part.stock_quantity <= part.min_stock_level ? 'text-red-600' : 'text-violet-600'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">{part.name}</span>
                          {part.stock_quantity <= part.min_stock_level && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        {part.description && (
                          <div className="text-xs text-slate-500 truncate max-w-[200px]">
                            {part.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600">{part.reference}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {part.price.toLocaleString()} $
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-semibold ${
                      part.stock_quantity <= part.min_stock_level ? 'text-red-600' : 'text-slate-900'
                    }`}>
                      {part.stock_quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600">{part.min_stock_level}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredParts.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Aucune pièce trouvée</p>
            <p className="text-sm text-slate-400 mt-1">Ajoutez des pièces à votre inventaire</p>
          </div>
        )}
      </div>
    </div>
  )
}

