import React, { useState } from 'react';
import { useAdminContext } from '../../contexts/AdminContext.jsx';

const AdminLogin = () => {
	const { login, error } = useAdminContext();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [success, setSuccess] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		const result = login(email, password);
		setSuccess(result);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-gold-primary">Admin Login</h2>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					className="input-premium mb-4"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					className="input-premium mb-4"
					required
				/>
				{error && <div className="text-red-600 mb-4">{error}</div>}
				{success && <div className="text-green-600 mb-4">Login successful!</div>}
				<button type="submit" className="btn-primary w-full">Login</button>
			</form>
		</div>
	);
};

export default AdminLogin;
