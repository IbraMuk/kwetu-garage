"use client";

import { Repair, Vehicle } from "@/types";
import {
    Car,
    DollarSign,
    FileText,
    User,
    Wrench,
    X
} from "lucide-react";
import { useEffect, useState } from "react";

interface RepairFormProps {
  repair?: Repair | null;
  onSubmit: (repairData: Partial<Repair>) => Promise<void>;
  onCancel: () => void;
}

export default function RepairForm({
  repair,
  onSubmit,
  onCancel,
}: RepairFormProps) {
  const [formData, setFormData] = useState({
    vehicle_id: "",
    mechanic_id: "",
    description: "",
    status: "pending" as "pending" | "in_progress" | "completed" | "cancelled",
    total_cost: 0,
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
    fetchMechanics();
    if (repair) {
      setFormData({
        vehicle_id: repair.vehicle_id,
        mechanic_id: repair.mechanic_id || "",
        description: repair.description,
        status: repair.status,
        total_cost: repair.total_cost,
        notes: repair.notes || "",
      });
    }
  }, [repair]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles");
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMechanics = async () => {
    try {
      // Mock mechanics data
      const mockMechanics = [
        { id: "mech1", name: "Jean Dupont" },
        { id: "mech2", name: "Marie Martin" },
        { id: "mech3", name: "Pierre Bernard" },
        { id: "mech4", name: "Sophie Petit" },
      ];
      setMechanics(mockMechanics);
    } catch (error) {
      console.error("Error fetching mechanics:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehicle_id) {
      newErrors.vehicle_id = "Le véhicule est obligatoire";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est obligatoire";
    }

    if (formData.total_cost < 0) {
      newErrors.total_cost = "Le coût ne peut pas être négatif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user modifies the field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-2xl font-black text-slate-900">
            {repair ? "Modifier la réparation" : "Nouvelle réparation"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Véhicule */}
            <div className="md:col-span-2">
              <label className="form-label">
                Véhicule <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  className={`input pl-12 ${errors.vehicle_id ? "border-red-300 focus:border-red-500" : ""}`}
                  value={formData.vehicle_id}
                  onChange={(e) =>
                    handleInputChange("vehicle_id", e.target.value)
                  }
                  disabled={isSubmitting || loading}
                >
                  <option value="">Sélectionner un véhicule</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} ({vehicle.year}) -{" "}
                      {vehicle.license_plate}
                    </option>
                  ))}
                </select>
              </div>
              {errors.vehicle_id && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicle_id}</p>
              )}
            </div>

            {/* Mécanicien */}
            <div>
              <label className="form-label">Mécanicien</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  className="input pl-12"
                  value={formData.mechanic_id}
                  onChange={(e) =>
                    handleInputChange("mechanic_id", e.target.value)
                  }
                  disabled={isSubmitting}
                >
                  <option value="">Non assigné</option>
                  {mechanics.map((mechanic) => (
                    <option key={mechanic.id} value={mechanic.id}>
                      {mechanic.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className="form-label">Statut</label>
              <div className="relative">
                <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  className="input pl-12"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="pending">En attente</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="form-label">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <textarea
                  className={`input pl-12 min-h-[100px] resize-none ${errors.description ? "border-red-300 focus:border-red-500" : ""}`}
                  placeholder="Description de la réparation..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Coût total */}
            <div>
              <label className="form-label">
                Coût total (€) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  className={`input pl-12 ${errors.total_cost ? "border-red-300 focus:border-red-500" : ""}`}
                  placeholder="0.00"
                  value={formData.total_cost}
                  onChange={(e) =>
                    handleInputChange("total_cost", parseFloat(e.target.value))
                  }
                  disabled={isSubmitting}
                  min={0}
                  step={0.01}
                />
              </div>
              {errors.total_cost && (
                <p className="mt-1 text-sm text-red-600">{errors.total_cost}</p>
              )}
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="form-label">Notes</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <textarea
                  className="input pl-12 min-h-[80px] resize-none"
                  placeholder="Notes supplémentaires sur la réparation..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {repair ? "Modification..." : "Création..."}
                </>
              ) : (
                <>{repair ? "Modifier" : "Créer"} la réparation</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
