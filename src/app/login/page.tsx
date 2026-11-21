"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const user = result.user;
    const isMainAdmin =
      user.role === "ADMIN" &&
      user.email.trim().toLowerCase() === "arrimaniusothmane@gmail.com";
    if (isMainAdmin) router.push("/admin");
    else if (user.role === "SELLER" || user.role === "AGENT")
      router.push("/seller");
    else router.push("/buyer");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between bg-[#111111] px-12 py-12 text-white lg:flex">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white text-[#111111]">
            <Building2 className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            DarEstate
          </span>
        </Link>

        <div className="max-w-md">
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight xl:text-5xl">
            Votre espace pour suivre chaque projet immobilier.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/70">
            Favoris, visites, offres et annonces — un seul accès, clair et
            sécurisé.
          </p>
        </div>

        <p className="inline-flex items-center gap-2 text-sm text-white/60">
          <ShieldCheck className="size-4" />
          Connexion sécurisée · Données protégées
        </p>
      </aside>

      <main className="flex flex-col bg-white px-6 py-10 sm:px-10 lg:px-16 lg:py-12">
        <div className="mb-10 flex items-center justify-between lg:mb-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#111111] transition-opacity hover:opacity-70 lg:hidden"
          >
            <Building2 className="size-4" />
            DarEstate
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-[#111111]"
          >
            <ArrowLeft className="size-3.5" />
            Accueil
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center">
          <h2 className="text-3xl font-semibold tracking-tight text-[#111111]">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Entrez votre e-mail et votre mot de passe.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-[#111111]"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#111111]"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="vous@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-[#111111] outline-none placeholder:text-neutral-400 focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/15"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#111111]"
                >
                  Mot de passe
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-[#111111] hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 pr-11 text-sm text-[#111111] outline-none placeholder:text-neutral-400 focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-[#111111]"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-500">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-medium text-[#111111] underline-offset-2 hover:underline"
            >
              Voir les options
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
