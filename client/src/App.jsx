import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ModeProvider } from './context/ModeContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { ProfileModalProvider } from './context/ProfileModalContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PortfolioBackground from './components/layout/PortfolioBackground';
import AdminBackground from './components/layout/AdminBackground';
import ScrollProgressBar from './components/common/ScrollProgressBar';
import ProfileModal from './components/common/ProfileModal';
import Preloader from './components/common/Preloader';
import PageLoader from './components/common/PageLoader';
import AdminPreloader from './components/common/AdminPreloader';

import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import WorkspaceResourcePage from './pages/WorkspaceResourcePage';
import AdminSpacePage from './pages/AdminSpacePage';
import NotFoundPage from './pages/NotFoundPage';

import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ExperiencePage from './pages/ExperiencePage';
import SkillsPage from './pages/SkillsPage';
import CertificationsPage from './pages/CertificationsPage';
import AchievementsPage from './pages/AchievementsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import ResumePage from './pages/ResumePage';
import NowPage from './pages/NowPage';
import PlaygroundPage from './pages/PlaygroundPage';
import { checkHealth } from './services/api';

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// Non-blocking backend wakeup ping
const ServerWakeup = () => {
  useEffect(() => {
    checkHealth().catch(() => {
      console.log('Backend is waking up...');
    });
  }, []);
  return null;
};

// Dynamic background selector
const DynamicBackground = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return isAdmin ? <AdminBackground /> : <PortfolioBackground />;
};

// Inner app — needs to be inside Router to use useLocation
function AppInner() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');
  const [showLoader, setShowLoader] = useState(true);

  // Show loader on every navigation
  useEffect(() => {
    setShowLoader(true);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 dark:bg-[#09090c] dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* Scroll progress bar */}
      <ScrollProgressBar />

      {/* Loaders: premium preloader for home, specific for admin, slim page loader for others */}
      {showLoader && isHome && <Preloader onDone={() => setShowLoader(false)} />}
      {showLoader && isAdmin && <AdminPreloader onDone={() => setShowLoader(false)} />}
      {showLoader && !isHome && !isAdmin && <PageLoader pathname={location.pathname} onDone={() => setShowLoader(false)} />}

      <ScrollToTop />
      <ServerWakeup />

      {/* Dynamic background */}
      <DynamicBackground />

      {/* Navbar (hidden on admin routes) */}
      {!isAdmin && <Navbar />}

      {/* Page content */}
      <main className="flex-grow z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<ProjectsPage />} />
          <Route path="/work/:slug" element={<ProjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/notes" element={<BlogPage />} />
          <Route path="/notes/:slug" element={<BlogPostPage />} />
          <Route path="/now" element={<NowPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/admin" element={<AdminSpacePage />} />
          <Route path="/workspace" element={<WorkspaceResourcePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer (hidden on admin routes) */}
      {!isAdmin && <Footer />}

      {/* Profile popup modal */}
      <ProfileModal />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ModeProvider>
          <AnalyticsProvider>
            <ProfileModalProvider>
              <Router>
                <AppInner />
              </Router>
            </ProfileModalProvider>
          </AnalyticsProvider>
        </ModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
