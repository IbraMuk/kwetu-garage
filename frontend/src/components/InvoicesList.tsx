"use client";

import api from "@/lib/api";
import { Invoice } from "@/types";
import {
    Calendar,
    DollarSign,
    Download,
    Edit,
    Eye,
    FileText,
    Filter,
    Plus,
    Search,
    Trash2,
    User
} from "lucide-react";
import { useEffect, useState } from "react";

export default function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get("/invoices");
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-50 text-blue-700 border-blue-200 shadow-sm";
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200 shadow-sm";
      case "cancelled":
        return "bg-slate-50 text-slate-700 border-slate-200 shadow-sm";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 shadow-sm";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "paid":
        return "Payée";
      case "overdue":
        return "En retard";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.invoice_number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || invoice.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-200 rounded-full animate-ping"></div>
          </div>
          <p className="mt-4 text-slate-600 font-semibold">
            Chargement des factures...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Factures
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            Gestion des factures et des paiements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-ghost"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </button>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Créer une facture
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white/80 backdrop-blur border border-slate-200 rounded-2xl animate-slideUp">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
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
          </div>
        </div>
      )}

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

      <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                  Numéro
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                  Montant
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
                  className="hover:bg-slate-50/50 transition-all duration-200 group animate-slideUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">
                          {invoice.invoice_number}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          ID: {invoice.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="text-sm font-semibold text-slate-700">
                        Client ID: {invoice.client_id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                      {new Date(invoice.issue_date).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1.5 text-xs font-black rounded-full border ${getStatusStyle(invoice.status)}`}
                    >
                      {getStatusText(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-slate-400" />
                      <div className="text-sm font-black text-slate-900">
                        {invoice.total_amount.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                        title="Voir"
                      >
                        <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                        title="Télécharger"
                      >
                        <Download className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
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
        {filteredInvoices.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-slate-400" />
            </div>
            <p className="text-slate-600 font-black text-lg mb-2">
              Aucune facture trouvée
            </p>
            <p className="text-sm text-slate-500 font-medium">
              Créez votre première facture pour commencer
            </p>
            <button className="btn btn-primary mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Créer une facture
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


