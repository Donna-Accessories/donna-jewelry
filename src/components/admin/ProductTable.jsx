import React from 'react';

const ProductTable = () => {
	return (
				<div
					className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto overflow-x-auto px-4"
					style={{ WebkitOverflowScrolling: 'touch' }}
				>
			<h2 className="text-2xl font-bold mb-6 text-gold-primary">Product List</h2>
			<table className="min-w-[640px] w-full border">
				<thead>
					<tr>
						<th className="border px-4 py-2">Title</th>
						<th className="border px-4 py-2">Price</th>
						<th className="border px-4 py-2">Category</th>
						<th className="border px-4 py-2">Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="border px-4 py-2">Sample Product</td>
						<td className="border px-4 py-2">$999</td>
						<td className="border px-4 py-2">Rings</td>
						<td className="border px-4 py-2">
							<button className="btn-secondary mr-2">Edit</button>
							<button className="btn-primary">Delete</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default ProductTable;
