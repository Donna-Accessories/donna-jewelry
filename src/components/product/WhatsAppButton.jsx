// src/components/product/WhatsAppButton.jsx
import React from "react"

export default function WhatsAppButton({ phone = "+233248628880", message = "Hello, I’d like to know more about your jewelry." }) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-transform transform hover:scale-110"
    >
      {/* WhatsApp Icon */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
        <path d="M16.635 13.397c-.278-.139-1.64-.808-1.893-.9-.254-.093-.44-.139-.627.14-.185.278-.72.9-.882 1.085-.163.185-.325.208-.603.07-.278-.139-1.176-.433-2.24-1.38-.828-.737-1.387-1.646-1.55-1.924-.163-.278-.017-.428.123-.566.127-.126.278-.325.417-.488.139-.163.185-.278.278-.463.093-.185.047-.348-.023-.488-.07-.14-.627-1.51-.859-2.065-.226-.542-.457-.468-.627-.477-.163-.007-.348-.009-.533-.009-.185 0-.488.07-.744.348-.255.278-.975.95-.975 2.317 0 1.366.999 2.683 1.138 2.87.14.185 1.963 3.004 4.755 4.208.665.287 1.184.458 1.588.586.667.212 1.276.182 1.756.111.536-.08 1.64-.669 1.873-1.315.232-.647.232-1.2.162-1.315-.07-.116-.255-.185-.533-.325z" />
        <path d="M12.004 2C6.476 2 2 6.474 2 12c0 2.116.632 4.08 1.818 5.758L2 22l4.386-1.786A9.942 9.942 0 0012.004 22C17.532 22 22 17.526 22 12S17.532 2 12.004 2zm0 18c-1.928 0-3.73-.564-5.26-1.635l-.376-.257-2.598 1.06.694-2.71-.18-.279A7.96 7.96 0 014.004 12c0-4.411 3.588-8 8-8 4.412 0 8 3.589 8 8s-3.588 8-8 8z" />
      </svg>
    </a>
  )
}
