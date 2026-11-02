import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Language } from '../../types';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Settings as SettingsIcon, Save, RefreshCw, CheckCircle, 
  Building2, Phone, Mail, Globe, MapPin, ShieldCheck, Database 
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    companyName: 'DAR & ATELIER',
    tagline: 'Immobilier d\'Exception, Construction & Architecture d\'Intérieur au Maroc',
    contactEmail: 'contact@daratelier.ma',
    contactPhone: '+212 5 22 98 45 10',
    whatsappNumber: '+212 6 61 23 45 67',
    addressCasablanca: 'Boulevard Franklin Roosevelt, Triangle d\'Or, Casablanca',
    addressMarrakech: 'Avenue Mohammed VI, Hivernage, Marrakech',
    defaultCurrency: 'MAD',
    defaultLanguage: 'fr' as Language,
    seoTitle: 'DAR & ATELIER | Immobilier de Prestige, Villas & Architecture au Maroc',
    seoDescription: 'Agence immobilière haut de gamme et entreprise générale de construction à Casablanca, Marrakech, Rabat et Tanger. Vente de villas, conception architecturale et rénovation de luxe.',
    notificationEmail: 'leads@daratelier.ma',
    enableEmailAlerts: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.settings.get();
        if (res) {
          setFormData(prev => ({ ...prev, ...res }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.settings.update(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('Voulez-vous réinitialiser toutes les données de démonstration locales à leur état d\'origine ?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            {t('nav.settings')} — Configuration de la Plateforme
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Coordonnées institutionnelles, devises, référencement SEO et gestion des données
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetDemoData}
            className="flex items-center gap-2 text-stone-600 hover:text-red-600 hover:border-red-200"
          >
            <RefreshCw className="w-4 h-4" />
            Réinitialiser Données Démo
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-sm flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          Paramètres enregistrés avec succès. Toutes les modifications sont appliquées immédiatement.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identité de la Société */}
        <div className="bg-white p-6 rounded-sm border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Building2 className="w-5 h-5 text-bronze" />
            <h2 className="font-serif font-bold text-lg text-charcoal">Identité Institutionnelle & Siège</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom de l'Entreprise"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
            <Input
              label="Devise Institutionnelle"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Adresse Siège Social (Casablanca)"
              value={formData.addressCasablanca}
              onChange={(e) => setFormData({ ...formData, addressCasablanca: e.target.value })}
              required
            />
            <Input
              label="Bureau Régional (Marrakech)"
              value={formData.addressMarrakech}
              onChange={(e) => setFormData({ ...formData, addressMarrakech: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Contact & Lignes Directes */}
        <div className="bg-white p-6 rounded-sm border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Phone className="w-5 h-5 text-bronze" />
            <h2 className="font-serif font-bold text-lg text-charcoal">Contacts & Lignes Directes Clients</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Email Général"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              required
            />
            <Input
              label="Téléphone Fixe Standard"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              required
            />
            <Input
              label="Ligne WhatsApp Conciergerie"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Localisation & Devises */}
        <div className="bg-white p-6 rounded-sm border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Globe className="w-5 h-5 text-bronze" />
            <h2 className="font-serif font-bold text-lg text-charcoal">Monnaie, Devises & Langues</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1">
                Monnaie par défaut
              </label>
              <select
                value={formData.defaultCurrency}
                onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                className="w-full border border-stone-200 rounded-sm text-sm py-2 px-3 text-charcoal focus:border-bronze focus:outline-none"
              >
                <option value="MAD">MAD — Dirham Marocain (DH)</option>
                <option value="EUR">EUR — Euro (€)</option>
                <option value="USD">USD — Dollar Américain ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1">
                Langue Principale
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full border border-stone-200 rounded-sm text-sm py-2 px-3 text-charcoal focus:border-bronze focus:outline-none"
              >
                <option value="fr">Français (FR)</option>
                <option value="ar">العربية (AR - الاتجاه من اليمين لليسار)</option>
                <option value="en">English (EN)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Référencement Naturel (SEO) */}
        <div className="bg-white p-6 rounded-sm border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-bronze" />
            <h2 className="font-serif font-bold text-lg text-charcoal">Métadonnées SEO & Référencement</h2>
          </div>

          <Input
            label="Titre Global (Meta Title)"
            value={formData.seoTitle}
            onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1">
              Description Globale (Meta Description Google)
            </label>
            <textarea
              rows={3}
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              className="w-full p-3 border border-stone-200 rounded-sm text-sm focus:border-bronze focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" disabled={saving} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer les Paramètres'}
          </Button>
        </div>
      </form>
    </div>
  );
};
