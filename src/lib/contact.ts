/** ANDF contact details: one source of truth for the whole site (from anewdayfoundation.net). */
export const ORG = {
  name: "A New Day Foundation",
  shortName: "ANDF",
  email: "info@anewdayfoundation.net",
  phone: "(424) 241-3623",
  phoneHref: "tel:+14242413623",
  ein: "82-1965126",
  address: {
    street: "20058 Ventura Blvd. #326",
    city: "Woodland Hills",
    region: "CA",
    postalCode: "91364",
  },
  youtube: "https://www.youtube.com/@ANewDayFoundation",
  facebook: "https://www.facebook.com/anewdayfoundationinc/",
  instagram: "https://www.instagram.com/anewdayfoundation/",
  officialSite: "https://anewdayfoundation.net",
} as const;

/** Hosted donation pages ANDF already uses (no backend needed). */
export const DONATION_LINKS = {
  card: "https://www.convergepay.com/hosted-payments?ssl_txn_auth_token=2cKbf6rLTba9IxK4THt02wAAAYeVjUZg",
  paypal: "https://www.paypal.com/ncp/payment/CDM6RTBX534MY",
} as const;

/** Builds a mailto: link to ANDF with a subject and a readable "Label: value" body. */
export function mailtoHref(subject: string, lines: (string | [string, string | undefined | null])[] = []) {
  const body = formatLines(lines).join("\n");
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${ORG.email}?${params.join("&")}`;
}

/** Turns "Label: value" pairs into lines, skipping empty answers; plain strings pass through (use "" for a blank line). */
export function formatLines(lines: (string | [string, string | undefined | null])[]) {
  return lines
    .map((l) => (Array.isArray(l) ? (l[1] ? `${l[0]}: ${l[1]}` : null) : l))
    .filter((l): l is string => l !== null);
}
