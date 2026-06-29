"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
    Car,
    CheckCircle,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Settings,
    Shield,
    Wrench,
    Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur de connexion");
      }

      const { user, token } = result;
      login(user, token);
      toast.success("Connexion réussie!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/10 to-slate-900 flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-40 left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-blue-300/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute -bottom-40 right-40 w-80 h-80 bg-gradient-to-br from-violet-600/20 to-violet-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      {/* Particules animées */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Côté gauche - Image/illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-blue-600/5"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white relative z-10 max-w-2xl mx-auto animate-slideInLeft">
            <div className="mb-12">
              <img src="/logo.png" alt="Kwetu Garage" className="w-40 h-40 rounded-3xl mb-8 shadow-2xl object-contain animate-glow" />
              <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent animate-fadeIn">
                Kwetu Garage
              </h1>
              <p className="text-3xl text-gray-300 font-light tracking-wide">
                La gestion de garage, réinventée
              </p>
            </div>

            <div className="space-y-12">
              <div className="flex items-center justify-center space-x-16">
                <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-110">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mb-4 group-hover:bg-blue-500/20 transition-all duration-300 border border-white/10">
                    <Car className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-200 text-lg">Véhicules</h3>
                  <p className="text-sm text-gray-400 mt-1">Gestion complète</p>
                </div>
                <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-110">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mb-4 group-hover:bg-blue-500/20 transition-all duration-300 border border-white/10">
                    <Wrench className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-200 text-lg">
                    Réparations
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Suivi en temps réel
                  </p>
                </div>
                <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-110">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mb-4 group-hover:bg-blue-500/20 transition-all duration-300 border border-white/10">
                    <Shield className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-200 text-lg">Sécurité</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Données protégées
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-12 pt-8">
                <div className="flex items-center text-gray-300 group">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 group-hover:bg-emerald-500/30 transition-colors">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Rapide</p>
                    <p className="text-xs text-gray-400">
                      Performance optimale
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-300 group">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3 group-hover:bg-yellow-500/30 transition-colors">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Efficace</p>
                    <p className="text-xs text-gray-400">Automatisation</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-300 group">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 group-hover:bg-blue-500/30 transition-colors">
                    <Settings className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Complet</p>
                    <p className="text-xs text-gray-400">Tout-en-un</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(251, 146, 60, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 146, 60, 0.4) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
              animation: "float 20s ease-in-out infinite",
            }}
          ></div>
        </div>
      </div>

      {/* Côté droit - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative z-10">
        <div className="max-w-md w-full">
          <div className="text-center mb-10 animate-slideUp">
            <img src="/logo.png" alt="Kwetu Garage" className="w-24 h-24 rounded-3xl mb-6 lg:hidden shadow-2xl object-contain animate-glow" />
            <h2 className="text-5xl font-black text-white mb-4">Bon retour!</h2>
            <p className="text-gray-300 text-xl font-light">
              Connectez-vous pour gérer votre garage
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden animate-scaleIn">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/10 rounded-3xl"></div>

            <form
              className="space-y-8 relative z-10"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-gray-200 mb-3"
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
                      className="appearance-none relative block w-full px-4 py-4 pl-12 bg-white/10 backdrop-blur border border-white/20 placeholder-gray-400 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 sm:text-sm transition-all group-hover:bg-white/15"
                      placeholder="admin@kwetugarage.com"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-focus-within:from-blue-500/10 group-focus-within:to-blue-500/5 transition-all pointer-events-none"></div>
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400 flex items-center animate-slideUp">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-gray-200 mb-3"
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
                      })}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="appearance-none relative block w-full px-4 py-4 pl-12 pr-12 bg-white/10 backdrop-blur border border-white/20 placeholder-gray-400 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 sm:text-sm transition-all group-hover:bg-white/15"
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
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-focus-within:from-blue-500/10 group-focus-within:to-blue-500/5 transition-all pointer-events-none"></div>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-400 flex items-center animate-slideUp">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-5 w-5 text-blue-500 focus:ring-blue-500/50 border-white/30 rounded bg-white/10"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-200"
                  >
                    Se souvenir
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Mot de passe oublié?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-black rounded-2xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-3 border-white/20 border-t-white"></div>
                      <span className="ml-3">Connexion en cours...</span>
                    </div>
                  ) : (
                    <span className="flex items-center">
                      <Wrench className="h-6 w-6 mr-3" />
                      Accéder au garage
                    </span>
                  )}
                </button>
              </div>

              <div className="text-center pt-8 border-t border-white/20">
                <span className="text-sm text-gray-300">
                  Nouveau sur Kwetu Garage?{" "}
                  <a
                    href="/register"
                    className="font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Demander un accès
                  </a>
                </span>
              </div>
            </form>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

