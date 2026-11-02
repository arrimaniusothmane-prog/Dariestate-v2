import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  FileText,
  HardHat,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { StaggerContainer, StaggerItem } from '../../components/animations';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../services/authContext';
import { LocalStore } from '../../services/storage';

export const AdminDashboardPage: React.FC = () => {
  const { t, formatPrice } = useLanguage();
  const { user } = useAuth();

  const properties = LocalStore.getProperties();
  const inquiries = LocalStore.getInquiries();
  const quotes = LocalStore.getQuotes();
  const projects = LocalStore.getConstructionProjects();
  const activities = LocalStore.getActivityLogs().slice(0, 8);

  const availableProps = properties.filter((p) => p.status === 'AVAILABLE').length;
  const newInquiries = inquiries.filter((i) => i.status === 'NEW').length;
  const pendingQuotes = quotes.filter((q) => q.status === 'PENDING').length;
  const activeProjects = projects.filter((p) => p.status !== 'COMPLETED').length;

  const totalContractPipeline = projects.reduce((acc, p) => acc + (p.contractAmount || 0), 0);

  // Recharts Data for Leads Over Time
  const leadsTrendData = [
    { month: 'Mai', prospects: 12, devis: 4 },
    { month: 'Juin', prospects: 19, devis: 7 },
    { month: 'Juil', prospects: 24, devis: 9 },
    { month: 'Août', prospects: 18, devis: 6 },
    { month: 'Sept', prospects: 32, devis: 14 },
    { month: 'Oct', prospects: 45, devis: 21 },
  ];

  // Property distribution by type
  const typeCounts: Record<string, number> = {};
  properties.forEach((p) => {
    typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
  });

  const pieData = Object.keys(typeCounts).map((key) => ({
    name: key,
    value: typeCounts[key],
  }));

  const COLORS = ['#A78058', '#20211F', '#D8C9B5', '#777872', '#2E7D32', '#C29C74'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-luxury border border-beige/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-bronze block mb-1">
            Tableau de Bord Exécutif
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-charcoal">
            Bienvenue, {user?.name || 'Administrateur'}
          </h1>
          <p className="text-xs text-mutedgray mt-1">
            Rôle actif : <strong className="text-charcoal uppercase">{user?.role?.replace('_', ' ')}</strong> &bull; Plateforme connectée
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/properties/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau Bien</span>
          </Link>
          <Link
            to="/admin/leads"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-charcoal hover:bg-charcoal-900 text-ivory rounded text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Gérer les Leads</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <StaggerItem>
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-white p-5 rounded-luxury border border-beige/40 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-mutedgray">
                {t('admin.kpiProperties')}
              </span>
              <div className="p-2 rounded bg-ivory-200 text-charcoal">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-serif font-bold text-charcoal mb-1">
              {properties.length}
            </div>
            <p className="text-xs text-emerald-800 font-medium">
              {availableProps} disponibles à la vente / location
            </p>
          </motion.div>
        </StaggerItem>

        {/* Card 2 */}
        <StaggerItem>
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-white p-5 rounded-luxury border border-beige/40 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-mutedgray">
                {t('admin.kpiLeads')}
              </span>
              <div className="p-2 rounded bg-ivory-200 text-charcoal">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-serif font-bold text-charcoal mb-1">
              {inquiries.length}
            </div>
            <p className="text-xs text-amber-800 font-medium">
              {newInquiries} nouvelles demandes à qualifier
            </p>
          </motion.div>
        </StaggerItem>

        {/* Card 3 */}
        <StaggerItem>
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-white p-5 rounded-luxury border border-beige/40 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-mutedgray">
                {t('admin.kpiQuotes')}
              </span>
              <div className="p-2 rounded bg-ivory-200 text-charcoal">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-serif font-bold text-charcoal mb-1">
              {quotes.length}
            </div>
            <p className="text-xs text-blue-800 font-medium">
              {pendingQuotes} devis en cours d’étude chiffrée
            </p>
          </motion.div>
        </StaggerItem>

        {/* Card 4 */}
        <StaggerItem>
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-white p-5 rounded-luxury border border-beige/40 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-mutedgray">
                Volume Chantiers
              </span>
              <div className="p-2 rounded bg-ivory-200 text-charcoal">
                <HardHat className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-serif font-bold text-bronze-dark mb-1">
              {formatPrice(totalContractPipeline)}
            </div>
            <p className="text-xs text-mutedgray font-medium">
              {activeProjects} projets de construction en cours
            </p>
          </motion.div>
        </StaggerItem>
      </StaggerContainer>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trend Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-luxury border border-beige/40 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-lg text-charcoal font-bold">
                {t('admin.chartLeads')}
              </h3>
              <p className="text-xs text-mutedgray">Volume mensuel des contacts acquéreurs et demandes de devis</p>
            </div>
            <span className="text-xs font-bold text-bronze bg-bronze/10 px-2.5 py-1 rounded">
              +38% ce trimestre
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadsTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProspects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78058" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#A78058" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDevis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#20211F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#20211F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#777872" fontSize={11} tickLine={false} />
                <YAxis stroke="#777872" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#20211F', color: '#F7F5F0', borderRadius: '6px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="prospects" name="Prospects" stroke="#A78058" strokeWidth={2} fillOpacity={1} fill="url(#colorProspects)" />
                <Area type="monotone" dataKey="devis" name="Demandes de Devis" stroke="#20211F" strokeWidth={2} fillOpacity={1} fill="url(#colorDevis)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Distribution Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-luxury border border-beige/40 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg text-charcoal font-bold mb-1">
              {t('admin.chartDistribution')}
            </h3>
            <p className="text-xs text-mutedgray mb-4">Typologie des biens au catalogue</p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#20211F', color: '#F7F5F0', borderRadius: '6px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-ivory-200">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-mutedgray truncate">{d.name} :</span>
                <span className="font-bold text-charcoal">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Inquiries & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries CRM (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-luxury border border-beige/40 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-lg text-charcoal font-bold">
              {t('admin.recentInquiries')}
            </h3>
            <Link to="/admin/leads" className="text-xs font-semibold text-bronze hover:underline">
              Voir tous les leads &rarr;
            </Link>
          </div>

          <div className="space-y-3.5">
            {inquiries.slice(0, 4).map((inq) => (
              <div
                key={inq.id}
                className="p-3.5 rounded-lg border border-ivory-200 hover:border-beige transition-all flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-charcoal">{inq.name}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      inq.status === 'NEW' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-mutedgray font-medium line-clamp-1">{inq.subject}</p>
                  <p className="text-[11px] text-mutedgray/80 mt-1">{inq.phone} &bull; {inq.email}</p>
                </div>
                <Link
                  to="/admin/leads"
                  className="p-1.5 rounded hover:bg-ivory-200 text-mutedgray hover:text-charcoal"
                  title="Consulter le prospect"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-luxury border border-beige/40 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-lg text-charcoal font-bold">
              {t('admin.recentActivity')}
            </h3>
            <Link to="/admin/activity" className="text-xs font-semibold text-bronze hover:underline">
              Journal complet &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs py-1.5 border-b border-ivory-100 last:border-b-0">
                <Clock className="w-3.5 h-3.5 text-bronze flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-charcoal">{act.details || act.action}</p>
                  <p className="text-[10px] text-mutedgray mt-0.5">
                    Par {act.userName || 'Système'} &bull; {new Date(act.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
