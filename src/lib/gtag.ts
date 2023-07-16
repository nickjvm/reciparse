export default function gtag(name: string, properties?: {}) {
  const url = new URL(window.location.href)

  const finalProperties = {
    page_location: `${url.origin}${url.pathname}`,
    ...properties
  }

  if (window.gtag) {
    window.gtag('event', name, finalProperties)
  }
}