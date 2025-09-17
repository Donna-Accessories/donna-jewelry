import React from 'react';

const ProductForm = () => {
	return (
		<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
			<h2 className="text-2xl font-bold mb-6 text-gold-primary">Add/Edit Product</h2>
			<form>
				<input className="input-premium mb-4" placeholder="Product Title" />
				<input className="input-premium mb-4" placeholder="Price" />
				<textarea className="input-premium mb-4" placeholder="Description" />
				<input className="input-premium mb-4" placeholder="Category" />
				<button className="btn-primary w-full">Save Product</button>
			</form>
		</div>
	);
};

export default ProductForm;
