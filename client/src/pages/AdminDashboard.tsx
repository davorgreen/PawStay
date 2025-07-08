import axios, { all } from 'axios';
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
	_id: string;
};

const AdminDashboard = () => {
	const initialCreateUser: User = {
		username: '',
		email: '',
		isAdmin: false,
		_id: '',
		password: '',
	};
	const initialEditUser: User = {
		username: 'Username',
		email: 'username@gmail.com',
		isAdmin: false,
		_id: '',
	};
	const initialCreateAccommodation: Accommodation = {
		name: '',
		type: '',
		city: '',
		address: '',
		distance: '',
		title: '',
		description: '',
		cheapestPrice: 0,
		featured: false,
		rating: 0,
		_id: '',
	};
	const initialEditAccommodation: Accommodation = {
		name: 'Enter name',
		type: 'Hotel',
		city: 'City',
		address: 'Street',
		distance: '500',
		title: 'Best Hotel in country',
		description: 'hotel description',
		cheapestPrice: 100,
		featured: false,
		rating: 4.9,
		_id: '',
	};
	const [users, setUsers] = useState<User>(initialCreateUser);
	const [accommodation, setAccommodation] = useState<Accommodation>(
		initialCreateAccommodation
	);
	const [activeTab, setActiveTab] = useState<
		'users' | 'accommodation'
	>('users');
	const [formMode, setFormMode] = useState<'create' | 'edit'>(
		'create'
	);

	const inputStyle =
		'border p-2 rounded w-full bg-white text-gray-700';
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { user } = useUser();
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [allUsers, setAllUsers] = useState<User[]>([]);
	const [filtered, setFiltered] = useState<User[]>([]);
	const [loadingForm, setLoadingForm] = useState<boolean>(false);
	const [allHotels, setAllHotels] = useState<Accommodation[]>([]);
	const [filteredAcc, setFilteredAcc] = useState<Accommodation[]>([]);
	const [images, setImages] = useState<File[]>([]);
	const apiUrl = import.meta.env.VITE_API_URL;

	//upload images
	const handleImageChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.files) {
			setImages(Array.from(e.target.files));
		}
	};

	useEffect(() => {
		if (activeTab === 'users') {
			if (formMode === 'edit') {
				setUsers(initialEditUser);
			} else {
				setUsers(initialCreateUser);
			}
		} else if (activeTab === 'accommodation') {
			if (formMode === 'edit') {
				setAccommodation(initialEditAccommodation);
			} else {
				setAccommodation(initialCreateAccommodation);
			}
		}
		setShowDropdown(false);
	}, [formMode, activeTab]);

	//allUsers
	const fetchUsers = async () => {
		setLoading(true);
		try {
			const res = await axios.get<User[]>(`${apiUrl}/users`, {
				withCredentials: true,
			});
			const filteredUsers = res.data.filter((u: User) => {
				return u._id !== user?._id;
			});
			setAllUsers(filteredUsers);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		if (user) {
			fetchUsers();
		}
	}, [user]);

	//allAccommodation
	const fetchHotels = async () => {
		setLoadingForm(true);
		try {
			const res = await axios.get(`${apiUrl}/hotels`, {
				withCredentials: true,
			});
			setAllHotels(res.data);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			}
		} finally {
			setLoadingForm(false);
		}
	};

	//allAccommodation
	useEffect(() => {
		fetchHotels();
	}, []);

	//userProfileUpdate
	const handleUpdateOrCreateUserProfile = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		setLoadingForm(true);
		try {
			if (formMode === 'create') {
				await axios.post(
					`${apiUrl}/auth/register`,
					{
						username: users.username,
						email: users.email,
						password: users.password,
						isAdmin: users.isAdmin,
					},
					{
						withCredentials: true,
					}
				);
				toast.success('User created successfully!');
				fetchUsers();
			} else {
				if (!users) {
					setError('No user selected');
					setLoading(false);
					return;
				}
			}
			await axios.put(
				`${apiUrl}/users/${users._id}`,
				{
					username: users.username,
					email: users.email,
					isAdmin: users.isAdmin,
				},
				{ withCredentials: true }
			);
			fetchUsers();
			toast.success('Profile updated successfully!');
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			}
		} finally {
			setLoadingForm(false);
		}
	};

	// function to convert file to Base64 format
	const getBase64 = (file: File) => {
		return new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	//accommodationUpdate
	const handleUpdateOrCreateAccommodation = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		setLoadingForm(true);
		try {
			const imageBase64: string[] = [];

			for (const file of images) {
				const base64 = await getBase64(file);
				imageBase64.push(base64);
			}
			const { _id, ...rest } = accommodation;
			const dataToSend = {
				...rest,
				photos: imageBase64,
			};
			console.log(accommodation);
			if (formMode === 'create') {
				await axios.post(`${apiUrl}/hotels`, dataToSend, {
					withCredentials: true,
				});
				toast.success('Accommodation created successfully!');
				fetchHotels();
			} else {
				if (!accommodation._id) {
					setError('No accommodation selected!');
					setLoadingForm(false);
					return;
				}
				await axios.put(
					`${apiUrl}/hotels/${accommodation._id}`,
					dataToSend,
					{
						withCredentials: true,
					}
				);
				toast.success('Accommodation updated successfully!');
				fetchHotels();
			}
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			}
		} finally {
			setLoadingForm(false);
		}
	};

	//deleteUser or deleteAcc
	const handleDelete = async (id: string, type: string) => {
		if (!id || !type) {
			toast.warn('Missing ID or type');
			return;
		}
		setLoadingForm(true);
		try {
			if (type === 'user') {
				await axios.delete(`${apiUrl}/users/${id}`, {
					withCredentials: true,
				});
				toast.success('User deleted successfully');
				fetchUsers();
				setUsers({
					username: 'Username',
					email: 'username@gmail.com',
					isAdmin: false,
					_id: '',
				});
			} else if (type === 'accommodation') {
				await axios.delete(`${apiUrl}/hotels/${id}`, {
					withCredentials: true,
				});
				toast.success('Accommodation deleted successfully');
				fetchHotels();
				setAccommodation({
					name: 'Enter name',
					type: 'Hotel',
					city: 'City',
					address: 'Street',
					distance: '500',
					title: 'Best Hotel in country',
					description: 'hotel description',
					cheapestPrice: 100,
					featured: false,
					rating: 4.9,
					_id: '',
				});
			} else {
				toast.error('Unknown type');
			}
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
						User
					</button>
					<button
						onClick={() => setActiveTab('accommodation')}
						className={`px-4 py-2 rounded ${
							activeTab === 'accommodation'
								? 'bg-blue-600 text-white hover:bg-blue-800'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
						}`}>
						Accommodation
					</button>
				</div>
				{activeTab === 'users' && (
					<>
						<div className='flex gap-6'>
							<button
								onClick={() => setFormMode('create')}
								className={`px-4 py-2 rounded ${
									formMode === 'create'
										? 'bg-blue-600 text-white hover:bg-blue-800'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}>
								Create User
							</button>
							<button
								onClick={() => setFormMode('edit')}
								className={`px-4 py-2 rounded ${
									formMode === 'edit'
										? 'bg-blue-600 text-white hover:bg-blue-800'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}>
								Edit User
							</button>
						</div>
						<form
							onSubmit={handleUpdateOrCreateUserProfile}
							className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
							<div>
								<label className='block mb-1'>Username</label>
								<input
									className={inputStyle}
									value={users.username}
									onChange={(e) => {
										const value = e.target.value;
										setUsers({ ...users, username: value });
										setShowDropdown(true);
										setFiltered(
											formMode === 'create'
												? []
												: allUsers.filter((user) => {
														return user.username
															.toLowerCase()
															.includes(value.toLowerCase());
												  })
										);
									}}
									onFocus={() => {
										if (formMode !== 'create') {
											setShowDropdown(true);
											setFiltered(allUsers);
										}
									}}
									placeholder='Enter username!'
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
							{formMode === 'create' && (
								<div>
									<label className='block mb-1'>Password</label>
									<input
										className={inputStyle}
										value={users.password}
										onChange={(e) =>
											setUsers({ ...users, password: e.target.value })
										}
									/>
								</div>
							)}
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
							{formMode === 'edit' && (
								<div className='block mt-0.5'>
									<label>ID</label>
									<input
										className={inputStyle}
										value={users._id}
										readOnly
									/>
								</div>
							)}
							<div className='md:col-span-2 text-right mt-4'>
								<button
									onClick={() => handleDelete(users._id, 'user')}
									className='bg-red-600 text-white px-6 py-2 flex items-center justify-start rounded hover:bg-red-800'>
									Delete
								</button>
								<button
									type='submit'
									className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800'>
									{loadingForm
										? formMode === 'create'
											? 'Creating...'
											: 'Saving...'
										: formMode === 'create'
										? 'Create User'
										: 'Save User'}
								</button>
							</div>
						</form>
					</>
				)}

				{activeTab === 'accommodation' && (
					<>
						<div className='flex gap-6'>
							<button
								onClick={() => setFormMode('create')}
								className={`px-4 py-2 rounded ${
									formMode === 'create'
										? 'bg-blue-600 text-white hover:bg-blue-800'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}>
								Create Accommodation
							</button>
							<button
								onClick={() => setFormMode('edit')}
								className={`px-4 py-2 rounded ${
									formMode === 'edit'
										? 'bg-blue-600 text-white hover:bg-blue-800'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}>
								Edit Acommodation
							</button>
						</div>
						<form
							onSubmit={handleUpdateOrCreateAccommodation}
							className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block mb-1'>Name</label>
								<input
									className={inputStyle}
									value={accommodation.name}
									onChange={(e) => {
										const value = e.target.value;
										setAccommodation({
											...accommodation,
											name: value,
										});
										setShowDropdown(true);
										setFilteredAcc(
											formMode === 'create'
												? []
												: allHotels.filter((hotel) => {
														return hotel.name
															.toLowerCase()
															.includes(value.toLowerCase());
												  })
										);
									}}
									onFocus={() => {
										if (formMode !== 'create') {
											setShowDropdown(true);
											setFilteredAcc(allHotels);
										}
									}}
								/>
								{showDropdown && filteredAcc.length > 0 && (
									<ul className='absolute z-10 w-40 bg-white border rounded mt-1 shadow'>
										{filteredAcc.map((hotel, index) => {
											return (
												<li
													key={index}
													className='p-2 hover:bg-blue-200 cursor-pointer'
													onClick={() => {
														setAccommodation(hotel);
														setShowDropdown(false);
													}}>
													{hotel.name}
												</li>
											);
										})}
									</ul>
								)}
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
							<div>
								<label className='block mb-1'>Upload Images</label>
								<input
									className={inputStyle}
									type='file'
									multiple
									accept='image/*'
									onChange={handleImageChange}
								/>
							</div>
							{formMode === 'edit' && (
								<div className='block mt-0.5'>
									<label>ID</label>
									<input
										className={inputStyle}
										value={accommodation._id}
										readOnly
									/>
								</div>
							)}
							<div className='md:col-span-2 text-right mt-4'>
								<button
									onClick={() =>
										handleDelete(accommodation._id, 'accommodation')
									}
									className='bg-red-600 text-white px-6 py-2 flex items-center justify-start rounded hover:bg-red-800'>
									Delete
								</button>
								<button
									type='submit'
									disabled={loadingForm}
									className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800'>
									{loadingForm
										? formMode === 'create'
											? 'Creating...'
											: 'Saving...'
										: formMode === 'create'
										? 'Create Accommodation'
										: 'Save Accommodation'}
								</button>
							</div>
						</form>
					</>
				)}
			</div>
		</div>
	);
};

export default AdminDashboard;
