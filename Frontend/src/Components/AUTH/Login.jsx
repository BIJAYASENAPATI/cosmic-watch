import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle login submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // ✅ Store JWT token
            localStorage.setItem("token", data.token);

            // ✅ Redirect to dashboard
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>🌌 Welcome Back Explorer</h2>
                <p className="subtitle">
                    Login to monitor Near-Earth Objects
                </p>

                {error && <p className="error-text">{error}</p>}

                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>

                <button
                    type="submit"
                    className="link-button"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="switch-link">
                    New to Cosmic Watch? <Link to="/signup">Signup</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
