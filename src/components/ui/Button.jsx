import React from 'react';

/**
 * Reusable Button Component for Donna's Jewelry & Accessories
 * 
 * Provides consistent styling across the application with multiple variants
 * following the brand's gold and blue color scheme
 * 
 * @param {Object} props - Button props
 * @param {React.ReactNode} props.children - Button content (text, icons, etc.)
 * @param {string} props.variant - Button style variant ('primary', 'secondary', 'outline', 'ghost')
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onClick - Click handler function
 * @param {string} props.type - HTML button type ('button', 'submit', 'reset')
 * @param {Object} props.rest - Any other HTML button attributes
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...rest
}) => {
  
  /**
   * Get base button classes that apply to all variants
   */
  const getBaseClasses = () => {
    return [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed'
    ].join(' ');
  };

  /**
   * Get size-specific classes
   */
  const getSizeClasses = () => {
    const sizeMap = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    return sizeMap[size] || sizeMap.md;
  };

  /**
   * Get variant-specific classes for styling
   */
  const getVariantClasses = () => {
    const variantMap = {
      // Primary button - Gold background
      primary: [
        'bg-yellow-500', // Using Tailwind's built-in yellow as gold equivalent
        'text-white',
        'border-transparent',
        'hover:bg-yellow-600',
        'focus:ring-yellow-500',
        'shadow-sm',
        'hover:shadow-md'
      ].join(' '),

      // Secondary button - Blue background
      secondary: [
        'bg-blue-600', // Premium blue
        'text-white',
        'border-transparent',
        'hover:bg-blue-700',
        'focus:ring-blue-500',
        'shadow-sm',
        'hover:shadow-md'
      ].join(' '),

      // Outline button - Gold border
      outline: [
        'bg-transparent',
        'text-yellow-600',
        'border-2',
        'border-yellow-500',
        'hover:bg-yellow-500',
        'hover:text-white',
        'focus:ring-yellow-500'
      ].join(' '),

      // Ghost button - Minimal styling
      ghost: [
        'bg-transparent',
        'text-gray-700',
        'border-transparent',
        'hover:bg-gray-100',
        'focus:ring-gray-500'
      ].join(' ')
    };

    return variantMap[variant] || variantMap.primary;
  };

  /**
   * Combine all classes for the button
   */
  const buttonClasses = [
    getBaseClasses(),
    getSizeClasses(),
    getVariantClasses(),
    className
  ].filter(Boolean).join(' ');

  /**
   * Handle click events - prevent clicks when disabled or loading
   */
  const handleClick = (event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(event);
    }
  };

  /**
   * Loading spinner component
   */
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...rest}
    >
      {/* Show loading spinner when loading */}
      {loading && <LoadingSpinner />}
      
      {/* Button content */}
      {children}
    </button>
  );
};

export default Button;