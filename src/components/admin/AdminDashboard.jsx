import React from 'react';
import { useAdminContext } from '../../contexts/AdminContext.jsx';

const AdminDashboard = () => {
	const { isAuthenticated, logout } = useAdminContext();
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
				<h2 className="text-3xl font-bold mb-6 text-gold-primary">Admin Dashboard</h2>
				<p className="mb-4">Welcome, Donna!</p>
				<p className="mb-4">You are {isAuthenticated ? 'logged in' : 'not logged in'} as admin.</p>
				<button className="btn-secondary" onClick={logout}>Logout</button>
			</div>
		</div>
	);
};

export default AdminDashboard;
