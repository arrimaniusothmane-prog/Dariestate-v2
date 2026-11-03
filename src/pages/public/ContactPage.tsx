import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  CheckCircle2,
  Send,
  Building,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { RevealOnScroll } from '../../components/animations';
import { api } from '../../services/api';
import { TEAM_MEMBERS } from '../../services/team';
import { STOCK } from '../../services/imageLibrary';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Renseignements généraux');
  const [message, setMessage] = useState('');
  const [preferredMethod, setPreferredMethod] = useState<'PHONE' | 'EMAIL' | 'WHATSAPP'>('PHONE');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.inquiries.submit({
        name,
        email,
        phone,
        subject,
        message,
        preferredContactMethod: preferredMethod,
      });
      setSubmitted(true);
    } catch (e) {
      alert('Une erreur est survenue lors de l’envoi de votre message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory-100 min-h-screen py-16 sm:py-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <RevealOnScroll direction="up">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="font-hand text-2xl sm:text-3xl text-clay-dark mb-3">On vous répond personnellement.</p>
            <span className="section-eyebrow justify-center mb-2">{t('contact.badge')}</span>
            <h1 className="text-3xl sm:text-5xl font-serif text-charcoal mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-xs sm:text-sm text-mutedgray leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </div>
        </RevealOnScroll>

        {/* Human team strip */}
        <RevealOnScroll direction="up" delay={0.1}>
          <div className="max-w-4xl mx-auto mb-14 bg-white rounded-luxury border border-beige/50 shadow-human p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-mutedgray text-center mb-4">
              Choisissez directement la personne qui vous accompagnera
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {TEAM_MEMBERS.map((member) => (
                <a
                  key={member.id}
                  href={`mailto:${member.email}`}
                  className="group flex flex-col items-center text-center p-2 rounded-md hover:bg-ivory-100 transition-colors"
                >
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-beige group-hover:border-clay transition-colors warm-photo"
                    loading="lazy"
                  />
                  <span className="text-xs font-bold text-charcoal mt-2 leading-tight">{member.name}</span>
                  <span className="text-[10px] text-clay font-medium mt-0.5">{member.shortRole}</span>
                  <span className="text-[10px] text-mutedgray mt-1 hidden sm:block">{member.email}</span>
                </a>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Addresses (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Office photo */}
            <div className="relative rounded-luxury overflow-hidden border border-beige/40 shadow-sm">
              <img
                src={STOCK.atelier[2]}
                alt="Bureau DAR & ATELIER à Casablanca"
                className="w-full aspect-[16/10] object-cover warm-photo"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 font-hand text-2xl text-ivory leading-tight">
                Passez nous voir, le café est prêt.
              </p>
            </div>

            {/* Casablanca Agency */}
            <div className="bg-white p-6 sm:p-8 rounded-luxury border border-beige/40 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Building className="w-5 h-5 text-bronze" />
                <h3 className="font-serif text-lg text-charcoal font-bold">Siège &amp; Bureau Casablanca</h3>
              </div>
              <p className="text-xs text-mutedgray leading-relaxed mb-4">
                Tour Casablanca Finance City (CFC), 14ème étage<br />
                Boulevard d’Anfa, Casablanca, Maroc
              </p>
              <div className="space-y-2 text-xs text-charcoal/80 pt-3 border-t border-ivory-200">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-bronze" />
                  <span>+212 5 22 45 80 90</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-bronze" />
                  <span>Lundi au Vendredi : 09h00 – 19h00 (sur RDV le Samedi)</span>
                </p>
              </div>
            </div>

            {/* Marrakech Agency */}
            <div className="bg-white p-6 sm:p-8 rounded-luxury border border-beige/40 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Building className="w-5 h-5 text-bronze" />
                <h3 className="font-serif text-lg text-charcoal font-bold">Atelier &amp; Bureau Marrakech</h3>
              </div>
              <p className="text-xs text-mutedgray leading-relaxed mb-4">
                Boulevard Mohammed VI, Guéliz<br />
                Marrakech 40000, Maroc
              </p>
              <div className="space-y-2 text-xs text-charcoal/80 pt-3 border-t border-ivory-200">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-bronze" />
                  <span>+212 5 24 33 22 11</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-bronze" />
                  <span>marrakech@dar-atelier.ma</span>
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="bg-emerald-900 text-white p-6 rounded-luxury shadow-md flex items-center justify-between">
              <div>
                <p className="font-serif text-base font-bold mb-1">Assistance VIP Immédiate</p>
                <p className="text-xs text-emerald-200">Échangez directement avec un conseiller privé.</p>
              </div>
              <a
                href="https://wa.me/212661234567"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Validated Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-luxury border border-beige/40 shadow-luxury">
              {submitted ? (
                <div className="py-12 text-center text-emerald-900">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-bold mb-2">Message Transmis avec Succès</h3>
                  <p className="text-xs sm:text-sm text-mutedgray max-w-md mx-auto leading-relaxed mb-6">
                    Nous vous remercions de votre prise de contact. Nos directeurs associés étudieront votre requête en toute confidentialité et vous répondront sous 24h ouvrées.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="px-6 py-2.5 bg-bronze hover:bg-bronze-dark text-white rounded text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                        {t('contact.name')} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="M. ou Mme..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                        {t('contact.email')} *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="nom@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                        {t('contact.phone')} *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+212 6 ..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                        {t('contact.preferredMethod')}
                      </label>
                      <select
                        value={preferredMethod}
                        onChange={(e) => setPreferredMethod(e.target.value as any)}
                        className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                      >
                        <option value="PHONE">{t('contact.methodPhone')}</option>
                        <option value="EMAIL">{t('contact.methodEmail')}</option>
                        <option value="WHATSAPP">{t('contact.methodWhatsapp')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                      {t('contact.subject')} *
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-2.5 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                    >
                      <option value="Acquisition Immobilière de Prestige">Acquisition Immobilière de Prestige</option>
                      <option value="Location Villa ou Penthouse">Location Villa ou Penthouse</option>
                      <option value="Projet de Construction de Villa">Projet de Construction de Villa</option>
                      <option value="Architecture d'Intérieur & Mobilier">Architecture d'Intérieur &amp; Mobilier</option>
                      <option value="Rénovation Lourde de Demeure">Rénovation Lourde de Demeure</option>
                      <option value="Autre demande confidentielle">Autre demande confidentielle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-mutedgray mb-1">
                      {t('contact.message')} *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Précisez votre recherche, ville cible, budget ou calendrier..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 rounded border border-black/15 bg-ivory-50 focus:border-bronze focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-bronze hover:bg-bronze-dark text-white rounded font-semibold uppercase tracking-wider text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? t('contact.sending') : t('contact.sendBtn')}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
