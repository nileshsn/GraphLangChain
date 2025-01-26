// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import PromptGenerator from './components/PromptGenerator';
import DailyChallenge from './components/DailyChallenge';
import Bookmarks from './components/Bookmarks';
import Login from './components/Login';
import Register from './components/Register';
import { AuthContext } from './context/AuthContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and set authentication state
      fetch('/auth', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user_id) {
          setIsAuthenticated(true);
          setUser(data.user_id);
        }
      })
      .catch(error => {
        console.error('Authentication error:', error);
      });
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, handleLogin, handleLogout }}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={isAuthenticated ? <PromptGenerator /> : <Login />} />
            <Route path="/daily-challenge" element={isAuthenticated ? <DailyChallenge /> : <Login />} />
            <Route path="/bookmarks" element={isAuthenticated ? <Bookmarks /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;