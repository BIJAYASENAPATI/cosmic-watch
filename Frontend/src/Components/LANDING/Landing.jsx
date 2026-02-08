import React from "react";
import "./Landing.css";

const Landing = () => {
    const features = [
        {
            icon: "🧑‍🚀",
            title: "Secure User Accounts",
            desc: "Create a verified account to personalize your experience. Save watched asteroids and manage your monitoring preferences securely.",
        },
        {
            icon: "☄️",
            title: "Live Asteroid Data Feed",
            desc: "Stay up to date with real-time data fetched directly from NASA’s NeoWs API. View velocity, size, and close-approach timelines.",
        },
        {
            icon: "⚠️",
            title: "Intelligent Risk Analysis",
            desc: "Asteroids are categorized based on PHO status, diameter, and miss distance. Each object is assigned a clear risk level.",
        },
        {
            icon: "🔔",
            title: "Automated Alerts",
            desc: "Never miss a critical event. Cosmic Watch notifies users of upcoming close approaches directly within your personalized dashboard.",
        },
        {
            icon: "📊",
            title: "Interactive Dashboard",
            desc: "Explore asteroid data through a clean, space-themed UI. Filter, search, and track objects of interest with ease.",
        },
        {
            icon: "🛰️",
            title: "Scalable Architecture",
            desc: "Built with a modern full-stack architecture and fully containerized using Docker ensuring fast setup and smooth deployment.",
        },
    ];

    return (
        <div className="cw-lp-container">
            <nav className="cw-lp-navbar">
                <div className="cw-lp-logo">COSMIC WATCH</div>
                <ul className="cw-lp-nav-links">
                    <li><a href="#features">Features</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/signup" className="cw-lp-signup-btn">Sign Up</a></li>
                </ul>
            </nav>

            <header className="cw-lp-hero">
                <div className="cw-lp-hero-content">
                    <div className="cw-lp-hero-icon" aria-hidden="true">🚀</div>
                    <h1 className="cw-lp-hero-title">
                        Explore Near-Earth <span className="highlight">Asteroids</span>
                    </h1>
                    <p className="cw-lp-hero-subtitle">
                        An interactive visualization platform for NASA's asteroid data. Track orbital paths and understand what's moving through our solar system.
                    </p>
                </div>
                <div className="cw-lp-hero-glow"></div>
            </header>

            <section id="features" className="cw-lp-section">
                <div className="cw-lp-section-header">
                    <h2 className="cw-lp-main-title">✨ Key Features</h2>
                    <p className="cw-lp-sub-title">Powerful tools to monitor near-Earth objects</p>
                </div>
                <div className="cw-lp-features-grid">
                    {features.map((f, i) => (
                        <div key={i} className="cw-lp-feature-card">
                            <div className="cw-lp-icon-box">{f.icon}</div>
                            <h3 className="cw-lp-feature-title">{f.title}</h3>
                            <p className="cw-lp-feature-desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="about" className="cw-lp-section">
                <h2 className="cw-lp-main-title">🌌 About Cosmic Watch</h2>
                <div className="cw-lp-about-content">
                    <p>Cosmic Watch is a real-time monitoring platform designed to make space data understandable and accessible for everyone.</p>
                    <p>Every day, thousands of asteroids pass close to Earth. We bridge the gap by transforming scientific datasets into clear insights and meaningful risk assessments.</p>
                    <p className="cw-lp-mission">Our mission: turn complex cosmic data into clarity and curiosity.</p>
                </div>
            </section>

            <footer className="cw-lp-footer">
                <div className="cw-lp-footer-grid">
                    <div className="cw-lp-footer-brand">
                        <div className="cw-lp-logo">COSMIC WATCH</div>
                        <p>Tracking the stars, protecting the planet.</p>
                    </div>
                    <div className="cw-lp-footer-links">
                        <h4>Platform</h4>
                        <a href="#features">Features</a>
                        <a href="#about">About</a>
                        <a href="/api-docs">API Docs</a>
                    </div>
                    <div className="cw-lp-footer-links">
                        <h4>Legal</h4>
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms of Service</a>
                    </div>
                </div>
                <div className="cw-lp-footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Cosmic Watch. Data powered by NASA NeoWs.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;