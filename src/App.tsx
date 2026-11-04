import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PublicHeader } from './components/layout/PublicHeader';
import { PublicFooter } from './components/layout/PublicFooter';
import { AdminLayout } from './components/layout/AdminLayout';
import { CustomCursor } from './components/animations/CustomCursor';
import { PageTransition } from './components/animations/PageTransition';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { PropertiesPage } from './pages/public/PropertiesPage';
import { PropertyDetailPage } from './pages/public/PropertyDetailPage';
import { ConstructionPage } from './pages/public/ConstructionPage';
import { DesignPage } from './pages/public/DesignPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { FavoritesPage } from './pages/public/FavoritesPage';
import { RequestQuotePage } from './pages/public/RequestQuotePage';
import { PrivacyPolicyPage, TermsPage } from './pages/public/LegalPages';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { UserDashboardPage } from './pages/public/UserDashboardPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage';
import { AdminPropertyFormPage } from './pages/admin/AdminPropertyFormPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminQuotesPage } from './pages/admin/AdminQuotesPage';
import { AdminConstructionPage } from './pages/admin/AdminConstructionPage';
import { AdminDesignPage } from './pages/admin/AdminDesignPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminActivityPage } from './pages/admin/AdminActivityPage';

// Public Layout Wrapper
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-ivory text-charcoal font-sans antialiased selection:bg-bronze selection:text-white">
    <PublicHeader />
    <main className="flex-1">
      <PageTransition>{children}</PageTransition>
    </main>
    <PublicFooter />
  </div>
);

export const App: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <CustomCursor />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Pages */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/properties" element={<PublicLayout><PropertiesPage /></PublicLayout>} />
          <Route path="/properties/:slug" element={<PublicLayout><PropertyDetailPage /></PublicLayout>} />
          <Route path="/construction" element={<PublicLayout><ConstructionPage /></PublicLayout>} />
          <Route path="/design" element={<PublicLayout><DesignPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/favorites" element={<PublicLayout><FavoritesPage /></PublicLayout>} />
          <Route path="/request-quote" element={<PublicLayout><RequestQuotePage /></PublicLayout>} />
          <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
          <Route path="/dashboard" element={<PublicLayout><UserDashboardPage /></PublicLayout>} />
          <Route path="/admin/login" element={<PublicLayout><LoginPage /></PublicLayout>} />

          {/* Admin Dashboard Pages */}
          <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
          <Route path="/admin/properties" element={<AdminLayout><AdminPropertiesPage /></AdminLayout>} />
          <Route path="/admin/properties/new" element={<AdminLayout><AdminPropertyFormPage /></AdminLayout>} />
          <Route path="/admin/properties/:id/edit" element={<AdminLayout><AdminPropertyFormPage /></AdminLayout>} />
          <Route path="/admin/leads" element={<AdminLayout><AdminLeadsPage /></AdminLayout>} />
          <Route path="/admin/quotes" element={<AdminLayout><AdminQuotesPage /></AdminLayout>} />
          <Route path="/admin/construction-projects" element={<AdminLayout><AdminConstructionPage /></AdminLayout>} />
          <Route path="/admin/design-projects" element={<AdminLayout><AdminDesignPage /></AdminLayout>} />
          <Route path="/admin/media" element={<AdminLayout><AdminMediaPage /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsersPage /></AdminLayout>} />
          <Route path="/admin/reviews" element={<AdminLayout><AdminReviewsPage /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />
          <Route path="/admin/activity" element={<AdminLayout><AdminActivityPage /></AdminLayout>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
