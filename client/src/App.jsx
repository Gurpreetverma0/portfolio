import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { PageLoader } from './components/common/Skeletons';

import HomePage from './pages/HomePage';

// Lazy loaded routes for fast initial public page load
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminMessages = lazy(() => import('./admin/pages/AdminMessages'));
const AdminProfile = lazy(() => import('./admin/pages/AdminProfile'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));

// Lazy load module managers
const loadModuleManagers = () => import('./admin/pages/ModuleManagers');
const AdminProjects = lazy(() => loadModuleManagers().then((m) => ({ default: m.AdminProjects })));
const AdminAchievements = lazy(() => loadModuleManagers().then((m) => ({ default: m.AdminAchievements })));
const AdminCertificates = lazy(() => loadModuleManagers().then((m) => ({ default: m.AdminCertificates })));
const AdminGallery = lazy(() => loadModuleManagers().then((m) => ({ default: m.AdminGallery })));
const AdminSkills = lazy(() => loadModuleManagers().then((m) => ({ default: m.AdminSkills })));
const AdminExperience = lazy(() => loadModuleManagers().then((m) => ({ default: m.AdminExperience })));
const AdminEducation = lazy(() => loadModuleManagers().then((m) => ({ default: m.AdminEducation })));
const AdminServices = lazy(() => loadModuleManagers().then((m) => ({ default: m.AdminServices })));
const AdminTestimonials = lazy(() => loadModuleManagers().then((m) => ({ default: m.AdminTestimonials })));
const AdminBlogs = lazy(() => loadModuleManagers().then((m) => ({ default: m.AdminBlogs })));

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
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </BrowserRouter>
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
