"use client";

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, FileText, Filter, Eye, Calendar, DollarSign, Download, User, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react'
import api, { unwrapList } from '@/lib/api'
import { Invoice, Client } from '@/types'
import InvoiceForm from '@/components/InvoiceForm'
import InvoiceDetail from '@/components/InvoiceDetail'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    fetchInvoices()
    fetchClients()
  }, [])

  useEffect(() => {
    filterInvoices()
  }, [invoices, searchTerm, selectedStatus])

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices')
      setInvoices(unwrapList<Invoice>(response.data))
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients')
      setClients(unwrapList<Client>(response.data))
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    if (!client) return '—'
    const name = `${client.first_name} ${client.last_name}`.trim()
    return client.is_professional && client.company_name
      ? `${name} (${client.company_name})`
      : name
  }

  const filterInvoices = () => {
    let filtered = invoices

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === selectedStatus)
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime())

    setFilteredInvoices(filtered)
  }

  const handleAddInvoice = () => {
    setEditingInvoice(null)
    setShowForm(true)
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setShowForm(true)
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowDetail(true)
  }

  const handleDeleteInvoice = async (invoice: Invoice) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la facture "${invoice.invoice_number}" ?`)) {
      try {
        await api.delete(`/invoices/${invoice.id}`)
        setInvoices(invoices.filter(i => i.id !== invoice.id))
      } catch (error) {
        console.error('Error deleting invoice:', error)
        alert('Erreur lors de la suppression de la facture')
      }
    }
  }

  const handleFormSubmit = async (invoiceData: Partial<Invoice>) => {
    try {
      if (editingInvoice) {
        // Update
        const response = await api.put(`/invoices/${editingInvoice.id}`, invoiceData)
        const updated = response.data?.invoice ?? response.data
        setInvoices(invoices.map(i => i.id === editingInvoice.id ? updated : i))
      } else {
        // Create
        const response = await api.post('/invoices', invoiceData)
        const created = response.data?.invoice ?? response.data
        setInvoices([...invoices, created])
      }
      setShowForm(false)
      setEditingInvoice(null)
    } catch (error) {
      console.error('Error saving invoice:', error)
      alert('Erreur lors de la sauvegarde de la facture')
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'overdue':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'cancelled':
        return 'bg-white/5 text-gray-300 border-white/10'
      default:
        return 'bg-white/5 text-gray-300 border-white/10'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'paid':
        return <CheckCircle className="h-4 w-4" />
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const isOverdue = (invoice: Invoice) => {
    if (invoice.status === 'paid' || invoice.status === 'cancelled') return false
    if (!invoice.due_date) return false
    return new Date(invoice.due_date) < new Date()
  }

  const handleExportInvoice = (invoice: Invoice) => {
    const csvContent = [
      ['Invoice Number', 'Issue Date', 'Due Date', 'Amount', 'Status'],
      [
        invoice.invoice_number,
        new Date(invoice.issue_date).toLocaleDateString('fr-FR'),
        invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('fr-FR') : 'N/A',
        invoice.total_amount.toFixed(2),
        getStatusText(invoice.status)
      ]
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `invoice_${invoice.invoice_number}.csv`)
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
            Chargement des factures...
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
          <h1 className="text-3xl font-black text-white mb-2">Factures</h1>
          <p className="text-gray-400">Gérez vos factures</p>
        </div>
        <button
          onClick={handleAddInvoice}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle facture
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
                <option value="paid">Payée</option>
                <option value="overdue">En retard</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-400">
                {filteredInvoices.length} facture{filteredInvoices.length > 1 ? 's' : ''}
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
            placeholder="Rechercher une facture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-gray-300 font-black text-lg mb-2">
            {searchTerm || selectedStatus !== 'all' ? 'Aucune facture trouvée' : 'Aucune facture'}
          </p>
          <p className="text-sm text-gray-400 font-medium mb-4">
            {searchTerm || selectedStatus !== 'all' 
              ? 'Essayez de modifier vos filtres de recherche' 
              : 'Créez votre première facture pour commencer'
            }
          </p>
          {!searchTerm && selectedStatus === 'all' && (
            <button className="btn btn-primary" onClick={handleAddInvoice}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle facture
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
                    Facture
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                    Date d'émission
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                    Date d'échéance
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
                {filteredInvoices.map((invoice, index) => (
                  <tr
                    key={invoice.id}
                    className={`hover:bg-white/10/50 transition-all duration-200 group animate-slideUp ${
                      isOverdue(invoice) && invoice.status !== 'paid' ? 'bg-red-50/30' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-white">
                            {invoice.invoice_number}
                          </div>
                          {isOverdue(invoice) && invoice.status !== 'paid' && (
                            <div className="text-xs text-red-600 font-medium flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              En retard
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-300">
                        {getClientName(invoice.client_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-black text-white">
                        {invoice.total_amount.toLocaleString('fr-FR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} $
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        {new Date(invoice.issue_date).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        {invoice.due_date 
                          ? new Date(invoice.due_date).toLocaleDateString('fr-FR')
                          : 'N/A'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1.5 text-xs font-black rounded-full border ${getStatusStyle(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1.5">{getStatusText(invoice.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleExportInvoice(invoice)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 group"
                          title="Exporter"
                        >
                          <Download className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                          title="Voir"
                        >
                          <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice)}
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
        <InvoiceForm
          invoice={editingInvoice}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingInvoice(null)
          }}
        />
      )}

      {/* Detail Modal */}
      {showDetail && selectedInvoice && (
        <InvoiceDetail
          invoice={selectedInvoice}
          onClose={() => {
            setShowDetail(false)
            setSelectedInvoice(null)
          }}
          onEdit={() => {
            setShowDetail(false)
            handleEditInvoice(selectedInvoice)
          }}
        />
      )}
    </div>
  )
}
