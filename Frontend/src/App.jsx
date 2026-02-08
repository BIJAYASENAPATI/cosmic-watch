import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Components/LANDING/Landing";
import Login from "./Components/AUTH/Login";
import Signup from "./Components/AUTH/Signup";
import Dashboard from "./Components/DASHBOARD/Dashboard";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;