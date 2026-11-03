import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User as UserIcon, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../services/authContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await register(name, email, password, phone);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’inscription.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-ivory-100 flex items-center justify-center p-4 sm:p-6 animate-fade-in py-12">
      <div className="w-full max-w-md bg-white rounded-luxury p-8 sm:p-10 border border-beige/40 shadow-luxury">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-charcoal text-ivory flex items-center justify-center font-serif text-2xl mx-auto mb-3 border border-bronze/40">
            <span className="text-bronze">D</span>&amp;<span className="text-white text-xs ml-0.5">A</span>
          </div>
          <h1 className="text-2xl font-serif text-charcoal">Création de Compte</h1>
          <p className="text-xs text-mutedgray mt-1">
            Accédez à votre espace privé et suivez vos démarches
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
              Nom et Prénom *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mutedgray" />
              <input
                type="text"
                required
                placeholder="Dr. Omar Kabbaj"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
              Adresse Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mutedgray" />
              <input
                type="email"
                required
                placeholder="omar@exemple.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mutedgray" />
              <input
                type="tel"
                placeholder="+212 6 ..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
              Mot de passe *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mutedgray" />
              <input
                type="password"
                required
                minLength={8}
                placeholder="Au moins 8 caractères"
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
            {isLoading ? 'Création...' : 'Créer Mon Compte'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-mutedgray">
          <span>Déjà membre ? </span>
          <Link to="/login" className="text-bronze font-bold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};
