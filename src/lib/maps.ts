/** Keyless Google Maps embed URL (the same approach as HackMTY's location map). */
export function googleMapsEmbedUrl(query: string, zoom = 16): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=m&z=${zoom}&output=embed&iwloc=near`;
}

/** Google Maps search link that opens the place in the Maps app or site. */
export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
