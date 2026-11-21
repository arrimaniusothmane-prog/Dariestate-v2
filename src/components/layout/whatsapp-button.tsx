"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { defaultWhatsAppMessage, whatsappHref } from "@/lib/agency";

export function WhatsAppButton() {
  const pathname = usePathname();
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password"
  ) {
    return null;
  }

  return (
    <a
      href={whatsappHref(defaultWhatsAppMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Écrire sur WhatsApp"
      className="fixed bottom-28 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-[0_10px_24px_rgba(18,140,126,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E] md:bottom-6"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
