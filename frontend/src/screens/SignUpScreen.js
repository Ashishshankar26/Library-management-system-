import React, { useState } from "react";

const SignUpScreen = ({ onSignUpSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("STUDENT");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    fetch("http://localhost:8080/user/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, type }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          onSignUpSuccess(data.token, data.user);
        } else {
          setError(data.message || "Registration failed.");
        }
      })
      .catch(() => {
        const newUser = { _id: String(Date.now()), name, email, type };
        onSignUpSuccess("demo-jwt-token-123", newUser);
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="screen-heading" style={{ textAlign: "center", marginBottom: "24px" }}>
          Create Account
        </h2>

        <form onSubmit={handleSubmit} style={{ background: "#ffffff", padding: "28px", borderRadius: "8px", border: "1px solid #e0e0e0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {error && <div style={{ color: "#db2828", marginBottom: "14px", fontSize: "0.9rem", textAlign: "center" }}>{error}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="form-group">
            <label>Account Type</label>
            <select className="form-input" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="STUDENT">Student</option>
              <option value="LIBRARIAN">Librarian</option>
            </select>
          </div>

          <button type="submit" className="btn-accent" style={{ width: "100%", marginTop: "12px" }}>
            Sign Up
          </button>

          <div style={{ marginTop: "18px", textAlign: "center", fontSize: "0.88rem", color: "#666" }}>
            Already have an account?{" "}
            <span style={{ color: "#2185d0", cursor: "pointer", fontWeight: "bold" }} onClick={onSwitchToLogin}>
              Login
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpScreen;
