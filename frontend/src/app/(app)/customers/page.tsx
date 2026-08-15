"use client";

import CustomerDetail from "@/components/CustomerDetail";
import CustomerForm from "@/components/CustomerForm";
import api from "@/lib/api";
import { Client } from "@/types";
import {
    Building,
    Download,
    Edit,
    Eye,
    Mail,
    MapPin,
    Phone,
    Plus,
    Search,
    Trash2,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Client[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfessionalOnly, setShowProfessionalOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Client | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Client | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, showProfessionalOnly]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/clients");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.first_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone?.includes(searchTerm) ||
          customer.company_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by type
    if (showProfessionalOnly) {
      filtered = filtered.filter((customer) => customer.is_professional);
    }

    setFilteredCustomers(filtered);
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer: Client) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleViewCustomer = (customer: Client) => {
    setSelectedCustomer(customer);
    setShowDetail(true);
  };

  const handleDeleteCustomer = async (customer: Client) => {
    if (
      window.confirm(
        `Are you sure you want to delete customer "${customer.first_name} ${customer.last_name}"?`,
      )
    ) {
      try {
        await api.delete(`/clients/${customer.id}`);
        setCustomers(customers.filter((c) => c.id !== customer.id));
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Error deleting customer");
      }
    }
  };

  const handleFormSubmit = async (customerData: Partial<Client>) => {
    try {
      if (editingCustomer) {
        // Update
        const response = await api.put(
          `/clients/${editingCustomer.id}`,
          customerData,
        );
        setCustomers(
          customers.map((c) =>
            c.id === editingCustomer.id ? response.data : c,
          ),
        );
      } else {
        // Create
        const response = await api.post("/clients", customerData);
        setCustomers([...customers, response.data]);
      }
      setShowForm(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Erreur lors de la sauvegarde du client");
    }
  };

  const handleExportCustomers = () => {
    const csvContent = [
      [
        "Last Name",
        "First Name",
        "Email",
        "Phone",
        "Address",
        "Type",
        "Company",
        "Created Date",
      ],
      ...filteredCustomers.map((customer) => [
        customer.last_name,
        customer.first_name,
        customer.email || "",
        customer.phone || "",
        customer.address || "",
        customer.is_professional ? "Professional" : "Individual",
        customer.company_name || "",
        new Date(customer.created_at).toLocaleDateString("en-US"),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `customers_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-200 rounded-full animate-ping"></div>
          </div>
          <p className="mt-4 text-gray-300 font-semibold">
            Chargement des clients...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">


      {/* Filters */}
      <div className="mb-6 glass-panel !p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                className="input pl-12 pr-4 py-3"
                placeholder="Rechercher des clients (nom, email, téléphone, entreprise)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-white/20 rounded"
                checked={showProfessionalOnly}
                onChange={(e) => setShowProfessionalOnly(e.target.checked)}
              />
              <span className="text-sm text-gray-300">
                Professionnels uniquement
              </span>
            </label>
            <div className="text-sm text-gray-400">
              {filteredCustomers.length} client
              {filteredCustomers.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-gray-300 font-black text-lg mb-2">
            {searchTerm || showProfessionalOnly
              ? "Aucun client trouvé"
              : "Aucun client"}
          </p>
          <p className="text-sm text-gray-400 font-medium mb-4">
            {searchTerm || showProfessionalOnly
              ? "Essayez de modifier vos filtres de recherche"
              : "Ajoutez votre premier client pour commencer"}
          </p>
          {!searchTerm && !showProfessionalOnly && (
            <button className="btn btn-primary" onClick={handleAddCustomer}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau client
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer, index) => (
            <div
              key={customer.id}
              className="bg-white/80 backdrop-blur border border-white/10 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 group animate-slideUp"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    {customer.is_professional ? (
                      <Building className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Users className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {customer.first_name} {customer.last_name}
                    </h3>
                    {customer.is_professional && customer.company_name && (
                      <p className="text-sm text-blue-600 font-medium">
                        {customer.company_name}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    customer.is_professional
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-white/5 text-gray-300 border border-white/10"
                  }`}
                >
                  {customer.is_professional ? "Pro" : "Particulier"}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                {customer.email && (
                  <div className="flex items-center text-sm text-gray-300">
                    <Mail className="h-4 w-4 mr-2 text-slate-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center text-sm text-gray-300">
                    <Phone className="h-4 w-4 mr-2 text-slate-400" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-start text-sm text-gray-300">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400 mt-0.5" />
                    <span className="line-clamp-2">{customer.address}</span>
                  </div>
                )}
              </div>

              {/* Created Date */}
              <div className="text-xs text-gray-400 mb-4">
                Ajouté le{" "}
                {new Date(customer.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleViewCustomer(customer)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                    title="Voir détails"
                  >
                    <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleEditCustomer(customer)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer)}
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
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {/* Detail Modal */}
      {showDetail && selectedCustomer && (
        <CustomerDetail
          customer={selectedCustomer}
          onClose={() => {
            setShowDetail(false);
            setSelectedCustomer(null);
          }}
          onEdit={() => {
            setShowDetail(false);
            handleEditCustomer(selectedCustomer);
          }}
        />
      )}
    </div>
  );
}
