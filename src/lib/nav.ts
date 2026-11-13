/**
 * Site menu. Addresses are fixed in code; the visible labels come from each
 * page's "Menu Label" field (content/pages/<slug>.json -> menuLabel), with
 * these defaults as a fallback when a label is left blank.
 */
export const NAV_MAX = 14; // keep in sync with navLabelLimit in tina/config.ts

export const NAV = [
  { key: "home", href: "/", fallback: "Home" },
  { key: "about", href: "/about", fallback: "About" },
  { key: "credentials", href: "/credentials", fallback: "Credentials" },
  { key: "services", href: "/services", fallback: "Services" },
  { key: "industries", href: "/industries", fallback: "Industries" },
  { key: "contact", href: "/contact", fallback: "Contact" },
] as const;

export type MenuLabels = Record<string, string | null | undefined>;

/** Label for one page, falling back to the default name. */
export function labelFor(key: string, labels?: MenuLabels) {
  const raw = labels?.[key];
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return NAV.find((n) => n.key === key)?.fallback ?? key;
}

/** Menu items with labels resolved. */
export function navItems(labels?: MenuLabels) {
  return NAV.map((n) => ({ ...n, label: labelFor(n.key, labels) }));
}
