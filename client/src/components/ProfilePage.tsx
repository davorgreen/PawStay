import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
	const { user, setUser } = useUser();
	const [username, setUsername] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const apiUrl = import.meta.env.VITE_API_URL;

	useEffect(() => {
		if (!user) {
			navigate('/login');
		} else {
			setUsername(user.username);
			setEmail(user.email);
		}
	}, [user, navigate]);

	const handleUpdateProfile = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await axios.put(`/${apiUrl}/users/${user?._id}`, {
				username,
				email,
			});
			setUser(res.data);
			localStorage.setItem('user', JSON.stringify(res.data));
			toast.success('Profile updated successfully!');
			navigate('/');
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex justify-center items-center w-full h-screen bg-blue-300'>
			<div className='flex flex-col justify-center items-center w-full max-w-md p-6 bg-blue-50 rounded-lg shadow-md'>
				<Link
					to={'/'}
					className='text-md text-blue-500 mb-4 underline font-semibold'>
					Back to HOME PAGE
				</Link>
				<h1 className='text-3xl font-bold text-center text-blue-600 mb-6'>
					Edit Profile
				</h1>
				{error && <p className='text-red-500 text-lg'>{error}</p>}
				<form
					onSubmit={handleUpdateProfile}
					className='space-y-4 w-full'>
					<div>
						<label
							htmlFor='username'
							className='block text-lg font-medium text-blue-600'>
							Username
						</label>
						<input
							type='text'
							id='username'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							required
						/>
					</div>
					<div>
						<label
							htmlFor='email'
							className='block text-lg font-medium text-blue-600'>
							Email
						</label>
						<input
							type='email'
							id='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							required
						/>
					</div>
					<div className='flex justify-center'>
						<button
							type='submit'
							className='w-full text-xl py-2 px-4 bg-blue-600 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
							disabled={loading}>
							{loading ? 'Saving...' : 'Update Profile'}
						</button>
					</div>
				</form>

				<div className='mt-4 text-center'>
					<p className='text-sm text-gray-500'>
						User ID: {user?._id}
					</p>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
