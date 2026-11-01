const WHATSAPP_NUMBER = '9779851248173'

export function getWhatsAppHref(message?: string) {
  const text = message?.trim()
  return text
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`
}
