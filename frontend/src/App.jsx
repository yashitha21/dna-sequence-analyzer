import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import VisualizationPage from './pages/VisualizationPage.jsx';
import MutationPage from './pages/MutationPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import AuthPage from './pages/AuthPage.jsx';

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('genetrace_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [history, setHistory] = useState([]);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleLogin = (u, token) => {
    setUser(u);
    localStorage.setItem('genetrace_user', JSON.stringify(u));
    if (token) localStorage.setItem('genetrace_token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('genetrace_user');
    localStorage.removeItem('genetrace_token');
  };

  const addHistory = entry => setHistory(prev => [...prev, entry]);

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage addHistory={addHistory} />} />
          <Route path="/visualize" element={<VisualizationPage />} />
          <Route path="/mutation" element={<MutationPage />} />
          <Route path="/analytics" element={<AnalyticsPage history={history} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
