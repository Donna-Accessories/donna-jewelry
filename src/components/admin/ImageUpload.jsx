import React from 'react';

const ImageUpload = () => {
	return (
		<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
			<h2 className="text-2xl font-bold mb-6 text-gold-primary">Upload Product Image</h2>
			<input type="file" className="input-premium mb-4" />
			<button className="btn-primary w-full">Upload</button>
		</div>
	);
};

export default ImageUpload;
