"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "../styles.css";

export default function LoginPro() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation de connexion
    setTimeout(() => {
      router.push("/dashboard-pro");
    }, 1000);
  };

  return (
    <div className="login-container">
      {/* Panneau de gauche */}
      <div className="left-panel">
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <img
              src="/logo.png"
              alt="Kwetu Garage"
              style={{
                width: 60,
                height: 60,
                marginRight: "1rem",
                objectFit: "contain",
              }}
            />
            <div className="brand">Kwetu Garage</div>
          </div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Solution Professionnelle de Gestion
          </h2>
          <p style={{ opacity: 0.9, lineHeight: "1.6" }}>
            La plateforme complète pour gérer votre garage efficacement
          </p>
        </div>
      </div>

      {/* Panneau de droite */}
      <div className="right-panel">
        <div className="form-container">
          <h1 className="form-title">Connexion</h1>
          <p className="form-subtitle">Accédez à votre espace de gestion</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <Mail
                  size={16}
                  style={{
                    display: "inline",
                    marginRight: "0.5rem",
                    verticalAlign: "middle",
                  }}
                />
                Email
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="admin@kwetugarage.com"
                defaultValue="admin@kwetugarage.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock
                  size={16}
                  style={{
                    display: "inline",
                    marginRight: "0.5rem",
                    verticalAlign: "middle",
                  }}
                />
                Mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  defaultValue="password123"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6b7280",
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              background: "#f8fafc",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            <strong>Accès démonstration :</strong>
            <br />
            Email: admin@kwetugarage.com
            <br />
            Mot de passe: password123
          </div>
        </div>
      </div>
    </div>
  );
}

