import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
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

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/signup",
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
                throw new Error(data.message || "Signup failed");
            }

            // Signup success → redirect to login
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>🚀 Create Your Cosmic Account</h2>
                <p className="subtitle">
                    Track asteroids & stay alerted about close approaches
                </p>

                {error && <p className="error-text">{error}</p>}

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

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

                <button type="submit" className="link-button" disabled={loading} >
                    {loading ? "Creating account..." : "Signup"}
                </button>


                <p className="switch-link">
                    Already exploring space? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
