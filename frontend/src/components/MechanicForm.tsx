"use client";

import { useState, useEffect } from 'react'
import { X, User, Mail, Phone, Wrench, DollarSign, Calendar, Lock } from 'lucide-react'
import { Mechanic } from '@/types'

interface MechanicFormProps {
  mechanic?: Mechanic | null
  onSubmit: (data: Partial<Mechanic> & { password?: string }) => Promise<void>
  onCancel: () => void
}

export default function MechanicForm({ mechanic, onSubmit, onCancel }: MechanicFormProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    speciality: '',
    hourly_rate: '',
    hire_date: '',
    is_available: true,
    is_active: true,
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (mechanic) {
      setFormData({
        first_name: mechanic.first_name || '',
        last_name: mechanic.last_name || '',
        email: mechanic.email || '',
        phone: mechanic.phone || '',
        speciality: mechanic.speciality || '',
        hourly_rate: mechanic.hourly_rate ? String(mechanic.hourly_rate) : '',
        hire_date: mechanic.hire_date ? mechanic.hire_date.split('T')[0] : '',
        is_available: mechanic.is_available ?? true,
        is_active: mechanic.is_active ?? true,
        password: '',
      })
    }
  }, [mechanic])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est obligatoire'
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est obligatoire'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }
    if (!mechanic && formData.password && formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit faire au moins 6 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const data: Partial<Mechanic> & { password?: string } = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        speciality: formData.speciality.trim() || undefined,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
        hire_date: formData.hire_date || undefined,
        is_available: formData.is_available,
        is_active: formData.is_active,
      }
      if (!mechanic && formData.password) {
        data.password = formData.password
      }
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-black text-white">
            {mechanic ? 'Modifier le mécanicien' : 'Nouveau mécanicien'}
          </h2>
          <button onClick={onCancel} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Prénom *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  className={`${inputClass} pl-10`}
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Jean"
                />
              </div>
              {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Nom *</label>
              <input
                type="text"
                className={inputClass}
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Dupont"
              />
              {errors.last_name && <p className="text-red-400 text-xs mt-1">{errors.last_name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="email"
                className={`${inputClass} pl-10`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jean@kwetugarage.com"
                disabled={!!mechanic}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Téléphone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="tel"
                className={`${inputClass} pl-10`}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+243 000 000 000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Spécialité</label>
            <div className="relative">
              <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                className={`${inputClass} pl-10`}
                value={formData.speciality}
                onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                placeholder="Mécanique moteur, Électricité auto..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Taux horaire (FCFA)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="number"
                  className={`${inputClass} pl-10`}
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                  placeholder="5000"
                  min="0"
                  step="500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Date d'embauche</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  className={`${inputClass} pl-10`}
                  value={formData.hire_date}
                  onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          {!mechanic && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Mot de passe temporaire
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  className={`${inputClass} pl-10`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Laisser vide pour: mechanic123"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
          )}

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-white/20 rounded"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              />
              <span className="text-sm text-gray-300">Disponible</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-white/20 rounded"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span className="text-sm text-gray-300">Compte actif</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onCancel} className="btn btn-ghost">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Enregistrement...' : mechanic ? 'Mettre à jour' : 'Créer le mécanicien'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
