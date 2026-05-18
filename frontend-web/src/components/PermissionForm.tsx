"use client";

import { User } from "@/types";
import {
    Calendar,
    Car,
    Check,
    FileText,
    Settings,
    Shield,
    Users,
    Wrench,
    X
} from "lucide-react";
import { useState } from "react";

interface PermissionFormProps {
  user: User;
  onClose: () => void;
}

export default function PermissionForm({ user, onClose }: PermissionFormProps) {
  const [permissions, setPermissions] = useState({
    // Dashboard permissions
    view_dashboard: true,
    view_statistics: true,

    // Client management
    view_clients: true,
    add_clients: false,
    edit_clients: false,
    delete_clients: false,

    // Vehicle management
    view_vehicles: true,
    add_vehicles: false,
    edit_vehicles: false,
    delete_vehicles: false,

    // Repair management
    view_repairs: true,
    add_repairs: false,
    edit_repairs: false,
    delete_repairs: false,

    // Invoice management
    view_invoices: true,
    add_invoices: false,
    edit_invoices: false,
    delete_invoices: false,

    // Stock management
    view_stock: true,
    add_parts: false,
    edit_parts: false,
    delete_parts: false,

    // Appointment management
    view_appointments: true,
    add_appointments: false,
    edit_appointments: false,
    delete_appointments: false,

    // User management
    view_users: false,
    add_users: false,
    edit_users: false,
    delete_users: false,

    // Settings
    view_settings: false,
    manage_permissions: false,
  });

  const handleTogglePermission = (permission: string) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission as keyof typeof prev],
    }));
  };

  const handleSave = () => {
    // In a real application, this would save to the backend
    console.log("Saving permissions for user:", user.id, permissions);
    onClose();
  };

  const getRoleDefaultPermissions = (role: string) => {
    switch (role) {
      case "admin":
        return {
          view_dashboard: true,
          view_statistics: true,
          view_clients: true,
          add_clients: true,
          edit_clients: true,
          delete_clients: true,
          view_vehicles: true,
          add_vehicles: true,
          edit_vehicles: true,
          delete_vehicles: true,
          view_repairs: true,
          add_repairs: true,
          edit_repairs: true,
          delete_repairs: true,
          view_invoices: true,
          add_invoices: true,
          edit_invoices: true,
          delete_invoices: true,
          view_stock: true,
          add_parts: true,
          edit_parts: true,
          delete_parts: true,
          view_appointments: true,
          add_appointments: true,
          edit_appointments: true,
          delete_appointments: true,
          view_users: true,
          add_users: true,
          edit_users: true,
          delete_users: true,
          view_settings: true,
          manage_permissions: true,
        };
      case "manager":
        return {
          view_dashboard: true,
          view_statistics: true,
          view_clients: true,
          add_clients: true,
          edit_clients: true,
          delete_clients: false,
          view_vehicles: true,
          add_vehicles: true,
          edit_vehicles: true,
          delete_vehicles: false,
          view_repairs: true,
          add_repairs: true,
          edit_repairs: true,
          delete_repairs: false,
          view_invoices: true,
          add_invoices: true,
          edit_invoices: true,
          delete_invoices: false,
          view_stock: true,
          add_parts: true,
          edit_parts: true,
          delete_parts: false,
          view_appointments: true,
          add_appointments: true,
          edit_appointments: true,
          delete_appointments: false,
          view_users: true,
          add_users: false,
          edit_users: false,
          delete_users: false,
          view_settings: true,
          manage_permissions: false,
        };
      case "mechanic":
        return {
          view_dashboard: true,
          view_statistics: false,
          view_clients: true,
          add_clients: false,
          edit_clients: false,
          delete_clients: false,
          view_vehicles: true,
          add_vehicles: false,
          edit_vehicles: false,
          delete_vehicles: false,
          view_repairs: true,
          add_repairs: true,
          edit_repairs: true,
          delete_repairs: false,
          view_invoices: false,
          add_invoices: false,
          edit_invoices: false,
          delete_invoices: false,
          view_stock: true,
          add_parts: false,
          edit_parts: false,
          delete_parts: false,
          view_appointments: true,
          add_appointments: false,
          edit_appointments: false,
          delete_appointments: false,
          view_users: false,
          add_users: false,
          edit_users: false,
          delete_users: false,
          view_settings: false,
          manage_permissions: false,
        };
      case "receptionist":
        return {
          view_dashboard: true,
          view_statistics: false,
          view_clients: true,
          add_clients: true,
          edit_clients: true,
          delete_clients: false,
          view_vehicles: true,
          add_vehicles: false,
          edit_vehicles: false,
          delete_vehicles: false,
          view_repairs: true,
          add_repairs: false,
          edit_repairs: false,
          delete_repairs: false,
          view_invoices: true,
          add_invoices: false,
          edit_invoices: false,
          delete_invoices: false,
          view_stock: true,
          add_parts: false,
          edit_parts: false,
          delete_parts: false,
          view_appointments: true,
          add_appointments: true,
          edit_appointments: true,
          delete_appointments: false,
          view_users: false,
          add_users: false,
          edit_users: false,
          delete_users: false,
          view_settings: false,
          manage_permissions: false,
        };
      default:
        return permissions;
    }
  };

  const applyRoleDefaults = () => {
    setPermissions(getRoleDefaultPermissions(user.role));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-purple-50">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mr-4">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Permissions</h2>
              <p className="text-sm text-slate-600">
                {user.first_name} {user.last_name} ({user.role})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={applyRoleDefaults}
              className="btn btn-ghost text-sm"
            >
              Appliquer par défaut
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
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 200px)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dashboard */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2 text-slate-600" />
                Dashboard
              </h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.view_dashboard}
                    onChange={() => handleTogglePermission("view_dashboard")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Voir dashboard
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.view_statistics}
                    onChange={() => handleTogglePermission("view_statistics")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Voir statistiques
                  </span>
                </label>
              </div>
            </div>

            {/* Clients */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2 text-slate-600" />
                Clients
              </h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.view_clients}
                    onChange={() => handleTogglePermission("view_clients")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Voir clients
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.add_clients}
                    onChange={() => handleTogglePermission("add_clients")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Ajouter clients
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.edit_clients}
                    onChange={() => handleTogglePermission("edit_clients")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Modifier clients
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.delete_clients}
                    onChange={() => handleTogglePermission("delete_clients")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Supprimer clients
                  </span>
                </label>
              </div>
            </div>

            {/* Vehicles */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center">
                <Car className="h-4 w-4 mr-2 text-slate-600" />
                Véhicules
              </h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.view_vehicles}
                    onChange={() => handleTogglePermission("view_vehicles")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Voir véhicules
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.add_vehicles}
                    onChange={() => handleTogglePermission("add_vehicles")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Ajouter véhicules
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.edit_vehicles}
                    onChange={() => handleTogglePermission("edit_vehicles")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Modifier véhicules
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.delete_vehicles}
                    onChange={() => handleTogglePermission("delete_vehicles")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Supprimer véhicules
                  </span>
                </label>
              </div>
            </div>

            {/* Repairs */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center">
                <Wrench className="h-4 w-4 mr-2 text-slate-600" />
                Réparations
              </h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.view_repairs}
                    onChange={() => handleTogglePermission("view_repairs")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Voir réparations
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.add_repairs}
                    onChange={() => handleTogglePermission("add_repairs")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Ajouter réparations
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.edit_repairs}
                    onChange={() => handleTogglePermission("edit_repairs")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Modifier réparations
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.delete_repairs}
                    onChange={() => handleTogglePermission("delete_repairs")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Supprimer réparations
                  </span>
                </label>
              </div>
            </div>

            {/* Invoices */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-slate-600" />
                Factures
              </h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.view_invoices}
                    onChange={() => handleTogglePermission("view_invoices")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Voir factures
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.add_invoices}
                    onChange={() => handleTogglePermission("add_invoices")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Ajouter factures
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.edit_invoices}
                    onChange={() => handleTogglePermission("edit_invoices")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Modifier factures
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.delete_invoices}
                    onChange={() => handleTogglePermission("delete_invoices")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Supprimer factures
                  </span>
                </label>
              </div>
            </div>

            {/* Stock */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2 text-slate-600" />
                Stock
              </h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.view_stock}
                    onChange={() => handleTogglePermission("view_stock")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Voir stock
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.add_parts}
                    onChange={() => handleTogglePermission("add_parts")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Ajouter pièces
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.edit_parts}
                    onChange={() => handleTogglePermission("edit_parts")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Modifier pièces
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.delete_parts}
                    onChange={() => handleTogglePermission("delete_parts")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Supprimer pièces
                  </span>
                </label>
              </div>
            </div>

            {/* Appointments */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-slate-600" />
                Rendez-vous
              </h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.view_appointments}
                    onChange={() => handleTogglePermission("view_appointments")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Voir rendez-vous
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.add_appointments}
                    onChange={() => handleTogglePermission("add_appointments")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Ajouter rendez-vous
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.edit_appointments}
                    onChange={() => handleTogglePermission("edit_appointments")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Modifier rendez-vous
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.delete_appointments}
                    onChange={() =>
                      handleTogglePermission("delete_appointments")
                    }
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Supprimer rendez-vous
                  </span>
                </label>
              </div>
            </div>

            {/* Users */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2 text-slate-600" />
                Utilisateurs
              </h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.view_users}
                    onChange={() => handleTogglePermission("view_users")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Voir utilisateurs
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.add_users}
                    onChange={() => handleTogglePermission("add_users")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Ajouter utilisateurs
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.edit_users}
                    onChange={() => handleTogglePermission("edit_users")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Modifier utilisateurs
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.delete_users}
                    onChange={() => handleTogglePermission("delete_users")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Supprimer utilisateurs
                  </span>
                </label>
              </div>
            </div>

            {/* Settings */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2 text-slate-600" />
                Paramètres
              </h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.view_settings}
                    onChange={() => handleTogglePermission("view_settings")}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Voir paramètres
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.manage_permissions}
                    onChange={() =>
                      handleTogglePermission("manage_permissions")
                    }
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-slate-700">
                    Gérer permissions
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-slate-100">
          <button onClick={onClose} className="btn btn-ghost">
            Annuler
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            <Check className="h-4 w-4 mr-2" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
