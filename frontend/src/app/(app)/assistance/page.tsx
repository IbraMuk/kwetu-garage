"use client";

import { useEffect, useState } from 'react'
import { LifeBuoy, Search, Eye, Phone, MapPin, User, CheckCircle, Clock, XCircle, X, Wrench, Truck, AlertTriangle } from 'lucide-react'
import api, { unwrapList } from '@/lib/api'
import { AssistanceRequest } from '@/types'

const statusOptions: AssistanceRequest['status'][] = ['pending', 'in_progress', 'resolved', 'cancelled']

export default function AssistancePage() {
  const [requests, setRequests] = useState<AssistanceRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<AssistanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, selectedStatus])

  const fetchRequests = async () => {
    try {
      const response = await api.get('/assistance')
      setRequests(unwrapList<AssistanceRequest>(response.data))
    } catch (error) {
      console.error('Error fetching assistance requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterRequests = () => {
    let filtered = requests

    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(req => req.status === selectedStatus)
    }

    filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setFilteredRequests(filtered)
  }

  const handleUpdateStatus = async (request: AssistanceRequest, status: AssistanceRequest['status']) => {
    setUpdatingId(request.id)
    try {
      const response = await api.patch(`/assistance/${request.id}/status`, { status })
      const updated = response.data?.data ?? response.data
      setRequests(prev => prev.map(r => r.id === request.id ? updated : r))
      if (selectedRequest?.id === request.id) setSelectedRequest(updated)
    } catch (error: any) {
      console.error('Error updating assistance status:', error)
      const message = error.response?.data?.error || 'Erreur lors de la mise à jour du statut'
      alert(message)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'cancelled':
        return 'bg-white/5 text-gray-300 border-white/10'
      default:
        return 'bg-white/5 text-gray-300 border-white/10'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'in_progress': return 'En cours'
      case 'resolved': return 'Résolue'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'in_progress': return <Wrench className="h-4 w-4" />
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <LifeBuoy className="h-4 w-4" />
    }
  }

  const getIssueLabel = (issueType: string) => issueType === 'towing' ? 'Remorquage' : 'Dépannage sur place'
  const getIssueIcon = (issueType: string) => issueType === 'towing' ? <Truck className="h-4 w-4 mr-2 text-slate-400" /> : <Wrench className="h-4 w-4 mr-2 text-slate-400" />

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-200 rounded-full animate-ping"></div>
          </div>
          <p className="mt-4 text-gray-300 font-semibold">Chargement des demandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Dépannage</h1>
          <p className="text-gray-400">Demandes d'assistance et de remorquage de vos clients</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            className="input pl-12 pr-4 py-3"
            placeholder="Rechercher par client, téléphone ou lieu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input md:w-56"
        >
          <option value="all">Tous les statuts</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{getStatusText(status)}</option>
          ))}
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <LifeBuoy className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-gray-300 font-black text-lg mb-2">
            {searchTerm || selectedStatus !== 'all' ? 'Aucune demande trouvée' : 'Aucune demande de dépannage'}
          </p>
          <p className="text-sm text-gray-400 font-medium">
            {searchTerm || selectedStatus !== 'all'
              ? 'Essayez de modifier vos filtres de recherche'
              : 'Les demandes envoyées depuis l\'application mobile apparaîtront ici'}
          </p>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">Localisation</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">Statut</th>
                  <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRequests.map((request, index) => (
                  <tr
                    key={request.id}
                    className={`hover:bg-white/10/50 transition-all duration-200 group animate-slideUp ${
                      request.status === 'pending' ? 'bg-red-50/20' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="text-sm font-black text-white">{request.client_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-slate-400" />
                        {request.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300 max-w-xs truncate">
                        <MapPin className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{request.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        {getIssueIcon(request.issue_type)}
                        {getIssueLabel(request.issue_type)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1.5 text-xs font-black rounded-full border ${getStatusStyle(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1.5">{getStatusText(request.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => { setSelectedRequest(request); setShowDetail(true) }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                        title="Voir"
                      >
                        <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-red-50">
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center mr-4">
                  <LifeBuoy className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Demande de dépannage</h2>
                  <span className={`inline-flex mt-1 px-3 py-1 text-xs font-black rounded-full border ${getStatusStyle(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    <span className="ml-1.5">{getStatusText(selectedRequest.status)}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setShowDetail(false); setSelectedRequest(null) }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-slate-600 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Client</p>
                      <p className="text-base font-black text-slate-900">{selectedRequest.client_name}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-slate-600 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Téléphone</p>
                      <p className="text-base font-black text-slate-900">{selectedRequest.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 md:col-span-2">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-slate-600 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Localisation</p>
                      <p className="text-base font-black text-slate-900">{selectedRequest.location}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 md:col-span-2">
                  <div className="flex items-center">
                    {selectedRequest.issue_type === 'towing'
                      ? <Truck className="h-5 w-5 text-slate-600 mr-3" />
                      : <Wrench className="h-5 w-5 text-slate-600 mr-3" />}
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Type d'intervention</p>
                      <p className="text-base font-black text-slate-900">{getIssueLabel(selectedRequest.issue_type)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedRequest.description && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm text-amber-700 font-medium mb-1">Description</p>
                  <p className="text-sm text-amber-900">{selectedRequest.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-bold text-slate-700 mb-2">Changer le statut</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status}
                      disabled={updatingId === selectedRequest.id || selectedRequest.status === status}
                      onClick={() => handleUpdateStatus(selectedRequest, status)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                        selectedRequest.status === status
                          ? getStatusStyle(status) + ' cursor-default'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {getStatusText(status)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
