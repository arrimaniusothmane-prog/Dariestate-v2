import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Language } from '../../types';
import { api } from '../../services/api';
import { LocalStore } from '../../services/storage';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Save, RefreshCw, CheckCircle,
  Building2, Phone, Mail, Globe, ShieldCheck,
} from 'lucide-react';

interface SettingsForm {
  companyName: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  defaultCurrency: string;
  defaultLanguage: Language;
  metaTitle: string;
  metaDescription: string;
  emailNotificationsEnabled: boolean;
}

const EMPTY_FORM: SettingsForm = {
  companyName: 'DAR & ATELIER',
  email: 'contact@dar-atelier.ma',
  phone: '+212 5 22 45 80 90',
  whatsapp: '+212 6 61 23 45 67',
  address: 'Tour Casablanca Finance City, Boulevard d’Anfa',
  city: 'Casablanca',
  country: 'Maroc',
  defaultCurrency: 'MAD',
  defaultLanguage: 'fr',
  metaTitle: 'DAR & ATELIER | Immobilier de prestige, villas & architecture au Maroc',
  metaDescription:
    'Agence immobilière haut de gamme et entreprise générale de construction à Casablanca, Marrakech, Rabat et Tanger.',
  emailNotificationsEnabled: true,
};

export const AdminSettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState<SettingsForm>(EMPTY_FORM);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.settings.get();
        setFormData({
          companyName: res.companyName || EMPTY_FORM.companyName,
          email: res.email || EMPTY_FORM.email,
          phone: res.phone || EMPTY_FORM.phone,
          whatsapp: res.whatsapp || EMPTY_FORM.whatsapp,
          address: res.address || EMPTY_FORM.address,
          city: res.city || EMPTY_FORM.city,
          country: res.country || EMPTY_FORM.country,
          defaultCurrency: res.defaultCurrency || EMPTY_FORM.defaultCurrency,
          defaultLanguage: res.defaultLanguage || EMPTY_FORM.defaultLanguage,
          metaTitle: res.metaTitle || EMPTY_FORM.metaTitle,
          metaDescription: res.metaDescription || EMPTY_FORM.metaDescription,
          emailNotificationsEnabled: res.emailNotificationsEnabled ?? true,
        });
      } catch (err) {
        console.error(err);
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
      window.alert("L'enregistrement des paramètres a échoué.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('Voulez-vous réinitialiser toutes les données de démonstration locales à leur état d’origine ?')) {
      LocalStore.resetDefaults();
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
              label="Ville du Siège"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>

          <Input
            label="Adresse du Siège Social"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />

          <Input
            label="Pays"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            required
          />
        </div>

        {/* Contact */}
        <div className="bg-white p-6 rounded-sm border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Phone className="w-5 h-5 text-bronze" />
            <h2 className="font-serif font-bold text-lg text-charcoal">Contacts & Lignes Directes Clients</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Email Général"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Téléphone Fixe Standard"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Ligne WhatsApp Conciergerie"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              required
            />
          </div>

          <label className="flex items-center gap-3 text-xs text-charcoal/80">
            <input
              type="checkbox"
              checked={formData.emailNotificationsEnabled}
              onChange={(e) => setFormData({ ...formData, emailNotificationsEnabled: e.target.checked })}
              className="accent-bronze"
            />
            Recevoir une notification par email à chaque nouvelle demande client
          </label>
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
                onChange={(e) => {
                  const value = e.target.value as Language;
                  setLanguage(value);
                  setFormData({ ...formData, defaultLanguage: value });
                }}
                className="w-full border border-stone-200 rounded-sm text-sm py-2 px-3 text-charcoal focus:border-bronze focus:outline-none"
              >
                <option value="fr">Français (FR)</option>
                <option value="ar">العربية (AR - الاتجاه من اليمين لليسار)</option>
                <option value="en">English (EN)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white p-6 rounded-sm border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-bronze" />
            <h2 className="font-serif font-bold text-lg text-charcoal">Métadonnées SEO & Référencement</h2>
          </div>

          <Input
            label="Titre Global (Meta Title)"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1">
              Description Globale (Meta Description Google)
            </label>
            <textarea
              rows={3}
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className="w-full p-3 border border-stone-200 rounded-sm text-sm focus:border-bronze focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" disabled={saving} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer les Paramètres'}
          </Button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-sm border border-stone-200 flex items-start gap-3 text-xs text-charcoal-light">
        <Mail className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
        <p>
          Les paramètres sont partagés avec les pages publiques (coordonnées, WhatsApp et référencement).
          Pensez à enregistrer après chaque modification.
        </p>
      </div>
    </div>
  );
};
