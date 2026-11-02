import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-ivory-100 min-h-screen py-16 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-mutedgray hover:text-charcoal mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour à l’accueil
        </Link>
        <div className="bg-white rounded-luxury p-8 sm:p-12 border border-beige/40 shadow-sm text-charcoal">
          <div className="flex items-center gap-2 text-bronze text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Protection des Données &bull; CNDP Maroc</span>
          </div>
          <h1 className="text-3xl font-serif mb-6">Politique de Confidentialité</h1>

          <div className="space-y-6 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
            <p>
              La société <strong>DAR &amp; ATELIER SARL</strong>, régie par le droit marocain, accorde une importance primordiale à la protection de la vie privée et des données à caractère personnel de ses clients, prospects et partenaires, conformément aux dispositions de la <strong>Loi n° 09-08</strong> relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel.
            </p>

            <h3 className="font-serif text-base font-bold text-charcoal pt-2">1. Données collectées</h3>
            <p>
              Nous collectons uniquement les informations strictement nécessaires au traitement de vos requêtes : identité, coordonnées téléphoniques, adresse électronique, critères de recherche immobilière ou spécifications techniques de vos projets de construction.
            </p>

            <h3 className="font-serif text-base font-bold text-charcoal pt-2">2. Finalités des traitements</h3>
            <p>
              Ces données sont utilisées exclusivement pour :
              <br />&bull; L'organisation de visites immobilières privées et confidentielles.
              <br />&bull; L'établissement de devis et d'études architecturales ou de construction.
              <br />&bull; Le suivi régulier et l'information des commanditaires.
            </p>

            <h3 className="font-serif text-base font-bold text-charcoal pt-2">3. Non-divulgation à des tiers</h3>
            <p>
              DAR &amp; ATELIER ne commercialise, ne loue, ni ne transmet aucune donnée personnelle à des organismes tiers à des fins de prospection publicitaire. Vos informations sont soumises au secret professionnel le plus strict.
            </p>

            <h3 className="font-serif text-base font-bold text-charcoal pt-2">4. Vos droits (Accès, Rectification, Opposition)</h3>
            <p>
              Conformément à la Loi 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition sur les données vous concernant. Vous pouvez exercer ce droit à tout moment en adressant une demande écrite à notre délégué à la protection des données : <strong>dpo@dar-atelier.ma</strong> ou par courrier au siège : Tour Casablanca Finance City, Boulevard d'Anfa, Casablanca.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-ivory-100 min-h-screen py-16 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-mutedgray hover:text-charcoal mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour à l’accueil
        </Link>
        <div className="bg-white rounded-luxury p-8 sm:p-12 border border-beige/40 shadow-sm text-charcoal">
          <div className="flex items-center gap-2 text-bronze text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4" />
            <span>Cadre Légal &amp; Réglementaire</span>
          </div>
          <h1 className="text-3xl font-serif mb-6">Conditions Générales d'Utilisation</h1>

          <div className="space-y-6 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
            <p>
              L'accès et l'utilisation de la plateforme <strong>DAR &amp; ATELIER</strong> impliquent l'acceptation sans réserve des présentes conditions générales.
            </p>

            <h3 className="font-serif text-base font-bold text-charcoal pt-2">1. Propriété intellectuelle</h3>
            <p>
              Tous les contenus figurant sur cette plateforme — photographies d'architecture, plans, modélisations 3D, textes, charte graphique et logotypes — sont la propriété exclusive de DAR &amp; ATELIER ou de ses partenaires et sont protégés au titre du droit d'auteur au Maroc et dans le monde.
            </p>

            <h3 className="font-serif text-base font-bold text-charcoal pt-2">2. Nature des informations et estimations</h3>
            <p>
              Les photographies, surfaces et montants affichés dans le catalogue ont un caractère d'illustration et d'information précontractuelle. Les estimations générées par le simulateur sont strictement indicatives et ne sauraient constituer une offre ferme avant signature d'un contrat de maîtrise d'œuvre ou d'un compromis de vente authentique.
            </p>

            <h3 className="font-serif text-base font-bold text-charcoal pt-2">3. Droit applicable et juridiction compétente</h3>
            <p>
              Les présentes conditions sont régies par le droit marocain. En cas de différend qui ne trouverait pas de résolution amiable, les tribunaux de commerce de Casablanca seront seuls compétents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
