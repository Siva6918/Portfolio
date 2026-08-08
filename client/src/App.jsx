import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PortfolioBackground from './components/layout/PortfolioBackground';
import AdminBackground from './components/layout/AdminBackground';

import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AdminSpacePage from './pages/AdminSpacePage';
import NotFoundPage from './pages/NotFoundPage';

// Dynamic background selector component
const DynamicBackground = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return isAdmin ? <AdminBackground /> : <PortfolioBackground />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="relative min-h-screen flex flex-col bg-[#09090b] text-[#fafafa] font-sans transition-colors duration-300">
            {/* Dynamic Background: Portfolio vs My Space */}
            <DynamicBackground />

            {/* Navigation Header */}
            <Navbar />

            {/* Main Application Body */}
            <main className="flex-grow z-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                <Route path="/admin" element={<AdminSpacePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
