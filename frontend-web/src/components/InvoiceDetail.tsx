"use client";

import { useState, useEffect } from 'react'
import { X, Edit, FileText, User, Calendar, DollarSign, CheckCircle, AlertCircle, Clock, XCircle, Download, FileDown } from 'lucide-react'
import { Invoice, Client } from '@/types'
import api from '@/lib/api'

interface InvoiceDetailProps {
  invoice: Invoice
  onClose: () => void
  onEdit: () => void
}

export default function InvoiceDetail({ invoice, onClose, onEdit }: InvoiceDetailProps) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClient()
  }, [invoice.client_id])

  const fetchClient = async () => {
    try {
      const clientResponse = await api.get(`/clients/${invoice.client_id}`)
      setClient(clientResponse.data)
    } catch (error) {
      console.error('Error fetching client:', error)
    } finally {
      setLoading(false)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />
      case 'paid':
        return <CheckCircle className="h-5 w-5" />
      case 'overdue':
        return <AlertCircle className="h-5 w-5" />
      case 'cancelled':
        return <XCircle className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const isOverdue = () => {
    if (invoice.status === 'paid' || invoice.status === 'cancelled') return false
    if (!invoice.due_date) return false
    return new Date(invoice.due_date) < new Date()
  }

  const handleExport = () => {
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

  const handlePdfExport = () => {
    window.open(`${api.defaults.baseURL}/invoices/${invoice.id}/pdf`, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mr-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Facture
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex px-3 py-1 text-xs font-black rounded-full border ${getStatusStyle(invoice.status)}`}>
                  {getStatusIcon(invoice.status)}
                  <span className="ml-1.5">{getStatusText(invoice.status)}</span>
                </span>
                {isOverdue() && invoice.status !== 'paid' && (
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 border border-red-200">
                    En retard
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePdfExport}
              className="btn btn-ghost"
              title="Télécharger PDF"
            >
              <FileDown className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button
              onClick={handleExport}
              className="btn btn-ghost"
              title="Exporter"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </button>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Invoice Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Invoice Number */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Numéro de facture</p>
                      <p className="text-lg font-black text-blue-900">
                        {invoice.invoice_number}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center">
                    <DollarSign className="h-6 w-6 text-emerald-600 mr-3" />
                    <div>
                      <p className="text-sm text-emerald-600 font-medium">Montant total</p>
                      <p className="text-lg font-black text-emerald-900">
                        {invoice.total_amount.toLocaleString('fr-FR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} €
                      </p>
                    </div>
                  </div>
                </div>

                {/* Issue Date */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-slate-600 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Date d'émission</p>
                      <p className="text-base font-black text-slate-900">
                        {new Date(invoice.issue_date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Due Date */}
                {invoice.due_date && (
                  <div className={`p-4 rounded-xl border ${
                    isOverdue() && invoice.status !== 'paid'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center">
                      <Calendar className={`h-5 w-5 mr-3 ${
                        isOverdue() && invoice.status !== 'paid' ? 'text-red-600' : 'text-slate-600'
                      }`} />
                      <div>
                        <p className={`text-sm font-medium ${
                          isOverdue() && invoice.status !== 'paid' ? 'text-red-600' : 'text-slate-600'
                        }`}>Date d'échéance</p>
                        <p className="text-base font-black text-slate-900">
                          {new Date(invoice.due_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Client Information */}
              {client && (
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-3">Client</h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mr-4">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900">
                            {client.first_name} {client.last_name}
                          </p>
                          {client.is_professional && client.company_name && (
                            <p className="text-sm text-blue-600 font-medium">{client.company_name}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Information */}
              <div className={`p-4 rounded-xl border ${
                invoice.status === 'paid'
                  ? 'bg-emerald-50 border-emerald-200'
                  : invoice.status === 'overdue' || isOverdue()
                  ? 'bg-red-50 border-red-200'
                  : invoice.status === 'cancelled'
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(invoice.status)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-slate-700">Statut</p>
                      <p className="text-lg font-black text-slate-900">
                        {getStatusText(invoice.status)}
                      </p>
                    </div>
                  </div>
                  {isOverdue() && invoice.status !== 'paid' && (
                    <div className="text-right">
                      <p className="text-sm text-red-600 font-medium">Jours de retard</p>
                      <p className="text-lg font-black text-red-900">
                        {Math.floor((new Date().getTime() - new Date(invoice.due_date!).getTime()) / (1000 * 60 * 60 * 24))}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Repair Information */}
              {invoice.repair_id && (
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-3">Réparation associée</h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-600">
                      Réparation ID: {invoice.repair_id}
                    </p>
                  </div>
                </div>
              )}

              {/* Created/Updated */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Créée le {new Date(invoice.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
