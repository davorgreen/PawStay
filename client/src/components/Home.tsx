import { useEffect, useState } from 'react';
import HotelCard from '../components/HotelCard.tsx';

import PropertyTypeCard from './PropertyTypeCard.tsx';
import useFetch from '../hooks/useFetch.ts';
import axios from 'axios';

type HotelType = 'Hotel' | 'Apartments' | 'Resorts' | 'Villas';

interface HotelTypeCount {
	type: HotelType;
	count: number;
}

interface AccommodationList {
	_id: string;
	name: string;
	type: string;
	city: string;
	address: string;
	distance: string;
	photos: string[];
	title: string;
	description: string;
	rating: number;
	cheapestPrice: number;
	rooms: string[];
	featured: boolean;
}

export default function Home() {
	const [AccommodationListByRating, setAccommodationListByRating] =
		useState<AccommodationList[]>([]);
	const [accommodationLoading, setAccommodationLoading] =
		useState<boolean>(false);
	const [accommodationError, setAccommodationError] = useState<
		string | null
	>(null);

	const OnlyRatedAccommodation = AccommodationListByRating.filter(
		(acc) => {
			return acc.rating > 0;
		}
	);

	const { data, loading, error } = useFetch<HotelTypeCount[]>(
		'api/hotels/countByType'
	);

	useEffect(() => {
		const fetchData = async () => {
			setAccommodationLoading(true);
			try {
				const res = await axios.get('/api/hotels');
				setAccommodationListByRating(res.data);
				console.log(res.data);
			} catch (err) {
				if (axios.isAxiosError(err)) {
					setAccommodationError(
						err.response?.data?.message || err.message
					);
				}
			}
			setAccommodationLoading(false);
		};
		fetchData();
	}, []);

	return (
		<div className='min-h-screen bg-blue-300 px-4 py-8 flex flex-col justify-center  gap-8'>
			<h1 className='text-4xl md:text-5xl font-bold text-start text-white'>
				Best Destinations
			</h1>

			<h2 className='text-2xl md:text-3xl font-semibold mb-4 text-white'>
				Browse by property type
			</h2>
			<div className='grid w-screen gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 '>
				{loading ? (
					<p className='text-white text-lg'>Loading...</p>
				) : error ? (
					<p className='text-red-500 text-lg'>{error}</p>
				) : (
					data?.map((hotel, index) => (
						<PropertyTypeCard
							key={index}
							type={hotel.type}
							count={hotel.count}
						/>
					))
				)}
			</div>
			<h2 className='text-2xl md:text-3xl font-semibold mb-4 text-white'>
				Guest Favorites
			</h2>
			<div className=''>
				<div className='grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full'>
					{accommodationLoading ? (
						<p className='text-white text-lg'>Loading...</p>
					) : accommodationError ? (
						<p className='text-red-500 text-lg'>{error}</p>
					) : (
						OnlyRatedAccommodation?.sort(
							(a, b) => b.rating - a.rating
						).map((hotel) => <HotelCard key={hotel._id} {...hotel} />)
					)}
				</div>
			</div>
		</div>
	);
}
