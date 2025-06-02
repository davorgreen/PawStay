import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { User } from '../context/UserContext';
import { toast } from 'react-toastify';

type Accommodation = {
	name: string;
	type: string;
	city: string;
	address: string;
	distance: string;
	title: string;
	description: string;
	cheapestPrice: number;
	featured: boolean;
	rating: number;
};

const AdminDashboard = () => {
	const [activeTab, setActiveTab] = useState<
		'users' | 'accommodation'
	>('users');
	const [users, setUsers] = useState<User>({
		username: 'Username',
		email: 'username@gmail.com',
		isAdmin: false,
		_id: '',
	});
	const [accommodation, setAccommodation] = useState<Accommodation>({
		name: 'Hotel Auroreas Light',
		type: 'Hotel',
		city: 'Subotica',
		address: 'Brace Radic',
		distance: '500',
		title: 'Best Hotel in country',
		description: 'hotel description',
		cheapestPrice: 100,
		featured: false,
		rating: 4.9,
	});
	const inputStyle =
		'border p-2 rounded w-full bg-white text-gray-700';
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { user } = useUser();
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [filtered, setFiltered] = useState<User[]>([]);
	const [loadingForm, setLoadingForm] = useState<boolean>(false);

	//allUsers
	const fetchData = async () => {
		setLoading(true);
		try {
			const res = await axios.get<User[]>('/api/users');
			const filteredUsers = res.data.filter((u: User) => {
				return u._id !== user?._id;
			});
			setFiltered(filteredUsers);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		if (user) {
			fetchData();
		}
	}, [user]);

	const handleUpdateUserProfile = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		setLoadingForm(true);
		if (!users) {
			setError('No user selected');
			setLoading(false);
			return;
		}

		try {
			const res = await axios.put(`/api/users/${users._id}`, {
				username: users.username,
				email: users.email,
				isAdmin: users.isAdmin,
			});
			fetchData();
			toast.success('Profile updated successfully!');
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			}
		} finally {
			setLoadingForm(false);
		}
	};

	return (
		<div className='min-h-screen bg-blue-300 p-6'>
			<div className='max-w-6xl mx-auto shadow-lg rounded-lg bg-white p-6'>
				<Link to={'/'}>
					<button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-500'>
						Back To Home Page
					</button>
				</Link>
				<h1 className='text-3xl font-bold mb-6 text-center text-blue-500'>
					Admin Dashboard
				</h1>
				<div className='flex justify-center mb-6 space-x-4'>
					<button
						onClick={() => setActiveTab('users')}
						className={`px-4 py-2 rounded ${
							activeTab === 'users'
								? 'bg-blue-600 text-white hover:bg-blue-800'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
						}`}>
						Edit User
					</button>
					<button
						onClick={() => setActiveTab('accommodation')}
						className={`px-4 py-2 rounded ${
							activeTab === 'accommodation'
								? 'bg-blue-600 text-white hover:bg-blue-800'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
						}`}>
						Edit Accommodation
					</button>
				</div>

				{activeTab === 'users' && (
					<form
						onSubmit={handleUpdateUserProfile}
						className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label className='block mb-1'>Username</label>
							<input
								className={inputStyle}
								value={users.username}
								onChange={(e) => {
									setUsers({ ...users, username: e.target.value });
									setShowDropdown(true);
								}}
								placeholder='Unesi username!'
								required
							/>

							{showDropdown && filtered.length > 0 && (
								<ul className='absolute  z-10 w-40 bg-white border rounded mt-1 shadow'>
									{filtered.map((item, index) => (
										<li
											key={index}
											className='p-2 hover:bg-blue-200 cursor-pointer'
											onClick={() => {
												setUsers(item);
												setShowDropdown(false);
											}}>
											{`${item.username}`}
										</li>
									))}
								</ul>
							)}
						</div>
						<div>
							<label className='block mb-1'>Email</label>
							<input
								className={inputStyle}
								value={users.email}
								onChange={(e) =>
									setUsers({ ...users, email: e.target.value })
								}
							/>
						</div>
						<div>
							<label className='block mb-1'>Is Admin</label>
							<select
								className={inputStyle}
								value={users.isAdmin ? 'true' : 'false'}
								onChange={(e) =>
									setUsers({
										...users,
										isAdmin: e.target.value === 'true',
									})
								}>
								<option value='false'>No</option>
								<option value='true'>Yes</option>
							</select>
						</div>
						<div className='block mt-6'>
							<input
								className={inputStyle}
								value={users._id}
								readOnly
							/>
						</div>
						<div className='md:col-span-2 text-right mt-4'>
							<button
								type='submit'
								className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800'>
								Save User
							</button>
						</div>
					</form>
				)}

				{activeTab === 'accommodation' && (
					<form className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label className='block mb-1'>Name</label>
							<input
								className={inputStyle}
								value={accommodation.name}
								onChange={(e) =>
									setAccommodation({
										...accommodation,
										name: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className='block mb-1'>Type</label>
							<input
								className={inputStyle}
								value={accommodation.type}
								onChange={(e) =>
									setAccommodation({
										...accommodation,
										type: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className='block mb-1'>City</label>
							<input
								className={inputStyle}
								value={accommodation.city}
								onChange={(e) =>
									setAccommodation({
										...accommodation,
										city: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className='block mb-1'>Address</label>
							<input
								className={inputStyle}
								value={accommodation.address}
								onChange={(e) =>
									setAccommodation({
										...accommodation,
										address: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className='block mb-1'>Distance</label>
							<input
								className={inputStyle}
								value={accommodation.distance}
								onChange={(e) =>
									setAccommodation({
										...accommodation,
										distance: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className='block mb-1'>Title</label>
							<input
								className={inputStyle}
								value={accommodation.title}
								onChange={(e) =>
									setAccommodation({
										...accommodation,
										title: e.target.value,
									})
								}
							/>
						</div>
						<div className='md:col-span-2'>
							<label className='block mb-1'>Description</label>
							<textarea
								className={inputStyle}
								value={accommodation.description}
								onChange={(e) =>
									setAccommodation({
										...accommodation,
										description: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className='block mb-1'>Cheapest Price</label>
							<input
								type='number'
								className={inputStyle}
								value={accommodation.cheapestPrice}
								onChange={(e) =>
									setAccommodation({
										...accommodation,
										cheapestPrice: Number(e.target.value),
									})
								}
							/>
						</div>
						<div>
							<label className='block mb-1'>Rating</label>
							<input
								type='number'
								step='0.1'
								className={inputStyle}
								value={accommodation.rating}
								onChange={(e) =>
									setAccommodation({
										...accommodation,
										rating: Number(e.target.value),
									})
								}
							/>
						</div>
						<div>
							<label className='block mb-1'>Featured</label>
							<select
								className={inputStyle}
								value={accommodation.featured ? 'true' : 'false'}
								onChange={(e) =>
									setAccommodation({
										...accommodation,
										featured: e.target.value === 'true',
									})
								}>
								<option value='false'>No</option>
								<option value='true'>Yes</option>
							</select>
						</div>
						<div className='md:col-span-2 text-right mt-4'>
							<button
								type='submit'
								disabled={loadingForm}
								className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800'>
								{loadingForm ? 'Saving...' : 'Save Accommodation'}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
};

export default AdminDashboard;
