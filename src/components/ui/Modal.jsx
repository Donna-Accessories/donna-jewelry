import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * Premium Modal Component for Donna's Jewelry & Accessories
 * 
 * Features:
 * - Elegant backdrop with blur effect
 * - Smooth animations matching brand aesthetic
 * - Keyboard navigation (ESC to close)
 * - Click outside to close functionality
 * - Customizable sizes and styles
 * - Accessibility compliant
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {string} title - Modal title (optional)
 * @param {ReactNode} children - Modal content
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl', 'full'
 * @param {boolean} showHeader - Whether to show header with title and close button
 * @param {boolean} showCloseButton - Whether to show close button
 * @param {boolean} closeOnBackdrop - Whether clicking backdrop closes modal
 * @param {string} className - Additional CSS classes
 */
const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'md',
  showHeader = true,
  showCloseButton = true,
  closeOnBackdrop = true,
  className = ''
}) => {
  // Handle ESC key press to close modal
  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape' && isOpen && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((event) => {
    if (event.target === event.currentTarget && closeOnBackdrop && onClose) {
      onClose();
    }
  }, [closeOnBackdrop, onClose]);

  // Set up keyboard listeners and body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Add keyboard listener
      document.addEventListener('keydown', handleEscapeKey);
      
      // Focus trap - focus on modal when it opens
      const modalElement = document.getElementById('donna-modal');
      if (modalElement) {
        modalElement.focus();
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, handleEscapeKey]);

  // Size configurations matching brand spacing
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop with premium blur effect */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        id="donna-modal"
        className={`
          relative w-full ${sizeClasses[size]} 
          bg-white rounded-2xl shadow-2xl
          transform transition-all duration-300 ease-out
          max-h-[90vh] overflow-hidden
          border border-gray-100
          ${className}
        `}
        tabIndex="-1"
        style={{
          animation: isOpen ? 'modalSlideIn 0.3s ease-out' : 'modalSlideOut 0.3s ease-in'
        }}
      >
        {/* Header Section */}
        {showHeader && (title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/30">
            {/* Title */}
            {title && (
              <h2 
                id="modal-title"
                className="text-xl font-semibold text-gray-800 font-playfair"
              >
                {title}
              </h2>
            )}
            
            {/* Close Button */}
            {showCloseButton && onClose && (
              <button
                onClick={onClose}
                className="
                  ml-auto flex items-center justify-center 
                  w-8 h-8 rounded-full 
                  text-gray-400 hover:text-gray-600 
                  hover:bg-gray-100 
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-premium focus:ring-offset-1
                "
                aria-label="Close modal"
                type="button"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          {children}
        </div>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes modalSlideOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Modal Header Component - For consistent header styling
 */
export const ModalHeader = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

/**
 * Modal Body Component - For consistent content styling
 */
export const ModalBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

/**
 * Modal Footer Component - For consistent footer styling
 */
export const ModalFooter = ({ children, className = '' }) => (
  <div className={`
    flex items-center justify-end gap-3 
    p-6 border-t border-gray-100 bg-gray-50/30
    ${className}
  `}>
    {children}
  </div>
);

/**
 * Confirmation Modal - Pre-built modal for confirmations
 */
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary" // primary, danger
}) => {
  const buttonStyles = {
    primary: "bg-blue-premium hover:bg-blue-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      className="text-center"
    >
      <ModalBody>
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>
      </ModalBody>
      
      <ModalFooter>
        <button
          onClick={onClose}
          className="
            px-4 py-2 text-gray-600 
            border border-gray-300 rounded-lg
            hover:bg-gray-50 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-gray-300
          "
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm?.();
            onClose?.();
          }}
          className={`
            px-4 py-2 rounded-lg font-medium
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${buttonStyles[variant]}
          `}
        >
          {confirmText}
        </button>
      </ModalFooter>
    </Modal>
  );
};

/**
 * Loading Modal - For showing loading states
 */
export const LoadingModal = ({
  isOpen,
  message = "Loading...",
  showSpinner = true
}) => (
  <Modal
    isOpen={isOpen}
    size="sm"
    showHeader={false}
    showCloseButton={false}
    closeOnBackdrop={false}
  >
    <ModalBody className="text-center py-12">
      {showSpinner && (
        <div className="mb-4 flex justify-center">
          <div className="
            w-8 h-8 border-3 border-gold-primary border-t-transparent 
            rounded-full animate-spin
          "></div>
        </div>
      )}
      <p className="text-gray-600 font-medium">{message}</p>
    </ModalBody>
  </Modal>
);

/**
 * Image Preview Modal - For viewing jewelry images
 */
export const ImagePreviewModal = ({
  isOpen,
  onClose,
  imageUrl,
  altText,
  title
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="xl"
    className="bg-gray-50"
  >
    <ModalBody className="flex justify-center items-center min-h-[400px] p-2">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={altText || "Product image"}
          className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
        />
      ) : (
        <div className="
          flex items-center justify-center 
          w-full h-64 bg-gray-200 rounded-lg
        ">
          <p className="text-gray-500">No image available</p>
        </div>
      )}
    </ModalBody>
  </Modal>
);

export default Modal;