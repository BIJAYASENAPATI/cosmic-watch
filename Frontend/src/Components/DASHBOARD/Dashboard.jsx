import Chatbot from "../Chatbot/Chatbot";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();

    const [asteroids, setAsteroids] = useState([]);
    const [selectedAsteroid, setSelectedAsteroid] = useState(null);
    const [watchedList, setWatchedList] = useState([]);
    const [activeSection, setActiveSection] = useState("asteroidList");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notifications, setNotifications] = useState([]);

    const getAsteroidId = (asteroid) => asteroid.nasa_id || asteroid.id;

    // --- CHECK LOGIN ---
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/signup", { replace: true }); // redirect if not logged in
        }
    }, [navigate]);

    // --- LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signup", { replace: true }); // redirect to signup
    };

    // --- FETCH NOTIFICATIONS ---
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await fetch("http://localhost:3000/api/notifications", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch notifications");
                const result = await response.json();
                setNotifications((result.data || []).filter(n => n.message.includes("HIGH")));
            } catch (err) {
                console.error("Notification fetch error:", err);
            }
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/notifications/${id}/read`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                setNotifications(notifications.filter(n => n.id !== id));
            }
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    // --- FETCH ASTEROIDS ---
    useEffect(() => {
        const fetchAsteroids = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await fetch("http://localhost:3000/api/asteroids/feed", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch asteroid data");
                const result = await response.json();
                setAsteroids(result.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAsteroids();
    }, []);

    // --- FETCH WATCHLIST ---
    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await fetch("http://localhost:3000/api/watchlist", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch watchlist");
                const result = await response.json();
                setWatchedList(result.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchWatchlist();
    }, []);

    const handleAsteroidClick = (asteroid) => {
        setSelectedAsteroid(asteroid);
        setActiveSection("asteroidDetails");
    };

    const handleCloseDetails = () => {
        setSelectedAsteroid(null);
        setActiveSection("asteroidList");
    };

    const handleToggleWatchedList = async (asteroid) => {
        const asteroidId = getAsteroidId(asteroid);
        const token = localStorage.getItem("token");
        const exists = watchedList.some((a) => getAsteroidId(a) === asteroidId);

        try {
            if (exists) {
                await fetch(`http://localhost:3000/api/watchlist/${asteroidId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWatchedList(watchedList.filter((a) => getAsteroidId(a) !== asteroidId));
            } else {
                const response = await fetch("http://localhost:3000/api/watchlist", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        nasa_id: asteroid.nasa_id,
                        name: asteroid.name,
                        diameter: asteroid.diameter,
                        hazardous: asteroid.hazardous,
                        risk_level: asteroid.risk_level,
                    }),
                });
                if (!response.ok) throw new Error("Failed to add to watchlist");
                setWatchedList([...watchedList, asteroid]);
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const isAsteroidInWatchedList = (asteroid) => watchedList.some((a) => getAsteroidId(a) === getAsteroidId(asteroid));

    const getRiskClass = (level) => {
        if (!level) return "";
        const l = level.toLowerCase();
        if (l === "medium" || l === "mid") return "risk-medium";
        return `risk-${l}`;
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h3 className="sidebar-title">Cosmic Watch</h3>
                <ul>
                    <li className={activeSection === "asteroidList" ? "active" : ""} onClick={() => setActiveSection("asteroidList")}>Dashboard</li>
                    <li className={activeSection === "watchedList" ? "active" : ""} onClick={() => setActiveSection("watchedList")}>Watchlist</li>
                </ul>
            </div>

            <div className="main-content">
                {/* Top Bar */}
                <div className="dashboard-topbar">
                    <h2 className="dashboard-title">Dashboard</h2>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>

                {activeSection === "asteroidList" && (
                    <div className="dashboard-split-view">
                        <div className="left-panel">
                            <h2 className="section-title">Cosmic Insights</h2>
                            <div className="stat-card">
                                <h3>Operational Status</h3>
                                <p className="status-online">Scanning Deep Space...</p>
                                <div className="stat-row">
                                    <span>Total Near-Earth Objects</span>
                                    <strong>{asteroids.length}</strong>
                                </div>
                                <div className="stat-row">
                                    <span>Hazardous Threats</span>
                                    <strong className="risk-high">{asteroids.filter(a => a.hazardous).length}</strong>
                                </div>
                                <div className="stat-row">
                                    <span>In Watchlist</span>
                                    <strong>{watchedList.length}</strong>
                                </div>
                            </div>

                            <div className="stat-card notification-box">
                                <h3>System Alerts</h3>
                                <div className="notification-list">
                                    {notifications.length === 0 ? (
                                        <p className="no-notifications">No active alerts.</p>
                                    ) : (
                                        notifications.map(note => {
                                            const dateObj = new Date(note.createdAt);
                                            const isValidDate = !isNaN(dateObj.getTime());
                                            return (
                                                <div key={note.id} className="notification-item">
                                                    <div className="notification-content">
                                                        <p>
                                                            {note.message.split(/(HIGH)/g).map((part, i) =>
                                                                part === "HIGH" ? <span key={i} className="high-risk-text">{part}</span> : part
                                                            )}
                                                        </p>
                                                        {isValidDate && <small>{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>}
                                                    </div>
                                                    <button className="mark-read-btn" onClick={() => handleMarkAsRead(note.id)}>✕</button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="right-panel">
                            <h2 className="section-title">Live Feed</h2>
                            {loading && <p className="loading-text">Synchronizing...</p>}
                            {error && <p className="error-text">{error}</p>}
                            {!loading && !error && (
                                <div className="scrollable-asteroid-list-container">
                                    <div className="scrollable-asteroid-list">
                                        {asteroids.map(asteroid => (
                                            <div key={getAsteroidId(asteroid)} className="asteroid-card" onClick={() => handleAsteroidClick(asteroid)}>
                                                <h3>{asteroid.name}</h3>
                                                <p className="hazard-status">Hazardous: {asteroid.hazardous ? "YES" : "NO"}</p>
                                                <p className="asteroid-distance">Velocity: {asteroid.velocity_kmph} km/h</p>
                                                <p className="asteroid-distance">Risk: <strong className={getRiskClass(asteroid.risk_level)}>{asteroid.risk_level}</strong></p>
                                                <button className="add-to-watched-btn" onClick={e => { e.stopPropagation(); handleToggleWatchedList(asteroid); }}>
                                                    {isAsteroidInWatchedList(asteroid) ? "Remove" : "Add to watch-list"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === "asteroidDetails" && selectedAsteroid && (
                    <section className="asteroid-details">
                        <div className="details-card">
                            <div className="details-header">
                                <h2>{selectedAsteroid.name}</h2>
                                <div>
                                    <button className="close-details-btn" onClick={handleCloseDetails}>Back</button>
                                    <button className="add-to-watched-btn" onClick={() => handleToggleWatchedList(selectedAsteroid)}>
                                        {isAsteroidInWatchedList(selectedAsteroid) ? "Remove" : "Add to Watch"}
                                    </button>
                                </div>
                            </div>
                            <div className="details-list">
                                <div className="details-item"><strong>NASA ID</strong> {selectedAsteroid.nasa_id}</div>
                                <div className="details-item"><strong>Diameter</strong> {selectedAsteroid.diameter} km</div>
                                <div className="details-item"><strong>Risk Level</strong> <span className={getRiskClass(selectedAsteroid.risk_level)}>{selectedAsteroid.risk_level}</span></div>
                            </div>
                        </div>
                    </section>
                )}

                {activeSection === "watchedList" && (
                    <section className="watched-section">
                        <h2 className="section-title">Your Watchlist</h2>
                        <div className="scrollable-watched-list">
                            {watchedList.map(asteroid => (
                                <div key={getAsteroidId(asteroid)} className="watched-card" onClick={() => handleAsteroidClick(asteroid)}>
                                    <h3>{asteroid.name}</h3>
                                    <p className={`watched-status ${getRiskClass(asteroid.risk_level)}`}>Risk: {asteroid.risk_level}</p>
                                    <button className="remove-from-watched-btn" onClick={e => { e.stopPropagation(); handleToggleWatchedList(asteroid); }}>Remove</button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            {/* Chatbot component */}
            <Chatbot dashboardData={{ asteroids, watchedList, notifications }} />
        </div>
    );
};

export default Dashboard;
