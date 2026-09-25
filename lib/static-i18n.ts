import translationsJson from "@/lib/static-i18n-data.json";

export type SiteLocale = "th" | "en" | "zh";

type DictionaryLocale = "en" | "zh-CN";
type Dictionaries = Record<DictionaryLocale, Record<string, string>>;

const dictionaries = translationsJson as Dictionaries;

export const localeConfig: Record<SiteLocale, { htmlLang: string; prefix: string; label: string }> = {
  th: { htmlLang: "th", prefix: "", label: "ภาษาไทย" },
  en: { htmlLang: "en", prefix: "/en", label: "English" },
  zh: { htmlLang: "zh-CN", prefix: "/zh", label: "简体中文" },
};

function decodeBasicHtmlEntities(value: string) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '\"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)));
}

export function normalizeI18nText(value: string) {
  return decodeBasicHtmlEntities(String(value || "")).replace(/\s+/g, " ").trim();
}

export function translateText(value: string, locale: SiteLocale) {
  if (locale === "th") return value;
  const key = normalizeI18nText(value);
  if (!key) return value;
  const dictionary = dictionaries[locale === "zh" ? "zh-CN" : "en"];
  return dictionary[key] || value;
}

function preserveWhitespace(source: string, translated: string) {
  const prefix = source.match(/^\s*/)?.[0] || "";
  const suffix = source.match(/\s*$/)?.[0] || "";
  return `${prefix}${translated}${suffix}`;
}

function isInternalHref(value: string) {
  return value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/assets/") && !value.startsWith("/legacy/") && !value.startsWith("/api/");
}

export function localizedHref(href: string, locale: SiteLocale) {
  if (locale === "th" || !isInternalHref(href)) return href;
  const prefix = localeConfig[locale].prefix;
  if (href === "/") return prefix;
  if (href.startsWith("/en/") || href === "/en" || href.startsWith("/zh/") || href === "/zh") return href;
  return `${prefix}${href}`;
}

export function stripLocalePrefix(pathname: string) {
  const raw = pathname || "/";
  const stripped = raw.replace(/^\/(?:en|zh)(?=\/|$)/, "");
  return stripped || "/";
}

export function localePath(pathname: string, locale: SiteLocale) {
  const clean = stripLocalePrefix(pathname);
  if (locale === "th") return clean;
  return clean === "/" ? localeConfig[locale].prefix : `${localeConfig[locale].prefix}${clean}`;
}

/**
 * Translate the already-authored Thai legacy HTML before it reaches the browser.
 * This deliberately does NOT mutate the DOM at runtime. It translates text nodes
 * and selected accessibility/form attributes, then rewrites internal links so
 * navigation stays inside the chosen language route.
 */
export function translateLegacyHtml(html: string, locale: SiteLocale) {
  if (locale === "th") return html;

  let output = html.replace(/>([^<>]+)</g, (full, rawText: string) => {
    const source = normalizeI18nText(rawText);
    if (!source) return full;
    const translated = translateText(source, locale);
    if (translated === source) return full;
    return `>${preserveWhitespace(rawText, translated)}<`;
  });

  output = output.replace(/\b(placeholder|title|aria-label|alt|value)=(['"])(.*?)\2/gi, (full, attr: string, quote: string, raw: string) => {
    const translated = translateText(raw, locale);
    return `${attr}=${quote}${translated}${quote}`;
  });

  output = output.replace(/\bhref=(['"])(\/[^'"#]*)\1/gi, (full, quote: string, href: string) => {
    return `href=${quote}${localizedHref(href, locale)}${quote}`;
  });

  // Also rewrite root-relative links that contain a hash/query.
  output = output.replace(/\bhref=(['"])(\/[^'"]*)\1/gi, (full, quote: string, href: string) => {
    return `href=${quote}${localizedHref(href, locale)}${quote}`;
  });

  return output;
}

export function translateLegacyJsonLd(raw: string, locale: SiteLocale) {
  if (locale === "th") return raw;
  try {
    const parsed = JSON.parse(raw);
    const walk = (value: unknown): unknown => {
      if (Array.isArray(value)) return value.map(walk);
      if (value && typeof value === "object") {
        const result: Record<string, unknown> = {};
        for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
          if (key === "url" || key === "@id" || key === "image" || key === "logo" || key === "sameAs" || key === "hasMap") result[key] = child;
          else if (key === "inLanguage") result[key] = localeConfig[locale].htmlLang;
          else result[key] = walk(child);
        }
        return result;
      }
      if (typeof value === "string") return translateText(value, locale);
      return value;
    };
    return JSON.stringify(walk(parsed));
  } catch {
    return raw;
  }
}
