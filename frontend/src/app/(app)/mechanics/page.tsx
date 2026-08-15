"use client";

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Wrench, Mail, Phone, Calendar, DollarSign, Eye } from 'lucide-react'
import api, { unwrapList } from '@/lib/api'
import { Mechanic } from '@/types'
import MechanicForm from '@/components/MechanicForm'

function unwrapMechanic(data: unknown): Mechanic {
  if (data && typeof data === 'object' && 'mechanic' in data) {
    const wrapped = data as { mechanic?: Mechanic }
    if (wrapped.mechanic) return wrapped.mechanic
  }
  return data as Mechanic
}

export default function MechanicsPage() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([])
  const [filtered, setFiltered] = useState<Mechanic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingMechanic, setEditingMechanic] = useState<Mechanic | null>(null)
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null)

  useEffect(() => {
    fetchMechanics()
  }, [])

  useEffect(() => {
    filterMechanics()
  }, [mechanics, searchTerm])

  const fetchMechanics = async () => {
    try {
      const response = await api.get('/mechanics')
      setMechanics(unwrapList<Mechanic>(response.data))
    } catch (error) {
      console.error('Error fetching mechanics:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMechanics = () => {
    if (!searchTerm) {
      setFiltered(mechanics)
      return
    }
    const lower = searchTerm.toLowerCase()
    setFiltered(
      mechanics.filter(
        (m) =>
          m.first_name.toLowerCase().includes(lower) ||
          m.last_name.toLowerCase().includes(lower) ||
          m.email.toLowerCase().includes(lower) ||
          m.phone?.includes(searchTerm) ||
          m.speciality?.toLowerCase().includes(lower)
      )
    )
  }

  const handleAdd = () => {
    setEditingMechanic(null)
    setShowForm(true)
  }

  const handleEdit = (mechanic: Mechanic) => {
    setEditingMechanic(mechanic)
    setShowForm(true)
  }

  const handleDelete = async (mechanic: Mechanic) => {
    if (window.confirm(`Supprimer le mécanicien "${mechanic.first_name} ${mechanic.last_name}" ?`)) {
      try {
        await api.delete(`/mechanics/${mechanic.id}`)
        setMechanics(mechanics.filter((m) => m.id !== mechanic.id))
      } catch (error) {
        console.error('Error deleting mechanic:', error)
        alert('Erreur lors de la suppression')
      }
    }
  }

  const handleFormSubmit = async (data: Partial<Mechanic> & { password?: string }) => {
    try {
      if (editingMechanic) {
        const response = await api.put(`/mechanics/${editingMechanic.id}`, data)
        const updated = unwrapMechanic(response.data)
        setMechanics(mechanics.map((m) => (m.id === editingMechanic.id ? updated : m)))
      } else {
        const response = await api.post('/mechanics', data)
        const created = unwrapMechanic(response.data)
        setMechanics([...mechanics, created])
      }
      setShowForm(false)
      setEditingMechanic(null)
    } catch (error: unknown) {
      console.error('Error saving mechanic:', error)
      let message = 'Erreur lors de la sauvegarde'
      if (error && typeof error === 'object' && 'response' in error) {
        const res = (error as { response?: { data?: { error?: string; errors?: { msg: string }[] } } }).response
        if (res?.data?.error) {
          message = res.data.error
        } else if (Array.isArray(res?.data?.errors)) {
          const parts = res.data.errors.map((e) => e.msg).filter(Boolean)
          if (parts.length) message = parts.join(' · ')
        }
      }
      alert(message)
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
          <p className="mt-4 text-gray-300 font-semibold">Chargement des mécaniciens...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un mécanicien
        </button>
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
                placeholder="Rechercher un mécanicien (nom, email, spécialité)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            {filtered.length} mécanicien{filtered.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Grille des mécaniciens */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Wrench className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-gray-300 font-black text-lg mb-2">
            {searchTerm ? 'Aucun mécanicien trouvé' : 'Aucun mécanicien'}
          </p>
          <p className="text-sm text-gray-400 font-medium mb-4">
            {searchTerm ? 'Essayez de modifier votre recherche' : 'Ajoutez votre premier mécanicien'}
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un mécanicien
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mechanic, index) => (
            <div
              key={mechanic.id}
              className="bg-white/80 backdrop-blur border border-white/10 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 group animate-slideUp"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Wrench className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {mechanic.first_name} {mechanic.last_name}
                    </h3>
                    {mechanic.speciality && (
                      <p className="text-sm text-blue-400 font-medium">{mechanic.speciality}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    mechanic.is_available
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {mechanic.is_available ? 'Disponible' : 'Indisponible'}
                  </span>
                  {!mechanic.is_active && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      Inactif
                    </span>
                  )}
                </div>
              </div>

              {/* Informations */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-300">
                  <Mail className="h-4 w-4 mr-2 text-slate-400" />
                  <span className="truncate">{mechanic.email}</span>
                </div>
                {mechanic.phone && (
                  <div className="flex items-center text-sm text-gray-300">
                    <Phone className="h-4 w-4 mr-2 text-slate-400" />
                    <span>{mechanic.phone}</span>
                  </div>
                )}
                {mechanic.hourly_rate != null && (
                  <div className="flex items-center text-sm text-gray-300">
                    <DollarSign className="h-4 w-4 mr-2 text-slate-400" />
                    <span>{Number(mechanic.hourly_rate).toLocaleString('fr-FR')} FCFA/h</span>
                  </div>
                )}
                {mechanic.hire_date && (
                  <div className="flex items-center text-sm text-gray-300">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    <span>Embauché le {new Date(mechanic.hire_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>

              {/* Statistiques */}
              {mechanic.repairs_count != null && (
                <div className="mb-4 flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2.5 py-1 text-blue-400 font-semibold">
                    <Wrench className="h-3.5 w-3.5" />
                    {mechanic.repairs_count} réparation{mechanic.repairs_count > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedMechanic(mechanic)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleEdit(mechanic)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleDelete(mechanic)}
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
        <MechanicForm
          mechanic={editingMechanic}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingMechanic(null)
          }}
        />
      )}

      {/* Modal détail */}
      {selectedMechanic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedMechanic(null)}>
          <div className="glass-panel w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-black text-white">Détails du mécanicien</h2>
              <button onClick={() => setSelectedMechanic(null)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Wrench className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-xl font-black text-white">{selectedMechanic.first_name} {selectedMechanic.last_name}</h3>
                {selectedMechanic.speciality && <p className="text-blue-400 font-medium">{selectedMechanic.speciality}</p>}
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                  <Mail className="h-4 w-4 mr-3 text-slate-400" />
                  <span>{selectedMechanic.email}</span>
                </div>
                {selectedMechanic.phone && (
                  <div className="flex items-center text-sm text-gray-300">
                    <Phone className="h-4 w-4 mr-3 text-slate-400" />
                    <span>{selectedMechanic.phone}</span>
                  </div>
                )}
                {selectedMechanic.hourly_rate != null && (
                  <div className="flex items-center text-sm text-gray-300">
                    <DollarSign className="h-4 w-4 mr-3 text-slate-400" />
                    <span>{Number(selectedMechanic.hourly_rate).toLocaleString('fr-FR')} FCFA/h</span>
                  </div>
                )}
                {selectedMechanic.hire_date && (
                  <div className="flex items-center text-sm text-gray-300">
                    <Calendar className="h-4 w-4 mr-3 text-slate-400" />
                    <span>Embauché le {new Date(selectedMechanic.hire_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                {selectedMechanic.repairs_count != null && (
                  <div className="flex items-center text-sm text-gray-300">
                    <Wrench className="h-4 w-4 mr-3 text-slate-400" />
                    <span>{selectedMechanic.repairs_count} réparation{selectedMechanic.repairs_count > 1 ? 's' : ''} assignée{selectedMechanic.repairs_count > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                  selectedMechanic.is_available
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {selectedMechanic.is_available ? 'Disponible' : 'Indisponible'}
                </span>
                <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                  selectedMechanic.is_active
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {selectedMechanic.is_active ? 'Compte actif' : 'Compte inactif'}
                </span>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setSelectedMechanic(null)} className="btn btn-ghost">Fermer</button>
                <button
                  onClick={() => {
                    const m = selectedMechanic
                    setSelectedMechanic(null)
                    handleEdit(m)
                  }}
                  className="btn btn-primary"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
