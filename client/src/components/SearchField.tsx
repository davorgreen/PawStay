import { useEffect, useRef, useState } from 'react';
import {
	FaMapMarkerAlt,
	FaCalendarAlt,
	FaUser,
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Guests {
	adults: number;
	children: number;
	rooms: number;
}

function SearchField() {
	const [location, setLocation] = useState('');
	const [checkIn, setCheckIn] = useState<Date | null>(null);
	const [checkOut, setCheckOut] = useState<Date | null>(null);
	const [guests, setGuests] = useState<Guests>({
		adults: 1,
		children: 0,
		rooms: 1,
	});
	const [showGuestOptions, setShowGuestOptions] = useState(false);
	const guestRef = useRef<HTMLDivElement>(null);

	const handleGuestChange = (type: keyof Guests, value: number) => {
		setGuests((prev) => ({
			...prev,
			[type]: Math.max(0, value),
		}));
	};

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

	const handleSearch = () => {
		console.log({
			location,
			checkIn,
			checkOut,
			guests,
		});
		//api
	};

	return (
		<div className='w-full bg-blue-100 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-center shadow-md'>
			<div className='flex items-center bg-white px-4 py-2 rounded-lg shadow-sm w-full md:w-auto'>
				<FaMapMarkerAlt className='text-blue-500 mr-2' />
				<input
					type='text'
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					placeholder='Where are you going?'
					className='outline-none w-48 md:w-56 text-gray-700'
					required
				/>
			</div>
			<div className='flex items-center bg-white px-4 py-2 rounded-lg shadow-sm'>
				<FaCalendarAlt className='text-blue-500 mr-2' />
				<DatePicker
					selected={checkIn}
					onChange={(date) => setCheckIn(date)}
					placeholderText='Add check-in date'
					className='outline-none w-36 text-gray-700'
				/>
			</div>
			<div className='flex items-center bg-white px-4 py-2 rounded-lg shadow-sm'>
				<FaCalendarAlt className='text-blue-500 mr-2' />
				<DatePicker
					selected={checkOut}
					onChange={(date) => setCheckOut(date)}
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
						placeholder='Adults, Children, Rooms'
						value={`${guests.adults} Adults, ${guests.children} Children, ${guests.rooms} Room(s)`}
						className='outline-none w-64 text-gray-700 cursor-pointer'
					/>
				</div>

				{showGuestOptions && (
					<div className='absolute top-16 bg-white p-4 rounded-lg shadow-lg z-20 w-64'>
						{['adults', 'children', 'rooms'].map((type) => (
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
				onClick={handleSearch}
				className='bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition'>
				Search
			</button>
		</div>
	);
}

export default SearchField;
