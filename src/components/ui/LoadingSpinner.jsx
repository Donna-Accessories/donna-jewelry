import React from 'react';

// Temporary comment to force a refresh
const LoadingSpinner = ({ id = 'loading-spinner', className = '' }) => (
	<div
		id={id}
		className={`${className} inline-block w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin`}
		role="status"
		aria-label="Loading"
	/>
);

export default LoadingSpinner;
