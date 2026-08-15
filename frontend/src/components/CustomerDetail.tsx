"use client";

import api from "@/lib/api";
import { Client, Invoice, Vehicle } from "@/types";
import {
    Building,
    Calendar,
    Car,
    DollarSign,
    Edit,
    FileText,
    Mail,
    MapPin,
    Phone,
    Users,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface CustomerDetailProps {
  customer: Client;
  onClose: () => void;
  onEdit: () => void;
}

export default function CustomerDetail({
  customer,
  onClose,
  onEdit,
}: CustomerDetailProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "vehicles" | "invoices">(
    "info",
  );

  useEffect(() => {
    fetchCustomerData();
  }, [customer.id]);

  const fetchCustomerData = async () => {
    try {
      // Fetch customer's vehicles
      const vehiclesResponse = await api.get(
        `/vehicles?client_id=${customer.id}`,
      );
      setVehicles(vehiclesResponse.data);

      // Fetch customer's invoices
      const invoicesResponse = await api.get(
        `/invoices?client_id=${customer.id}`,
      );
      setInvoices(invoicesResponse.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200";
      case "cancelled":
        return "bg-slate-50 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "paid":
        return "Paid";
      case "overdue":
        return "Overdue";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const totalInvoices = invoices.reduce(
    (sum, invoice) => sum + invoice.total_amount,
    0,
  );
  const paidInvoices = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.total_amount, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mr-4">
              {customer.is_professional ? (
                <Building className="h-8 w-8 text-blue-600" />
              ) : (
                <Users className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {customer.first_name} {customer.last_name}
              </h2>
              {customer.is_professional && customer.company_name && (
                <p className="text-blue-600 font-medium">
                  {customer.company_name}
                </p>
              )}
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                  customer.is_professional
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                {customer.is_professional ? "Professional" : "Individual"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="btn btn-ghost" title="Edit">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "info"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Information
          </button>
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "vehicles"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Vehicles
            {vehicles.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                {vehicles.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "invoices"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Invoices
            {invoices.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                {invoices.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 200px)" }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Info Tab */}
              {activeTab === "info" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-slate-900">
                        Contact
                      </h3>

                      {customer.email && (
                        <div className="flex items-center text-slate-600">
                          <Mail className="h-4 w-4 mr-3 text-slate-400" />
                          <span>{customer.email}</span>
                        </div>
                      )}

                      {customer.phone && (
                        <div className="flex items-center text-slate-600">
                          <Phone className="h-4 w-4 mr-3 text-slate-400" />
                          <span>{customer.phone}</span>
                        </div>
                      )}

                      {customer.address && (
                        <div className="flex items-start text-slate-600">
                          <MapPin className="h-4 w-4 mr-3 text-slate-400 mt-0.5" />
                          <span>{customer.address}</span>
                        </div>
                      )}
                    </div>

                    {/* General Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-slate-900">
                        General Info
                      </h3>

                      <div className="flex items-center text-slate-600">
                        <Calendar className="h-4 w-4 mr-3 text-slate-400" />
                        <span>
                          Customer since{" "}
                          {new Date(customer.created_at).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      <div className="flex items-center text-slate-600">
                        <Car className="h-4 w-4 mr-3 text-slate-400" />
                        <span>
                          {vehicles.length} vehicle
                          {vehicles.length > 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="flex items-center text-slate-600">
                        <FileText className="h-4 w-4 mr-3 text-slate-400" />
                        <span>
                          {invoices.length} invoice
                          {invoices.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {customer.notes && (
                    <div>
                      <h3 className="text-lg font-black text-slate-900 mb-3">
                        Notes
                      </h3>
                      <div className="p-4 bg-slate-50 rounded-xl text-slate-700">
                        {customer.notes}
                      </div>
                    </div>
                  )}

                  {/* Financial Summary */}
                  {invoices.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-medium">
                              Total Billed
                            </p>
                            <p className="text-2xl font-black text-blue-900">
                              $
                              {totalInvoices.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                          <DollarSign className="h-8 w-8 text-blue-400" />
                        </div>
                      </div>

                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-emerald-600 font-medium">
                              Amount Paid
                            </p>
                            <p className="text-2xl font-black text-emerald-900">
                              $
                              {paidInvoices.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                          <DollarSign className="h-8 w-8 text-emerald-400" />
                        </div>
                      </div>

                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-amber-600 font-medium">
                              Balance Due
                            </p>
                            <p className="text-2xl font-black text-amber-900">
                              $
                              {(totalInvoices - paidInvoices).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </p>
                          </div>
                          <DollarSign className="h-8 w-8 text-amber-400" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Vehicles Tab */}
              {activeTab === "vehicles" && (
                <div>
                  {vehicles.length === 0 ? (
                    <div className="text-center py-12">
                      <Car className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600 font-black text-lg mb-2">
                        No Vehicles
                      </p>
                      <p className="text-sm text-slate-500">
                        This customer has no registered vehicles
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mr-4">
                                <Car className="h-6 w-6 text-emerald-600" />
                              </div>
                              <div>
                                <h4 className="text-lg font-black text-slate-900">
                                  {vehicle.make} {vehicle.model}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  {vehicle.year} • {vehicle.license_plate} •{" "}
                                  {vehicle.mileage.toLocaleString()} km
                                </p>
                              </div>
                            </div>
                            <div className="text-sm text-slate-500">
                              Added on{" "}
                              {new Date(vehicle.created_at).toLocaleDateString(
                                "en-US",
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Invoices Tab */}
              {activeTab === "invoices" && (
                <div>
                  {invoices.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600 font-black text-lg mb-2">
                        No Invoices
                      </p>
                      <p className="text-sm text-slate-500">
                        This customer has no invoices
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {invoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4">
                                <FileText className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="text-lg font-black text-slate-900">
                                  {invoice.invoice_number}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  {new Date(
                                    invoice.issue_date,
                                  ).toLocaleDateString("en-US")}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-black rounded-full border ${getStatusStyle(invoice.status)}`}
                              >
                                {getStatusText(invoice.status)}
                              </span>
                              <p className="text-lg font-black text-slate-900 mt-1">
                                $
                                {invoice.total_amount.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
