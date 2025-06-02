import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { AccommodationList } from '../components/Home';
import logo from '../assets/logo.png';
import axios from 'axios';
import { Guests } from '../components/BookingField';
import { useState } from 'react';
import { toast } from 'react-toastify';
import BookingField from '../components/BookingField';

const HotelDetailsPage = () => {
	const { id } = useParams();
	const [guests, setGuests] = useState<Guests>({
		adults: 1,
		children: 0,
	});
	const [showGuestOptions, setShowGuestOptions] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [loadingBooked, setLoadingBooked] = useState<boolean>(false);

	const { data, loading, error } = useFetch<AccommodationList>(
		`/api/hotels/find/${id}`
	);

	if (loading)
		return <div className='text-center py-8'>Loading...</div>;
	if (error)
		return (
			<div className='text-center text-red-500 py-8'>
				Error loading hotel details.
			</div>
		);
	if (!data) return null;

	const handleGuestChange = (type: keyof Guests, value: number) => {
		setGuests((prev) => ({
			...prev,
			[type]: Math.max(0, value),
		}));
	};

	//toggle
	const handleToggleGuestOptions = () => {
		setShowGuestOptions((prev) => !prev);
	};

	const handleConfirmBooking = async () => {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		const payload = {
			location: data.name,
			checkInDate: today.toISOString(),
			checkOutDate: tomorrow.toISOString(),
			guests: guests,
		};

		setLoadingBooked(true);
		try {
			await axios.post('/api/bookings', payload, {
				withCredentials: true,
			});
			toast.success('Booking completed successfully!');
			setShowGuestOptions(false);
			setGuests({
				adults: 1,
				children: 0,
			});
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setErrorMsg(err.response?.data?.message || err.message);
				toast.warning(errorMsg);
			} else {
				setErrorMsg('An unknown error occurred.');
			}
		} finally {
			setLoadingBooked(false);
		}
	};

	return (
		<div className='max-w-5xl mx-auto px-4 py-8'>
			<BookingField />
			<div className='grid md:grid-cols-2 gap-8 bg-blue-200 shadow-xl rounded-2xl overflow-hidden'>
				<div className='w-full h-64 md:h-auto'>
					<img
						src={data.photos[0] || logo}
						alt={data.name}
						className='w-full h-full object-cover'
					/>
				</div>
				<div className='p-6 flex flex-col justify-between'>
					<div>
						<h1 className='text-2xl md:text-3xl font-bold mb-4 text-blue-700'>
							{data.name}
						</h1>
						<p className='text-gray-700 mb-2 text-xl'>
							{data.city}, {data.address}
						</p>
						<p className='text-lg text-gray-500 mb-4 '>
							{data.distance}m from city center
						</p>
						<p className='text-lg text-gray-800 mb-6'>
							{data.description}
						</p>
					</div>

					<div>
						<p className='text-lg font-semibold mb-2'>
							⭐ {data.rating} / 5
						</p>
						<p className='text-xl font-bold text-green-600 mb-4'>
							From ${data.cheapestPrice} / night
						</p>
						<button
							onClick={handleToggleGuestOptions}
							className='bg-blue-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-blue-700 transition duration-200'>
							Only Book for Today
						</button>

						{showGuestOptions && (
							<div className='bg-white p-4 rounded-lg shadow-lg z-20 w-64 mt-4'>
								{['adults', 'children'].map((type) => (
									<div
										key={type}
										className='flex justify-between items-center mb-3'>
										<span className='capitalize text-gray-700'>
											{type}
										</span>
										<div className='flex gap-2'>
											<button
												onClick={() =>
													handleGuestChange(
														type as keyof Guests,
														guests[type as keyof Guests] - 1
													)
												}
												className='px-2 py-1 bg-blue-200 text-blue-700 rounded'>
												-
											</button>
											<span>{guests[type as keyof Guests]}</span>
											<button
												onClick={() =>
													handleGuestChange(
														type as keyof Guests,
														guests[type as keyof Guests] + 1
													)
												}
												className='px-2 py-1 bg-blue-200 text-blue-700 rounded'>
												+
											</button>
										</div>
									</div>
								))}

								{errorMsg && (
									<p className='text-red-500 mb-2 text-sm'>
										{errorMsg}
									</p>
								)}

								<button
									onClick={handleConfirmBooking}
									disabled={loadingBooked}
									className='mt-2 w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition duration-200'>
									{loadingBooked ? 'Booking...' : 'Confirm Booking'}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default HotelDetailsPage;
