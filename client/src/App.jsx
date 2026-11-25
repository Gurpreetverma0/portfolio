import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import BlogDetailPage from './pages/BlogDetailPage';

import AdminLogin from './admin/pages/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import {
  AdminProjects,
  AdminAchievements,
  AdminCertificates,
  AdminGallery,
  AdminSkills,
  AdminExperience,
  AdminEducation,
  AdminServices,
  AdminTestimonials,
  AdminBlogs,
} from './admin/pages/ModuleManagers';
import AdminMessages from './admin/pages/AdminMessages';
import AdminProfile from './admin/pages/AdminProfile';
import AdminSettings from './admin/pages/AdminSettings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#161622',
                  color: '#f4f4f5',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '13px',
                },
              }}
            />
            <Routes>
              {/* Public Portfolio Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Dashboard Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="achievements" element={<AdminAchievements />} />
                <Route path="certificates" element={<AdminCertificates />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="experience" element={<AdminExperience />} />
                <Route path="education" element={<AdminEducation />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
