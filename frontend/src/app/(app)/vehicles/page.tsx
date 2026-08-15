"use client";

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Car, Filter, Eye, Gauge, Calendar } from 'lucide-react'
import api from '@/lib/api'
import { Vehicle } from '@/types'
import VehicleForm from '@/components/VehicleForm'
import VehicleDetail from '@/components/VehicleDetail'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedMake, setSelectedMake] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    filterVehicles()
  }, [vehicles, searchTerm, selectedYear, selectedMake])

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles')
      setVehicles(response.data)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterVehicles = () => {
    let filtered = vehicles

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.year.toString() === selectedYear)
    }

    // Filter by make
    if (selectedMake !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.make.toLowerCase() === selectedMake.toLowerCase())
    }

    setFilteredVehicles(filtered)
  }

  const handleAddVehicle = () => {
    setEditingVehicle(null)
    setShowForm(true)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setShowForm(true)
  }

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowDetail(true)
  }

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le véhicule "${vehicle.make} ${vehicle.model}" (${vehicle.license_plate}) ?`)) {
      try {
        await api.delete(`/vehicles/${vehicle.id}`)
        setVehicles(vehicles.filter(v => v.id !== vehicle.id))
      } catch (error) {
        console.error('Error deleting vehicle:', error)
        alert('Erreur lors de la suppression du véhicule')
      }
    }
  }

  const handleFormSubmit = async (vehicleData: Partial<Vehicle>) => {
    try {
      if (editingVehicle) {
        // Update
        const response = await api.put(`/vehicles/${editingVehicle.id}`, vehicleData)
        setVehicles(vehicles.map(v => v.id === editingVehicle.id ? response.data : v))
      } else {
        // Create
        const response = await api.post('/vehicles', vehicleData)
        setVehicles([...vehicles, response.data])
      }
      setShowForm(false)
      setEditingVehicle(null)
    } catch (error) {
      console.error('Error saving vehicle:', error)
      alert('Erreur lors de la sauvegarde du véhicule')
    }
  }

  const getUniqueMakes = () => {
    const makes = new Set(vehicles.map(v => v.make))
    return Array.from(makes).sort()
  }

  const getUniqueYears = () => {
    const years = new Set(vehicles.map(v => v.year))
    return Array.from(years).sort((a, b) => b - a)
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
            Chargement des véhicules...
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
          <h1 className="text-3xl font-black text-white mb-2">Véhicules</h1>
          <p className="text-gray-400">Gérez votre parc automobile</p>
        </div>
        <button
          onClick={handleAddVehicle}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un véhicule
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 glass-panel !p-4 animate-slideUp">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Marque</label>
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="input"
              >
                <option value="all">Toutes les marques</option>
                {getUniqueMakes().map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Année</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="input"
              >
                <option value="all">Toutes les années</option>
                {getUniqueYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-400">
                {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''}
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
            placeholder="Rechercher un véhicule (marque, modèle, plaque, VIN)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Vehicle List */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Car className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-gray-300 font-black text-lg mb-2">
            {searchTerm || selectedYear !== 'all' || selectedMake !== 'all' ? 'Aucun véhicule trouvé' : 'Aucun véhicule'}
          </p>
          <p className="text-sm text-gray-400 font-medium mb-4">
            {searchTerm || selectedYear !== 'all' || selectedMake !== 'all' 
              ? 'Essayez de modifier vos filtres de recherche' 
              : 'Enregistrez votre premier véhicule pour commencer'
            }
          </p>
          {!searchTerm && selectedYear === 'all' && selectedMake === 'all' && (
            <button className="btn btn-primary" onClick={handleAddVehicle}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un véhicule
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
                    Véhicule
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                    Kilométrage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                    Date d'ajout
                  </th>
                  <th className="relative px-6 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredVehicles.map((vehicle, index) => (
                  <tr
                    key={vehicle.id}
                    className="hover:bg-white/10/50 transition-all duration-200 group animate-slideUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                          <Car className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-white">
                            {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-xs text-gray-400 font-medium">
                            {vehicle.year} · {vehicle.license_plate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-300">
                        Client ID: {vehicle.client_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <Gauge className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="font-semibold">
                          {vehicle.mileage.toLocaleString('fr-FR')}
                        </span>
                        <span className="ml-1 text-xs text-gray-400">km</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        {new Date(vehicle.created_at).toLocaleDateString(
                          'fr-FR',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          },
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewVehicle(vehicle)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                          title="Voir"
                        >
                          <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleEditVehicle(vehicle)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle)}
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
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingVehicle(null)
          }}
        />
      )}

      {/* Detail Modal */}
      {showDetail && selectedVehicle && (
        <VehicleDetail
          vehicle={selectedVehicle}
          onClose={() => {
            setShowDetail(false)
            setSelectedVehicle(null)
          }}
          onEdit={() => {
            setShowDetail(false)
            handleEditVehicle(selectedVehicle)
          }}
        />
      )}
    </div>
  )
}
