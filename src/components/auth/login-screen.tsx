"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Plus,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { BrandMark } from "@/components/brand/logo";
import { media } from "@/lib/media";
import styles from "./login.module.css";

const HERO_IMAGE = media.heroLogin;

const REMEMBERED_EMAIL_KEY = "darestimate:login-email";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FieldErrors {
  email?: string;
  password?: string;
}

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  const trimmed = email.trim();

  if (!trimmed) errors.email = "Veuillez saisir votre adresse email.";
  else if (!EMAIL_PATTERN.test(trimmed))
    errors.email = "Cette adresse email n’est pas valide.";

  if (!password) errors.password = "Veuillez saisir votre mot de passe.";

  return errors;
}

export function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { t } = useI18n();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    } catch {
      // storage unavailable (private mode) — ignore
    }
  }, []);

  const clearFieldError = (field: keyof FieldErrors) =>
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const nextErrors = validate(email, password);
    setFieldErrors(nextErrors);
    setFormError(null);

    if (nextErrors.email || nextErrors.password) {
      document
        .getElementById(nextErrors.email ? "login-email" : "login-password")
        ?.focus();
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);

    if (!result.ok) {
      setFormError(result.error);
      setLoading(false);
      return;
    }

    try {
      if (rememberMe)
        window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
      else window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    } catch {
      // storage unavailable — ignore
    }

    const user = result.user;
    const nextParam = searchParams.get("next");
    const safeNext =
      nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
        ? nextParam
        : null;

    if (safeNext) {
      router.push(safeNext);
      return;
    }

    const isMainAdmin =
      user.role === "ADMIN" &&
      user.email.trim().toLowerCase() === "arrimaniusothmane@gmail.com";

    if (isMainAdmin) router.push("/admin");
    else if (user.role === "SELLER" || user.role === "AGENT")
      router.push("/seller");
    else router.push("/buyer");
  };

  const heroLinks = [
    { href: "/properties", label: t("nav.nosBiens") },
    { href: "/construction", label: t("nav.travaux") },
    { href: "/invest", label: t("nav.investir") },
    { href: "/about", label: t("nav.apropos") },
  ];

  return (
    <div className={styles.screen}>
      <div className={styles.background}>
        <Image
          src={HERO_IMAGE}
          alt="Médina marocaine baignée de lumière dorée"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 56vw"
          className={styles.image}
        />
        <div className={styles.wash} />
      </div>

      <div className={styles.content}>
        <section className={styles.hero}>
          <header className={styles.topbar}>
            <Link href="/" className={styles.brand} aria-label="DarEstate — Accueil">
              <BrandMark tone="onDark" className="size-10" />
              <span className={styles.brandName}>
                Dar<span className="text-gold">Estate</span>
              </span>
            </Link>

            <nav className={styles.heroNav} aria-label="Navigation principale">
              {heroLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.heroNavLink}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link href="/" className={styles.backLink}>
              <ArrowLeft size={16} aria-hidden="true" />
              Retour au site
            </Link>
          </header>

          <div className={styles.pitch}>
            <h1 className={styles.headline}>
              <span className={styles.headlineLine}>
                <span>Achetez mieux.</span>
              </span>
              <span className={styles.headlineLine}>
                <span>Vendez sereinement.</span>
              </span>
              <span className={styles.headlineLine}>
                <span>Investissez au Maroc.</span>
              </span>
            </h1>
            <p className={styles.subline}>
              <span>
                Appartements, villas et terrains sélectionnés à Casablanca,
              </span>
              <span>
                Marrakech et Rabat — des biens vérifiés, un accompagnement
                complet.
              </span>
            </p>
            <div className={styles.dots} aria-hidden="true">
              <span className={`${styles.dot} ${styles.dotActive}`} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        </section>

        <aside className={styles.panel}>
          <div className={styles.card}>
            <div className={styles.cardTop}>
              <span className={styles.localeButton} title="Interface en français">
                <Globe size={16} aria-hidden="true" />
                <span>FR</span>
              </span>

              <span className={styles.cardLink} aria-current="page">
                Connexion
              </span>

              <Link href="/publish" className={styles.publishLink}>
                <Plus size={15} aria-hidden="true" />
                Publier
              </Link>
            </div>

            <div className={styles.formArea}>
              <form
                className={styles.form}
                onSubmit={handleSubmit}
                noValidate
                aria-busy={loading}
              >
                <div className={styles.formHeader}>
                  <h2 className={styles.title}>Bon retour !</h2>
                  <p className={styles.subtitle}>
                    Connectez-vous pour retrouver vos favoris, vos demandes et
                    vos transactions.
                  </p>
                </div>

                {formError && (
                  <div className={styles.alert} role="alert">
                    <AlertCircle size={18} aria-hidden="true" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className={styles.fields}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="login-email">
                      Email
                    </label>
                    <div className={styles.inputShell}>
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="vous@exemple.ma"
                        className={`${styles.input}${
                          fieldErrors.email ? ` ${styles.inputInvalid}` : ""
                        }`}
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          clearFieldError("email");
                        }}
                        disabled={loading}
                        aria-invalid={fieldErrors.email ? true : undefined}
                        aria-describedby={
                          fieldErrors.email ? "login-email-error" : undefined
                        }
                      />
                    </div>
                    {fieldErrors.email && (
                      <p
                        className={styles.fieldError}
                        id="login-email-error"
                        role="alert"
                      >
                        <AlertCircle size={14} aria-hidden="true" />
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="login-password">
                      Mot de passe
                    </label>
                    <div className={styles.inputShell}>
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Votre mot de passe"
                        className={`${styles.input}${
                          fieldErrors.password ? ` ${styles.inputInvalid}` : ""
                        }`}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          clearFieldError("password");
                        }}
                        disabled={loading}
                        aria-invalid={fieldErrors.password ? true : undefined}
                        aria-describedby={
                          fieldErrors.password
                            ? "login-password-error"
                            : undefined
                        }
                      />
                      <button
                        type="button"
                        className={styles.toggle}
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                        aria-pressed={showPassword}
                        tabIndex={loading ? -1 : 0}
                      >
                        {showPassword ? (
                          <EyeOff size={19} aria-hidden="true" />
                        ) : (
                          <Eye size={19} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p
                        className={styles.fieldError}
                        id="login-password-error"
                        role="alert"
                      >
                        <AlertCircle size={14} aria-hidden="true" />
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.options}>
                  <label className={styles.remember} htmlFor="login-remember">
                    <input
                      id="login-remember"
                      type="checkbox"
                      className={styles.checkboxInput}
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      disabled={loading}
                    />
                    <span className={styles.checkbox} aria-hidden="true">
                      <svg
                        className={styles.checkboxMark}
                        width="13"
                        height="10"
                        viewBox="0 0 13 10"
                        fill="none"
                      >
                        <path
                          d="M1 5L4.5 8.5L12 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Se souvenir de moi
                  </label>

                  <Link href="/forgot-password" className={styles.forgot}>
                    Mot de passe oublié ?
                  </Link>
                </div>

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Connexion…
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </button>

                <p className={styles.footer}>
                  Accès sur invitation —{" "}
                  <Link href="/contact" className={styles.footerLink}>
                    contactez-nous
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
