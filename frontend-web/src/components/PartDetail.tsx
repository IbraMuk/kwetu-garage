"use client";

import { X, Edit, Package, Hash, DollarSign, FileText, Box, AlertTriangle, CheckCircle } from 'lucide-react'
import { Part } from '@/types'

interface PartDetailProps {
  part: Part
  onClose: () => void
  onEdit: () => void
}

export default function PartDetail({ part, onClose, onEdit }: PartDetailProps) {
  const getStockLevelStyle = () => {
    if (part.stock_quantity <= part.min_stock_level) {
      return 'bg-red-50 text-red-700 border-red-200'
    } else if (part.stock_quantity <= part.min_stock_level * 2) {
      return 'bg-amber-50 text-amber-700 border-amber-200'
    }
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }

  const getStockLevelText = () => {
    if (part.stock_quantity <= part.min_stock_level) {
      return 'Stock bas'
    } else if (part.stock_quantity <= part.min_stock_level * 2) {
      return 'Stock limité'
    }
    return 'En stock'
  }

  const getStockLevelIcon = () => {
    if (part.stock_quantity <= part.min_stock_level) {
      return <AlertTriangle className="h-5 w-5" />
    } else if (part.stock_quantity <= part.min_stock_level * 2) {
      return <AlertTriangle className="h-5 w-5" />
    }
    return <CheckCircle className="h-5 w-5" />
  }

  const isLowStock = part.stock_quantity <= part.min_stock_level
  const stockDifference = part.stock_quantity - part.min_stock_level

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-purple-50">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mr-4">
              <Package className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {part.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex px-3 py-1 text-xs font-black rounded-full border ${getStockLevelStyle()}`}>
                  {getStockLevelIcon()}
                  <span className="ml-1.5">{getStockLevelText()}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
          <div className="space-y-6">
            {/* Part Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reference */}
              {part.reference && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center">
                    <Hash className="h-5 w-5 text-slate-600 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Référence</p>
                      <p className="text-lg font-black text-slate-900 font-mono">
                        {part.reference}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center">
                  <DollarSign className="h-6 w-6 text-emerald-600 mr-3" />
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">Prix unitaire</p>
                    <p className="text-lg font-black text-emerald-900">
                      {part.price.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} $
                    </p>
                  </div>
                </div>
              </div>

              {/* Stock Quantity */}
              <div className={`p-4 rounded-xl border ${
                isLowStock
                  ? 'bg-red-50 border-red-200'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center">
                  <Box className={`h-6 w-6 mr-3 ${
                    isLowStock ? 'text-red-600' : 'text-slate-600'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      isLowStock ? 'text-red-600' : 'text-slate-600'
                    }`}>Quantité en stock</p>
                    <p className="text-lg font-black text-slate-900">
                      {part.stock_quantity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Min Stock Level */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center">
                  <Box className="h-5 w-5 text-slate-600 mr-3" />
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Stock minimum</p>
                    <p className="text-base font-black text-slate-900">
                      {part.min_stock_level}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Status Card */}
            <div className={`p-4 rounded-xl border ${
              isLowStock
                ? 'bg-red-50 border-red-200'
                : part.stock_quantity <= part.min_stock_level * 2
                ? 'bg-amber-50 border-amber-200'
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStockLevelIcon()}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-700">Statut du stock</p>
                    <p className="text-lg font-black text-slate-900">
                      {getStockLevelText()}
                    </p>
                  </div>
                </div>
                {isLowStock && (
                  <div className="text-right">
                    <p className="text-sm text-red-600 font-medium">Manquant</p>
                    <p className="text-lg font-black text-red-900">
                      {Math.abs(stockDifference)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {part.description && (
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-3">Description</h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-700">{part.description}</p>
                </div>
              </div>
            )}

            {/* Created/Updated */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Créée le {new Date(part.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
