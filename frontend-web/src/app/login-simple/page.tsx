export default function LoginSimple() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div className="card" style={{ width: "400px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Kwetu Garage - Connexion
        </h1>
        <form>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Email
            </label>
            <input
              type="email"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
              placeholder="admin@kwetugarage.com"
            />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
              placeholder="password123"
            />
          </div>
          <button type="submit" className="btn" style={{ width: "100%" }}>
            Se connecter
          </button>
        </form>
        <p
          style={{
            marginTop: "16px",
            textAlign: "center",
            fontSize: "14px",
            color: "#666",
          }}
        >
          Test: admin@kwetugarage.com / password123
        </p>
      </div>
    </div>
  );
}

