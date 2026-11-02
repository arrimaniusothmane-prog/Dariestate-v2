import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Building2, ArrowRight } from 'lucide-react';
import { useFavorites } from '../../services/favoritesContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { PropertyCard } from '../../components/ui/PropertyCard';

export const FavoritesPage: React.FC = () => {
  const { favorites, favoritesCount } = useFavorites();
  const { t } = useLanguage();

  return (
    <div className="bg-ivory-100 min-h-screen py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-bronze/10 text-bronze border border-bronze/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 fill-bronze" />
            <span>Sélection Privée</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-3">
            Vos Propriétés Sauvegardées ({favoritesCount})
          </h1>
          <p className="text-xs sm:text-sm text-mutedgray leading-relaxed">
            Retrouvez tous les biens de prestige que vous avez sélectionnés lors de votre navigation.
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-luxury p-12 text-center border border-beige/40 max-w-xl mx-auto my-8 shadow-sm">
            <Heart className="w-12 h-12 text-beige mx-auto mb-4" />
            <h3 className="font-serif text-xl text-charcoal mb-2">Aucun bien enregistré</h3>
            <p className="text-xs text-mutedgray leading-relaxed mb-6">
              Vous n'avez pas encore ajouté de propriété à votre liste de favoris. Explorez notre catalogue pour sauvegarder les villas et penthouses qui vous inspirent.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <span>Découvrir le catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
