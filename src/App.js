// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import OrgCreate from "./pages/OrgCreate";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import { CssBaseline } from "@mui/material";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/signin" />;
  };

  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn setUser={setUser} />} />
          <Route path="/org-create" element={<OrgCreate />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard userRole={user?.role} />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
