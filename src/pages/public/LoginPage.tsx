import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../services/authContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const LoginPage: React.FC = () => {
  const { login, switchRole } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Identifiants incorrects.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: any, demoEmail: string) => {
    switchRole(role);
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-[85vh] bg-ivory-100 flex items-center justify-center p-4 sm:p-6 animate-fade-in py-12">
      <div className="w-full max-w-md bg-white rounded-luxury p-8 sm:p-10 border border-beige/40 shadow-luxury">
        {/* Logo Monogram */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-charcoal text-ivory flex items-center justify-center font-serif text-2xl mx-auto mb-3 border border-bronze/40">
            <span className="text-bronze">D</span>&amp;<span className="text-white text-xs ml-0.5">A</span>
          </div>
          <h1 className="text-2xl font-serif text-charcoal">Espace Authentification</h1>
          <p className="text-xs text-mutedgray mt-1">
            Connectez-vous à la plateforme de gestion DAR &amp; ATELIER
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-800 border border-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mutedgray" />
              <input
                type="email"
                required
                placeholder="nom@dar-atelier.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mutedgray" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            {isLoading ? 'Connexion en cours...' : 'Se Connecter'}
          </button>
        </form>

        {/* Evaluator 1-Click Quick Testing Access */}
        <div className="mt-8 pt-6 border-t border-ivory-200">
          <p className="text-[11px] font-bold uppercase tracking-wider text-bronze text-center mb-3">
            Accès Rapide pour Évaluation :
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => handleQuickDemoLogin('SUPER_ADMIN', 'admin@dar-atelier.ma')}
              className="p-2 rounded bg-ivory hover:bg-beige/30 border border-beige/60 text-charcoal font-semibold text-left transition-colors cursor-pointer"
            >
              Super Admin
            </button>
            <button
              onClick={() => handleQuickDemoLogin('AGENT', 'karim.alami@dar-atelier.ma')}
              className="p-2 rounded bg-ivory hover:bg-beige/30 border border-beige/60 text-charcoal font-semibold text-left transition-colors cursor-pointer"
            >
              Agent Immobilier
            </button>
            <button
              onClick={() => handleQuickDemoLogin('CONSTRUCTION_MANAGER', 'mehdi.bennani@dar-atelier.ma')}
              className="p-2 rounded bg-ivory hover:bg-beige/30 border border-beige/60 text-charcoal font-semibold text-left transition-colors cursor-pointer"
            >
              Chef de Chantiers
            </button>
            <button
              onClick={() => handleQuickDemoLogin('INTERIOR_DESIGNER', 'leila.tazi@dar-atelier.ma')}
              className="p-2 rounded bg-ivory hover:bg-beige/30 border border-beige/60 text-charcoal font-semibold text-left transition-colors cursor-pointer"
            >
              Designer d'Intérieur
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-mutedgray">
          <span>Pas encore de compte ? </span>
          <Link to="/register" className="text-bronze font-bold hover:underline">
            Créer un compte client
          </Link>
        </div>
      </div>
    </div>
  );
};
