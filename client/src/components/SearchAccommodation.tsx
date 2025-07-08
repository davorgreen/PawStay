import axios from 'axios';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AccommodationList } from './Home';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SearchAccommodation = () => {
	const [location, setLocation] = useState('');
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [disableDates, setDisableDates] = useState<Date[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [allHotels, setAllHotels] = useState<AccommodationList[]>([]);
	const [loadingHotels, setLoadingHotels] = useState<boolean>(true);
	const [selectedHotel, setSelectedHotel] =
		useState<AccommodationList | null>(null);
	const navigate = useNavigate();
	const apiUrl = import.meta.env.VITE_API_URL;

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

	return (
		<div className='w-full bg-blue-100 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-center shadow-md'>
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
									fetchReservedDates();
									setShowDropdown(false);
								}}>
								{`${item.name} ${item.city}`}
							</li>
						))}
					</ul>
				)}
			</div>
			<button
				onClick={() => {
					if (selectedHotel) {
						navigate(`/hotel/${selectedHotel._id}`);
						setLocation('');
					} else {
						toast.warning('Please select a location first!');
					}
				}}
				className='bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition'>
				Search
			</button>
		</div>
	);
};

export default SearchAccommodation;
