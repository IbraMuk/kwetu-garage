"use client";

import {
    Bell,
    Calendar,
    Car,
    FileText,
    Search,
    Settings,
    TrendingUp,
    Users,
} from "lucide-react";
import "../styles.css";

export default function DashboardPro() {
  return (
    <div className="dashboard" style={{ display: "flex" }}>
      {/* Sidebar */}
      <div className="sidebar">
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="/logo.png" alt="Kwetu Garage" style={{ width: 32, height: 32, marginRight: "0.75rem", objectFit: "contain" }} />
            <span style={{ fontSize: "1.25rem", fontWeight: "700" }}>
              Kwetu Garage
            </span>
          </div>
        </div>

        <nav style={{ padding: "1rem" }}>
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.75rem 1rem",
              color: "#2563eb",
              background: "#eff6ff",
              borderRadius: "0.5rem",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            <TrendingUp size={20} style={{ marginRight: "0.75rem" }} />
            Tableau de bord
          </a>
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.75rem 1rem",
              color: "#6b7280",
              borderRadius: "0.5rem",
              textDecoration: "none",
              marginTop: "0.5rem",
            }}
          >
            <FileText size={20} style={{ marginRight: "0.75rem" }} />
            Factures
          </a>
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.75rem 1rem",
              color: "#6b7280",
              borderRadius: "0.5rem",
              textDecoration: "none",
              marginTop: "0.5rem",
            }}
          >
            <Car size={20} style={{ marginRight: "0.75rem" }} />
            Véhicules
          </a>
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.75rem 1rem",
              color: "#6b7280",
              borderRadius: "0.5rem",
              textDecoration: "none",
              marginTop: "0.5rem",
            }}
          >
            <Settings size={20} style={{ marginRight: "0.75rem" }} />
            Réparations
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "0.5rem",
              }}
            >
              Tableau de bord
            </h1>
            <p style={{ color: "#6b7280" }}>
              Bienvenue dans votre espace de gestion
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <Search
                size={20}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="text"
                placeholder="Rechercher..."
                style={{
                  paddingLeft: "2.5rem",
                  padding: "0.5rem 1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  width: "250px",
                }}
              />
            </div>
            <button
              style={{
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                background: "white",
                cursor: "pointer",
              }}
            >
              <Bell size={20} />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div className="kpi-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p className="kpi-label">Revenu mensuel</p>
                <p className="kpi-value">€12,450</p>
                <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>
                  +12% vs mois dernier
                </p>
              </div>
              <TrendingUp size={40} style={{ opacity: 0.5 }} />
            </div>
          </div>

          <div
            className="kpi-card"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p className="kpi-label">Rendez-vous</p>
                <p className="kpi-value">28</p>
                <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>Ce mois</p>
              </div>
              <Calendar size={40} style={{ opacity: 0.5 }} />
            </div>
          </div>

          <div
            className="kpi-card"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p className="kpi-label">Clients</p>
                <p className="kpi-value">145</p>
                <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>Actifs</p>
              </div>
              <Users size={40} style={{ opacity: 0.5 }} />
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Activités récentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#dbeafe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "1rem",
                }}
              >
                <Car size={20} style={{ color: "#1d4ed8" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: "500" }}>Nouveau véhicule enregistré</p>
                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Peugeot 308 - Client: Jean Dupont
                </p>
              </div>
              <span style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                Il y a 2h
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#d1fae5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "1rem",
                }}
              >
                <FileText size={20} style={{ color: "#065f46" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: "500" }}>Facture créée</p>
                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  #INV-2024-001 - €450
                </p>
              </div>
              <span style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                Il y a 4h
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

