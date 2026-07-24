import React, { useState } from "react";

const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:8080" : "";

const LoginScreen = ({ onLoginSuccess, onSwitchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token && data.user) {
          onLoginSuccess(data.token, data.user);
        } else {
          setError(data.message || "Invalid email or password.");
        }
      })
      .catch(() => {
        setError("Unable to connect to authentication server.");
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <h2 className="screen-heading" style={{ textAlign: "center", marginBottom: "24px" }}>
          Library System Login
        </h2>

        <form onSubmit={handleSubmit} style={{ background: "#ffffff", padding: "28px", borderRadius: "8px", border: "1px solid #e0e0e0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {error && (
            <div style={{ color: "#db2828", background: "#fff8f8", border: "1px solid #fbbd08", padding: "10px", borderRadius: "4px", marginBottom: "16px", fontSize: "0.88rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-accent" style={{ width: "100%", marginTop: "12px" }}>
            Login
          </button>

          <div style={{ marginTop: "16px", fontSize: "0.83rem", color: "#555", textAlign: "center", background: "#f8f9fa", padding: "10px", borderRadius: "4px" }}>
            <b>Seeded MongoDB Accounts:</b><br />
            Librarian: <code>librarian@library.com</code> / <code>password</code><br />
            Student: <code>student@library.com</code> / <code>password</code>
          </div>

          <div style={{ marginTop: "18px", textAlign: "center", fontSize: "0.88rem", color: "#666" }}>
            Don't have an account?{" "}
            <span style={{ color: "#2185d0", cursor: "pointer", fontWeight: "bold" }} onClick={onSwitchToSignUp}>
              Sign Up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
