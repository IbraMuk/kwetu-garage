"use client";

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Users, Shield, Settings, UserPlus, Key, Lock, Unlock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import api from '@/lib/api'
import { User } from '@/types'
import UserForm from '@/components/UserForm'
import PermissionForm from '@/components/PermissionForm'

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('users')
  const [showUserForm, setShowUserForm] = useState(false)
  const [showPermissionForm, setShowPermissionForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredUsers(filtered)
  }

  const handleAddUser = () => {
    setEditingUser(null)
    setShowUserForm(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowUserForm(true)
  }

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.username}" ?`)) {
      try {
        await api.delete(`/users/${user.id}`)
        setUsers(users.filter(u => u.id !== user.id))
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Erreur lors de la suppression de l\'utilisateur')
      }
    }
  }

  const handleUserFormSubmit = async (userData: Partial<User>) => {
    try {
      if (editingUser) {
        const response = await api.put(`/users/${editingUser.id}`, userData)
        setUsers(users.map(u => u.id === editingUser.id ? response.data : u))
      } else {
        const response = await api.post('/users', userData)
        setUsers([...users, response.data])
      }
      setShowUserForm(false)
      setEditingUser(null)
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Erreur lors de la sauvegarde de l\'utilisateur')
    }
  }

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user)
    setShowPermissionForm(true)
  }

  const handleToggleUserStatus = async (user: User) => {
    try {
      const newStatus = !user.is_active
      const response = await api.put(`/users/${user.id}`, { is_active: newStatus })
      setUsers(users.map(u => u.id === user.id ? response.data : u))
    } catch (error) {
      console.error('Error toggling user status:', error)
      alert('Erreur lors de la modification du statut')
    }
  }

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'manager':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'mechanic':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'receptionist':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      default:
        return 'bg-white/5 text-gray-300 border-white/10'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur'
      case 'manager':
        return 'Manager'
      case 'mechanic':
        return 'Mécanicien'
      case 'receptionist':
        return 'Réceptionniste'
      default:
        return role
    }
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
            Chargement des paramètres...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">


      {/* Tabs */}
      <div className="mb-8">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'users'
                ? 'bg-white text-white shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            Utilisateurs
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'permissions'
                ? 'bg-white text-white shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Shield className="h-4 w-4" />
            Permissions
          </button>
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          {/* Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                className="input pl-12 pr-4 py-3"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleAddUser}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nouvel utilisateur
            </button>
          </div>

          {/* Users List */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-slate-400" />
              </div>
              <p className="text-gray-300 font-black text-lg mb-2">
                {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur'}
              </p>
              <p className="text-sm text-gray-400 font-medium mb-4">
                {searchTerm 
                  ? 'Essayez de modifier votre recherche' 
                  : 'Créez votre premier utilisateur pour commencer'
                }
              </p>
              {!searchTerm && (
                <button className="btn btn-primary" onClick={handleAddUser}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nouvel utilisateur
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
                        Utilisateur
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-300 uppercase tracking-wider">
                        Rôle
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
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className="hover:bg-white/10/50 transition-all duration-200 group animate-slideUp"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-sm font-black text-white">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-xs text-gray-400">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-300">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1.5 text-xs font-black rounded-full border ${getRoleBadgeStyle(user.role)}`}>
                            {getRoleText(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1.5 text-xs font-black rounded-full border ${
                            user.is_active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {user.is_active ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1.5" />
                                Actif
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1.5" />
                                Inactif
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleToggleUserStatus(user)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                              title={user.is_active ? 'Désactiver' : 'Activer'}
                            >
                              {user.is_active ? (
                                <Lock className="h-4 w-4 group-hover:scale-110 transition-transform" />
                              ) : (
                                <Unlock className="h-4 w-4 group-hover:scale-110 transition-transform" />
                              )}
                            </button>
                            <button
                              onClick={() => handleManagePermissions(user)}
                              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 group"
                              title="Permissions"
                            >
                              <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
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
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-gray-300 font-black text-lg mb-2">
            Gestion des permissions
          </p>
          <p className="text-sm text-gray-400 font-medium mb-4">
            Gérez les permissions des utilisateurs via l'onglet Utilisateurs
          </p>
        </div>
      )}

      {/* User Form Modal */}
      {showUserForm && (
        <UserForm
          user={editingUser}
          onSubmit={handleUserFormSubmit}
          onCancel={() => {
            setShowUserForm(false)
            setEditingUser(null)
          }}
        />
      )}

      {/* Permission Form Modal */}
      {showPermissionForm && selectedUser && (
        <PermissionForm
          user={selectedUser}
          onClose={() => {
            setShowPermissionForm(false)
            setSelectedUser(null)
          }}
        />
      )}
    </div>
  )
}
