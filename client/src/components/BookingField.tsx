import { useEffect, useMemo, useRef, useState } from 'react';
import {
	FaMapMarkerAlt,
	FaCalendarAlt,
	FaUser,
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { AccommodationList } from './Home';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';

export interface Guests {
	adults: number;
	children: number;
}

function BookingField() {
	const [location, setLocation] = useState('');
	const [checkIn, setCheckIn] = useState<Date | null>(null);
	const [checkOut, setCheckOut] = useState<Date | null>(null);
	const [guests, setGuests] = useState<Guests>({
		adults: 1,
		children: 0,
	});
	const [showGuestOptions, setShowGuestOptions] = useState(false);
	const guestRef = useRef<HTMLDivElement>(null);
	const [allHotels, setAllHotels] = useState<AccommodationList[]>([]);
	const [loadingHotels, setLoadingHotels] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [disableDates, setDisableDates] = useState<Date[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [selectedHotel, setSelectedHotel] =
		useState<AccommodationList | null>(null);
	const apiUrl = import.meta.env.VITE_API_URL;

	const handleGuestChange = (type: keyof Guests, value: number) => {
		setGuests((prev) => ({
			...prev,
			[type]: Math.max(0, value),
		}));
	};

	const fetchReservedDates = async () => {
		if (!selectedHotel) return;
		setLoading(true);
		setError(null);
		setDisableDates([]);
		try {
			const res = await axios.get<string[]>(
				`${apiUrl}/bookings/${selectedHotel.name}/reserved-dates`,
				{
					withCredentials: true,
				}
			);
			const convertedDates = res.data.map(
				(dateStr) => new Date(dateStr)
			);
			setDisableDates(convertedDates);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			}
		} finally {
			setLoading(false);
		}
	};

	//getReservedDatesByHotelName
	useEffect(() => {
		if (!selectedHotel) {
			setDisableDates([]);
			return;
		}
		const debouncedFetch = debounce(fetchReservedDates, 1000);
		debouncedFetch();
		return () => {
			debouncedFetch.cancel();
		};
	}, [selectedHotel]);

	//dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				guestRef.current &&
				event.target instanceof Node &&
				!guestRef.current.contains(event.target)
			) {
				setShowGuestOptions(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	//allHotels
	useEffect(() => {
		const fetchData = async () => {
			setLoadingHotels(true);
			try {
				const res = await axios.get(`${apiUrl}/hotels`, {
					withCredentials: true,
				});
				setAllHotels(res.data);
			} catch (err) {
				if (axios.isAxiosError(err)) {
					setError(err.response?.data?.message || err.message);
				}
			}
			setLoadingHotels(false);
		};
		fetchData();
	}, []);

	//filtered result
	const filtered = useMemo(() => {
		return allHotels.filter(
			(item) =>
				item.name.toLowerCase().includes(location.toLowerCase()) ||
				item.city.toLowerCase().includes(location.toLowerCase())
		);
	}, [allHotels, location]);

	//booking hotel
	const handleBookingHotel = async () => {
		if (!checkIn || !checkOut) {
			toast.warning('Check-in or Check-out date are not selected');
			return;
		}
		const checkInDate = new Date(checkIn);
		const checkOutDate = new Date(checkOut);

		if (!location || location.trim() === '') {
			toast.warning('Location is required.');
			return;
		}
		if (guests.adults <= 0) {
			toast.warning('Please enter a valid number of guests.');
			return;
		}
		if (!checkIn || !checkOut) {
			toast.warning(
				'Please select both check-in and check-out dates.'
			);
			return;
		}
		if (checkOutDate <= checkInDate) {
			toast.warning('Check-out date must be after check-in date.');
			return;
		}
		setLoadingHotels(true);
		try {
			const payload = { location, checkInDate, checkOutDate, guests };
			await axios.post(`${apiUrl}/bookings`, payload, {
				withCredentials: true,
			});
			toast.success('Booking completed successfully!');
			fetchReservedDates();
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			}
		} finally {
			setLoadingHotels(false);
		}
	};

	return (
		<div className='w-full bg-blue-200 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-center shadow-md mb-6'>
			<div className='flex items-center bg-white px-4 py-2 rounded-lg shadow-sm w-full md:w-auto relative'>
				<FaMapMarkerAlt className='text-blue-500 mr-2' />
				<input
					type='text'
					value={location}
					onChange={(e) => {
						setLocation(e.target.value);
						setShowDropdown(true);
					}}
					placeholder='Where are you going?'
					className='outline-none w-48 md:w-56 text-gray-700'
					required
				/>
				{location && showDropdown && filtered.length > 0 && (
					<ul className='absolute top-10 right-0.5 z-10 w-full bg-white border rounded mt-1 shadow'>
						{filtered.map((item, index) => (
							<li
								key={index}
								className='p-2 hover:bg-blue-200 cursor-pointer'
								onClick={() => {
									setLocation(item.name);
									setSelectedHotel(item);
									setShowDropdown(false);
									fetchReservedDates();
								}}>
								{`${item.name} ${item.city}`}
							</li>
						))}
					</ul>
				)}
			</div>
			<div className='flex items-center bg-white px-4 py-2 rounded-lg shadow-sm'>
				<FaCalendarAlt className='text-blue-500 mr-2' />
				<DatePicker
					selected={checkIn}
					minDate={new Date()}
					onChange={(date) => setCheckIn(date)}
					excludeDates={disableDates}
					placeholderText='Add check-in date'
					className='outline-none w-36 text-gray-700'
				/>
			</div>
			<div className='flex items-center bg-white px-4 py-2 rounded-lg shadow-sm'>
				<FaCalendarAlt className='text-blue-500 mr-2' />
				<DatePicker
					selected={checkOut}
					minDate={new Date()}
					onChange={(date) => setCheckOut(date)}
					excludeDates={disableDates}
					placeholderText='Add check-out date'
					className='outline-none w-36 text-gray-700'
				/>
			</div>
			<div className='relative' ref={guestRef}>
				<div
					className='flex items-center bg-white px-4 py-2 rounded-lg shadow-sm cursor-pointer'
					onClick={() => setShowGuestOptions((prev) => !prev)}>
					<FaUser className='text-blue-500 mr-2' />
					<input
						readOnly
						placeholder='Adults, Children'
						value={`${guests.adults} Adults, ${guests.children} Children`}
						className='outline-none w-64 text-gray-700 cursor-pointer'
					/>
				</div>
				{showGuestOptions && (
					<div className='absolute top-16 bg-white p-4 rounded-lg shadow-lg z-20 w-64'>
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
					</div>
				)}
			</div>
			<button
				onClick={handleBookingHotel}
				className='bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition'>
				Book
			</button>
		</div>
	);
}

export default BookingField;
