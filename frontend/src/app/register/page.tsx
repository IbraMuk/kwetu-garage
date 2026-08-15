"use client";

import api from "@/lib/api";
import {
    ArrowLeft,
    Car,
    CheckCircle,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Shield,
    User,
    Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
      });
      toast.success(
        "Compte créé avec succès! Vous pouvez maintenant vous connecter.",
      );
      router.push("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Erreur lors de la création du compte",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-blue-500/10"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-12 relative z-10">
            <div className="mb-12">
              <img
                src="/logo.png"
                alt="Kwetu Garage"
                className="w-32 h-32 rounded-3xl mb-8 shadow-2xl object-contain"
              />
              <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                Rejoignez-nous
              </h1>
              <p className="text-2xl text-gray-300 font-light">
                Créez votre compte Kwetu Garage en quelques minutes
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-8">
                <div className="flex items-center text-gray-400">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-sm">Sans engagement</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Shield className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-sm">Sécurisé</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Car className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-sm">Gestion complète</span>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-8 pt-4">
                <div className="text-center">
                  <Lock className="h-10 w-10 text-blue-400/80 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Données cryptées</p>
                </div>
                <div className="text-center">
                  <Wrench className="h-10 w-10 text-blue-400/80 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Support technique</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(251, 146, 60, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 146, 60, 0.3) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative z-10">
        <div className="max-w-md w-full">
          <div className="mb-6">
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Retour à la connexion
            </button>
          </div>

          <div className="text-center mb-10">
            <img
              src="/logo.png"
              alt="Kwetu Garage"
              className="w-20 h-20 rounded-2xl mb-6 lg:hidden shadow-2xl object-contain"
            />
            <h2 className="text-4xl font-bold text-white mb-3">
              Créer un compte
            </h2>
            <p className="text-gray-400 text-lg">
              Rejoignez Kwetu Garage pour gérer votre garage
            </p>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-blue-400/20 rounded-3xl"></div>

            <form
              className="space-y-6 relative z-10"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Prénom
                  </label>
                  <input
                    {...register("first_name", {
                      required: "Le prénom est requis",
                    })}
                    type="text"
                    autoComplete="given-name"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="Jean"
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Nom
                  </label>
                  <input
                    {...register("last_name", {
                      required: "Le nom est requis",
                    })}
                    type="text"
                    autoComplete="family-name"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="Dupont"
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Adresse email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    {...register("email", {
                      required: "L'email est requis",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Email invalide",
                      },
                    })}
                    type="email"
                    autoComplete="email"
                    className="w-full px-4 py-3 pl-12 bg-gray-900/50 border border-gray-600/50 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="jean.dupont@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    {...register("password", {
                      required: "Le mot de passe est requis",
                      minLength: { value: 6, message: "Au moins 6 caractères" },
                    })}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 pl-12 pr-12 bg-gray-900/50 border border-gray-600/50 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Confirmer le mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    {...register("confirmPassword", {
                      required: "La confirmation est requise",
                      validate: (value) =>
                        value === password ||
                        "Les mots de passe ne correspondent pas",
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 pl-12 pr-12 bg-gray-900/50 border border-gray-600/50 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/20 border-t-white"></div>
                ) : (
                  <span className="flex items-center">
                    <User className="h-6 w-6 mr-3" />
                    Créer mon compte
                  </span>
                )}
              </button>

              <div className="text-center pt-6 border-t border-gray-700/50">
                <span className="text-sm text-gray-400">
                  Déjà un compte?{" "}
                  <a
                    href="/login"
                    className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Se connecter
                  </a>
                </span>
              </div>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            En créant un compte, vous acceptez nos conditions d&apos;utilisation
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}


