import React, { useState } from "react";

const LoginScreen = ({ onLoginSuccess, onSwitchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    fetch("http://localhost:8080/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token && data.user) {
          onLoginSuccess(data.token, data.user);
        } else {
          setError(data.message || "Invalid credentials.");
        }
      })
      .catch(() => {
        // Fallback for offline demo mode
        const demoUser = {
          _id: "demo-1",
          name: email.includes("librarian") ? "Librarian User" : "Student Member",
          email: email.trim(),
          type: email.includes("librarian") ? "LIBRARIAN" : "STUDENT",
        };
        onLoginSuccess("demo-jwt-token-123", demoUser);
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="screen-heading" style={{ textAlign: "center", marginBottom: "24px" }}>
          Library System Login
        </h2>

        <form onSubmit={handleSubmit} style={{ background: "#ffffff", padding: "28px", borderRadius: "8px", border: "1px solid #e0e0e0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {error && <div style={{ color: "#db2828", marginBottom: "14px", fontSize: "0.9rem", textAlign: "center" }}>{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter email..."
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
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-accent" style={{ width: "100%", marginTop: "12px" }}>
            Login
          </button>

          <div style={{ marginTop: "14px", fontSize: "0.85rem", color: "#666", textAlign: "center", background: "#f8f9fa", padding: "10px", borderRadius: "4px" }}>
            <b>Default Credentials:</b><br />
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
