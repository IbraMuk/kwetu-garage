"use client";

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Calendar, Clock, User, Car, Filter, Eye, CalendarDays } from 'lucide-react'
import api, { unwrapList } from '@/lib/api'
import { Appointment } from '@/types'
import AppointmentForm from '@/components/AppointmentForm'
import AppointmentDetail from '@/components/AppointmentDetail'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, searchTerm, selectedStatus, selectedDate])

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments')
      setAppointments(unwrapList<Appointment>(response.data))
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = [...appointments]

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrer par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === selectedStatus)
    }

    // Filtrer par date
    if (selectedDate) {
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointment_date).toDateString()
        const filterDate = new Date(selectedDate).toDateString()
        return appointmentDate === filterDate
      })
    }

    // Trier par date
    filtered.sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())

    setFilteredAppointments(filtered)
  }

  const handleAddAppointment = () => {
    setEditingAppointment(null)
    setShowForm(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setShowForm(true)
  }

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowDetail(true)
  }

  const handleDeleteAppointment = async (appointment: Appointment) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le rendez-vous "${appointment.title}" ?`)) {
      try {
        await api.delete(`/appointments/${appointment.id}`)
        setAppointments(appointments.filter(a => a.id !== appointment.id))
      } catch (error) {
        console.error('Error deleting appointment:', error)
        alert('Erreur lors de la suppression du rendez-vous')
      }
    }
  }

  const handleFormSubmit = async (appointmentData: Partial<Appointment>) => {
    try {
      if (editingAppointment) {
        // Mise à jour
        const response = await api.put(`/appointments/${editingAppointment.id}`, appointmentData)
        setAppointments(appointments.map(a => a.id === editingAppointment.id ? response.data : a))
      } else {
        // Création
        const response = await api.post('/appointments', appointmentData)
        setAppointments([...appointments, response.data])
      }
      setShowForm(false)
      setEditingAppointment(null)
    } catch (error) {
      console.error('Error saving appointment:', error)
      alert('Erreur lors de la sauvegarde du rendez-vous')
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
        return 'bg-white/5 text-gray-300 border-white/10'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-white/5 text-gray-300 border-white/10'
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

  const isPastAppointment = (appointmentDate: string) => {
    return new Date(appointmentDate) < new Date()
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
            Chargement des rendez-vous...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">


      {/* Filtres */}
      {showFilters && (
        <div className="mb-6 glass-panel !p-4 animate-slideUp">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Statut</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input"
              >
                <option value="all">Tous les statuts</option>
                <option value="scheduled">Planifié</option>
                <option value="confirmed">Confirmé</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input"
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-400">
                {filteredAppointments.length} rendez-vous
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recherche */}
      <div className="mb-6">
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            className="input pl-12 pr-4 py-3"
            placeholder="Rechercher un rendez-vous..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Liste des rendez-vous */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-gray-300 font-black text-lg mb-2">
            {searchTerm || selectedStatus !== 'all' || selectedDate ? 'Aucun rendez-vous trouvé' : 'Aucun rendez-vous'}
          </p>
          <p className="text-sm text-gray-400 font-medium mb-4">
            {searchTerm || selectedStatus !== 'all' || selectedDate 
              ? 'Essayez de modifier vos filtres de recherche' 
              : 'Créez votre premier rendez-vous pour commencer'
            }
          </p>
          {!searchTerm && selectedStatus === 'all' && !selectedDate && (
            <button className="btn btn-primary" onClick={handleAddAppointment}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau rendez-vous
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => {
            const appointmentDate = new Date(appointment.appointment_date)
            const isPast = isPastAppointment(appointment.appointment_date)
            
            return (
              <div
                key={appointment.id}
                className={`bg-white/80 backdrop-blur border rounded-2xl p-6 hover:shadow-lg transition-all duration-200 group animate-slideUp ${
                  isPast && appointment.status !== 'completed' && appointment.status !== 'cancelled'
                    ? 'border-amber-200 bg-amber-50/50'
                    : 'border-white/10'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    {/* Date et heure */}
                    <div className="flex-shrink-0 w-20 text-center mr-6">
                      <div className="text-3xl font-black text-blue-600">
                        {appointmentDate.getDate()}
                      </div>
                      <div className="text-sm text-gray-300 font-medium">
                        {appointmentDate.toLocaleDateString('fr-FR', { month: 'short' })}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {appointmentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-black text-white">
                          {appointment.title}
                        </h3>
                        <span className={`inline-flex px-3 py-1 text-xs font-black rounded-full border ${getStatusStyle(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                        {isPast && appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                            Passé
                          </span>
                        )}
                      </div>

                      {appointment.description && (
                        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                          {appointment.description}
                        </p>
                      )}

                      <div className="flex items-center gap-6 text-sm text-gray-300">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-slate-400" />
                          <span>{appointment.duration_minutes} min</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-slate-400" />
                          <span>Client ID: {appointment.client_id}</span>
                        </div>
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-slate-400" />
                          <span>Véhicule ID: {appointment.vehicle_id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleViewAppointment(appointment)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => handleEditAppointment(appointment)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(appointment)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal formulaire */}
      {showForm && (
        <AppointmentForm
          appointment={editingAppointment}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingAppointment(null)
          }}
        />
      )}

      {/* Modal détail */}
      {showDetail && selectedAppointment && (
        <AppointmentDetail
          appointment={selectedAppointment}
          onClose={() => {
            setShowDetail(false)
            setSelectedAppointment(null)
          }}
          onEdit={() => {
            setShowDetail(false)
            handleEditAppointment(selectedAppointment)
          }}
        />
      )}
    </div>
  )
}
