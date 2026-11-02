import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  HardHat,
  Palette,
  Image,
  UserCheck,
  Star,
  Settings,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
  Search,
  Bell,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../services/authContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { UserRole } from '../../types';
import { luxuryEase } from '../animations/motionVariants';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, switchRole } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  useEffect(() => {
    // Basic route protection
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(location.pathname));
    }
  }, [user, navigate, location.pathname]);

  const menuItems = [
    { href: '/admin/dashboard', label: t('admin.dashboard'), icon: LayoutDashboard },
    { href: '/admin/properties', label: t('admin.properties'), icon: Building2 },
    { href: '/admin/leads', label: t('admin.leads'), icon: Users },
    { href: '/admin/quotes', label: t('admin.quotes'), icon: FileText },
    { href: '/admin/construction-projects', label: t('admin.construction'), icon: HardHat },
    { href: '/admin/design-projects', label: t('admin.design'), icon: Palette },
    { href: '/admin/media', label: t('admin.media'), icon: Image },
    { href: '/admin/users', label: t('admin.users'), icon: UserCheck },
    { href: '/admin/reviews', label: t('admin.reviews'), icon: Star },
    { href: '/admin/settings', label: t('admin.settings'), icon: Settings },
    { href: '/admin/activity', label: t('admin.activity'), icon: History },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin/dashboard' && location.pathname === '/admin/dashboard') return true;
    if (path !== '/admin/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const roles: { role: UserRole; label: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin (Tout accès)' },
    { role: 'AGENT', label: 'Agent Immobilier (Biens & CRM)' },
    { role: 'CONSTRUCTION_MANAGER', label: 'Directeur Chantiers' },
    { role: 'INTERIOR_DESIGNER', label: 'Architecte d’Intérieur' },
    { role: 'SALES_REP', label: 'Chargé de Clientèle' },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col md:flex-row text-charcoal">
      {/* Sidebar */}
      <aside
        className={`bg-charcoal text-ivory flex-shrink-0 transition-all duration-300 flex flex-col justify-between z-30 ${
          collapsed ? 'w-20' : 'w-64'
        } border-r border-charcoal-700`}
      >
        <div>
          {/* Brand header */}
          <div className="p-4 flex items-center justify-between border-b border-charcoal-700">
            <Link to="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-md bg-charcoal-900 text-bronze border border-bronze/40 flex items-center justify-center font-serif text-lg font-bold flex-shrink-0">
                D&amp;A
              </div>
              {!collapsed && (
                <div className="truncate">
                  <span className="block font-serif text-base font-bold tracking-wider text-ivory">
                    DAR &amp; ATELIER
                  </span>
                  <span className="block text-[9px] uppercase tracking-widest text-bronze">
                    Administration
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1.5 rounded text-ivory/60 hover:text-white hover:bg-charcoal-700 transition-colors cursor-pointer"
              aria-label={collapsed ? 'Agrandir le menu' : 'Réduire le menu'}
            >
              {collapsed ? (
                isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              ) : (
                isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Nav links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                    active
                      ? 'bg-bronze text-white shadow-sm font-semibold'
                      : 'text-ivory/70 hover:bg-charcoal-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-charcoal-700 space-y-2">
          {/* Back to website */}
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-beige hover:text-white rounded hover:bg-charcoal-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{t('nav.home')} (Site Public)</span>}
          </Link>

          {/* User profile capsule */}
          <div className="relative">
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="w-full flex items-center gap-2.5 p-2 rounded bg-charcoal-800 hover:bg-charcoal-700 text-left transition-colors cursor-pointer"
              title="Changer de rôle pour démonstration"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={user?.name}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-bronze/40"
              />
              {!collapsed && (
                <div className="truncate flex-grow">
                  <p className="text-xs font-semibold text-ivory truncate">{user?.name}</p>
                  <p className="text-[10px] text-bronze uppercase tracking-wider truncate">
                    {user?.role?.replace('_', ' ')}
                  </p>
                </div>
              )}
            </button>

            {/* Quick evaluator role switcher dropdown */}
            <AnimatePresence>
              {roleSwitcherOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: luxuryEase }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-charcoal-900 border border-charcoal-600 rounded-md shadow-2xl p-2 z-50 text-xs"
                >
                  <p className="text-[10px] uppercase tracking-wider text-mutedgray font-semibold mb-2 px-1">
                    Tester un autre rôle :
                  </p>
                  <div className="space-y-1">
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setRoleSwitcherOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded transition-colors text-xs ${
                          user?.role === r.role ? 'bg-bronze text-white font-bold' : 'text-ivory hover:bg-charcoal-700'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Admin Topbar */}
        <header className="h-16 bg-white border-b border-beige/40 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          {/* Breadcrumb / Section indicator */}
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-mutedgray font-semibold">
              DAR &amp; ATELIER ADMIN
            </span>
            <span className="text-mutedgray">&bull;</span>
            <span className="text-sm font-semibold text-charcoal">
              {menuItems.find((item) => isActive(item.href))?.label || 'Espace de Gestion'}
            </span>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-4">
            {/* Mode Indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{t('admin.liveMode')}</span>
            </div>

            {/* Language switch */}
            <div className="flex items-center gap-1 border border-beige/60 rounded p-1 bg-ivory text-xs">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  language === 'fr' ? 'bg-bronze text-white font-bold' : 'text-charcoal hover:bg-beige/40'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-2 py-0.5 rounded transition-colors font-arabic ${
                  language === 'ar' ? 'bg-bronze text-white font-bold' : 'text-charcoal hover:bg-beige/40'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  language === 'en' ? 'bg-bronze text-white font-bold' : 'text-charcoal hover:bg-beige/40'
                }`}
              >
                EN
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 text-mutedgray hover:text-charcoal hover:bg-ivory rounded-full transition-colors relative cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-bronze rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic page content with subtle fast motion */}
        <main className="p-6 sm:p-8 flex-grow overflow-x-hidden">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: luxuryEase }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
