"use client";

import api from "@/lib/api";
import { Vehicle } from "@/types";
import {
    Calendar,
    Car,
    Edit,
    Eye,
    Filter,
    Gauge,
    Plus,
    Search,
    Trash2,
    User
} from "lucide-react";
import { useEffect, useState } from "react";

export default function VehiclesList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear =
      selectedYear === "all" || vehicle.year.toString() === selectedYear;
    return matchesSearch && matchesYear;
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
            Chargement des véhicules...
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
            Véhicules
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            Liste de tous les véhicules enregistrés dans le système.
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
            Ajouter un véhicule
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white/80 backdrop-blur border border-slate-200 rounded-2xl animate-slideUp">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="form-label">Année</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="input"
              >
                <option value="all">Toutes les années</option>
                {[...Array(20)].map((_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
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
            placeholder="Rechercher un véhicule..."
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
                  Véhicule
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                  Kilométrage
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                  Date d&apos;ajout
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
                  className="hover:bg-slate-50/50 transition-all duration-200 group animate-slideUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <Car className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">
                          {vehicle.make} {vehicle.model}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {vehicle.year} · {vehicle.license_plate}
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
                        Client ID: {vehicle.client_id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-slate-600">
                      <Gauge className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="font-semibold">
                        {vehicle.mileage.toLocaleString("fr-FR")}
                      </span>
                      <span className="ml-1 text-xs text-slate-500">km</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                      {new Date(vehicle.created_at).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
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
        {filteredVehicles.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Car className="h-10 w-10 text-slate-400" />
            </div>
            <p className="text-slate-600 font-black text-lg mb-2">
              Aucun véhicule trouvé
            </p>
            <p className="text-sm text-slate-500 font-medium">
              Enregistrez votre premier véhicule pour commencer
            </p>
            <button className="btn btn-primary mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un véhicule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

