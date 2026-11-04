import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, FileText, Settings, LogOut, Camera, Lock, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../services/authContext';
import { useFavorites } from '../../services/favoritesContext';
import { PropertyCard } from '../../components/ui/PropertyCard';

export const UserDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'inquiries'>('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-mutedgray mb-4">Vous devez être connecté pour accéder à cette page.</p>
          <Link to="/login" className="text-bronze font-bold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion API call
    console.log('Delete account:', user.id);
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen bg-ivory-100 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-2">
            Mon Espace
          </h1>
          <p className="text-mutedgray">Gérez votre profil et vos préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-luxury p-6 border border-beige/40 shadow-sm sticky top-8">
              {/* Profile Summary */}
              <div className="text-center mb-6 pb-6 border-b border-beige/30">
                <div className="w-20 h-20 rounded-full bg-bronze/10 flex items-center justify-center mx-auto mb-3 border-2 border-bronze/30">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-bronze" />
                  )}
                </div>
                <h3 className="font-serif text-lg text-charcoal">{user.name}</h3>
                <p className="text-xs text-mutedgray">{user.email}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {user.isEmailVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      Vérifié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                      <XCircle className="w-3 h-3" />
                      Non vérifié
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-bronze/10 text-bronze'
                      : 'text-mutedgray hover:bg-ivory'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Mon Profil
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'favorites'
                      ? 'bg-bronze/10 text-bronze'
                      : 'text-mutedgray hover:bg-ivory'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  Favoris ({favorites.length})
                </button>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'inquiries'
                      ? 'bg-bronze/10 text-bronze'
                      : 'text-mutedgray hover:bg-ivory'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Mes Demandes
                </button>
              </nav>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-beige/30 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-mutedgray hover:bg-ivory transition-colors">
                  <Settings className="w-4 h-4" />
                  Paramètres
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-luxury p-8 border border-beige/40 shadow-sm">
                <h2 className="text-2xl font-serif text-charcoal mb-6">Mon Profil</h2>
                
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-bronze/10 flex items-center justify-center border-2 border-bronze/30">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-bronze" />
                      )}
                    </div>
                    <div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-bronze hover:bg-bronze-dark text-white rounded text-sm font-medium transition-colors">
                        <Camera className="w-4 h-4" />
                        Changer la photo
                      </button>
                      <p className="text-xs text-mutedgray mt-2">JPG, PNG. Max 5MB</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-mutedgray mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full px-4 py-3 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-mutedgray mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="w-full px-4 py-3 rounded border border-black/15 bg-ivory-100 text-mutedgray cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-mutedgray mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        defaultValue={user.phone || ''}
                        placeholder="+212 6 ..."
                        className="w-full px-4 py-3 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Password Change */}
                  <div className="pt-6 border-t border-beige/30">
                    <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Changer le mot de passe
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-mutedgray mb-2">
                          Mot de passe actuel
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-mutedgray mb-2">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-mutedgray mb-2">
                          Confirmer le mot de passe
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-beige/30">
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer mon compte
                    </button>
                    <button className="px-6 py-3 bg-bronze hover:bg-bronze-dark text-white rounded text-sm font-semibold uppercase tracking-wider transition-colors">
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-luxury p-8 border border-beige/40 shadow-sm">
                <h2 className="text-2xl font-serif text-charcoal mb-6">Mes Favoris ({favorites.length})</h2>
                
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((prop) => (
                      <PropertyCard key={prop.id} property={prop} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-beige mx-auto mb-4" />
                    <h3 className="font-serif text-xl text-charcoal mb-2">Aucun favori</h3>
                    <p className="text-sm text-mutedgray mb-6">
                      Vous n'avez pas encore ajouté de propriété à vos favoris.
                    </p>
                    <Link
                      to="/properties"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-bronze hover:bg-bronze-dark text-white rounded text-sm font-semibold uppercase tracking-wider transition-colors"
                    >
                      Découvrir nos propriétés
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div className="bg-white rounded-luxury p-8 border border-beige/40 shadow-sm">
                <h2 className="text-2xl font-serif text-charcoal mb-6">Mes Demandes</h2>
                
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-beige mx-auto mb-4" />
                  <h3 className="font-serif text-xl text-charcoal mb-2">Aucune demande</h3>
                  <p className="text-sm text-mutedgray mb-6">
                    Vous n'avez pas encore soumis de demande de devis ou de contact.
                  </p>
                  <Link
                    to="/request-quote"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-bronze hover:bg-bronze-dark text-white rounded text-sm font-semibold uppercase tracking-wider transition-colors"
                  >
                    Demander un devis
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-luxury p-8 max-w-md w-full border border-beige/40 shadow-luxury">
            <h3 className="text-xl font-serif text-charcoal mb-4">Supprimer mon compte</h3>
            <p className="text-sm text-mutedgray mb-6">
              Cette action est irréversible. Toutes vos données seront définitivement supprimées.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-black/15 rounded text-sm font-medium hover:bg-ivory transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
