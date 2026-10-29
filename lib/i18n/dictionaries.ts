/**
 * Common UI strings used across the site header, footer, call bar, and forms.
 * Page-specific body copy stays inline inside each page file.
 * Add a new locale by adding a matching entry in each `Record<Locale, …>` below.
 */

import type { Locale } from "@/lib/i18n/routes";

// ─── Navigation ───────────────────────────────────────────────────────────────

export const navLinks: Record<Locale, Array<{ href: string; label: string }>> = {
  en: [
    { href: "/listings", label: "See available homes" },
    { href: "/stop-foreclosure", label: "Stop a foreclosure" },
    { href: "/take-over-payments", label: "Take over payments" },
    { href: "/about", label: "About us" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact us" },
  ],
  es: [
    { href: "/es/ejecucion-hipotecaria", label: "Ejecución hipotecaria" },
    { href: "/es/oferta-en-efectivo", label: "Oferta de contado" },
    { href: "/es/tomar-los-pagos", label: "Tomar los pagos" },
    { href: "/es/nosotros", label: "Nosotros" },
    { href: "/blog", label: "Artículos" },
    { href: "/es/contacto", label: "Contacto" },
  ],
};

export const navStrings: Record<Locale, { skip: string; menu: string; logoAlt: string; navLabel: string; mobileNavLabel: string; switchTo: string; switchToPath: string }> = {
  en: {
    skip: "Skip to content",
    menu: "Menu",
    logoAlt: "Vamos Properties",
    navLabel: "Primary",
    mobileNavLabel: "Mobile",
    switchTo: "Español",
    switchToPath: "/es",
  },
  es: {
    skip: "Saltar al contenido",
    menu: "Menú",
    logoAlt: "Vamos Properties",
    navLabel: "Principal",
    mobileNavLabel: "Móvil",
    switchTo: "English",
    switchToPath: "/",
  },
};

// ─── Footer ───────────────────────────────────────────────────────────────────

export const footerStrings: Record<Locale, {
  tagline: string;
  hoursLabel: string;
  helpHeading: string;
  citiesHeading: string;
  langHeading: string;
  disclaimer: string;
  links: Array<{ href: string; label: string }>;
}> = {
  en: {
    tagline: "Local buyers for homeowners in Maricopa County, Arizona. Call 8:00 a.m. to 7:00 p.m., seven days.",
    hoursLabel: "How we can help",
    helpHeading: "How we can help",
    citiesHeading: "Cities",
    langHeading: "En español",
    disclaimer:
      "Asking for an offer does not obligate you to sell. A cash price is usually below a listed price because the house is bought as-is and the closing costs are covered. Taking over payments can leave the loan in your name. Have a lawyer review anything you sign. This site is not legal advice.",
    links: [
      { href: "/cash-offer", label: "Get a cash offer" },
      { href: "/stop-foreclosure", label: "Stop a foreclosure in Phoenix" },
      { href: "/take-over-payments", label: "Take over the payments" },
      { href: "/guides", label: "Selling guides" },
      { href: "/blog", label: "Blog" },
      { href: "/about", label: "Patrick and Jaime" },
      { href: "/listings", label: "See available homes" },
    ],
  },
  es: {
    tagline: "Compradores locales para dueños de casa en el condado de Maricopa. Llame de 8:00 a.m. a 7:00 p.m., los siete días.",
    hoursLabel: "Cómo podemos ayudar",
    helpHeading: "Cómo podemos ayudar",
    citiesHeading: "Ciudades",
    langHeading: "También en inglés",
    disclaimer:
      "Pedir una oferta no lo obliga a vender. Un precio de contado suele ser menor que el de una casa listada, porque se compra tal como está y los costos de cierre van incluidos. Tomar los pagos puede dejar el préstamo a su nombre. Pida a un abogado que revise lo que firme. Este sitio no es un consejo legal.",
    links: [
      { href: "/es/ejecucion-hipotecaria", label: "Detener la ejecución hipotecaria" },
      { href: "/es/oferta-en-efectivo", label: "Oferta de contado" },
      { href: "/es/tomar-los-pagos", label: "Tomar los pagos" },
      { href: "/es/nosotros", label: "Patrick y Jaime" },
      { href: "/blog", label: "Artículos, en inglés" },
    ],
  },
};

// ─── Call bar ─────────────────────────────────────────────────────────────────

export const callBarStrings: Record<Locale, { label: string; form: string }> = {
  en: { label: "Call or text", form: "Get an offer" },
  es: { label: "Llame o escriba", form: "Pedir oferta" },
};

// ─── Lead form ────────────────────────────────────────────────────────────────

export const formStrings: Record<Locale, {
  title: string;
  subtitle: string;
  address: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  messagePlaceholder: string;
  situation: string;
  path: string;
  consent: string;
  submit: string;
  submitting: string;
}> = {
  en: {
    title: "Tell us about the house",
    subtitle: "This takes under a minute. Patrick or Jaime reply the same day.",
    address: "Property address",
    name: "Your name",
    phone: "Mobile number",
    email: "Email address",
    message: "What is going on, in your words",
    messagePlaceholder: "A few lines are enough. Include the notice date if you have it.",
    situation: "What is happening",
    path: "How should we help",
    consent: "I agree that Vamos Properties LLC may call and text me about my house, including with automated messages. Message and data rates may apply. Consent is not required to sell or to receive an offer.",
    submit: "Get your cash offer",
    submitting: "Sending…",
  },
  es: {
    title: "Cuéntenos de la casa",
    subtitle: "Menos de un minuto. Patrick o Jaime responden el mismo día.",
    address: "Dirección de la propiedad",
    name: "Su nombre",
    phone: "Celular",
    email: "Correo electrónico",
    message: "Qué está pasando, en sus palabras",
    messagePlaceholder: "Unas líneas son suficientes. Incluya la fecha del aviso si la tiene.",
    situation: "Qué está pasando",
    path: "Cómo podemos ayudar",
    consent:
      "Acepto que Vamos Properties LLC me llame y me envíe mensajes de texto sobre mi casa, incluso con mensajes automáticos. Pueden aplicarse tarifas de mensajes y datos. El consentimiento no es necesario para vender ni para recibir una oferta.",
    submit: "Pedir mi oferta de contado",
    submitting: "Enviando…",
  },
};

// ─── Theme toggle ─────────────────────────────────────────────────────────────

export const themeStrings: Record<Locale, { light: string; dark: string }> = {
  en: { light: "Switch to light mode", dark: "Switch to dark mode" },
  es: { light: "Modo claro", dark: "Modo oscuro" },
};
