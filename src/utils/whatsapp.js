// src/utils/whatsapp.js
import { WHATSAPP_NUMBER } from "./constants.js"

/**
 * Build a WhatsApp chat link with a default message
 */
export function buildWhatsAppLink(message = "Hello, I’d like to know more about your jewelry.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
