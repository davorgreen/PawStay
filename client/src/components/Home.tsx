import { useEffect, useMemo, useState } from 'react';
import HotelCard from '../components/HotelCard.tsx';
import PropertyTypeCard from './PropertyTypeCard.tsx';
import useFetch from '../hooks/useFetch.ts';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

type HotelType = 'Hotel' | 'Apartments' | 'Resorts' | 'Villas';

interface HotelTypeCount {
	type: HotelType;
	count: number;
}

export interface AccommodationList {
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

	const OnlyRatedAccommodation = useMemo(() => {
		return AccommodationListByRating.filter((acc) => acc.rating > 0);
	}, [AccommodationListByRating]);

	const { data, loading, error } = useFetch<HotelTypeCount[]>(
		'api/hotels/countByType'
	);

	useEffect(() => {
		const fetchData = async () => {
			setAccommodationLoading(true);
			try {
				const res = await axios.get('/api/hotels');
				setAccommodationListByRating(res.data);
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
		<div className='min-h-screen bg-blue-300 px-4 py-8 flex flex-col justify-center gap-8'>
			<h1 className='text-4xl md:text-5xl font-bold text-start text-white'>
				Best Destinations
			</h1>

			<h2 className='text-2xl md:text-3xl font-semibold mb-4 text-white'>
				Browse by property type
			</h2>
			<div className='grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
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
				<Swiper
					spaceBetween={20}
					slidesPerView={1}
					breakpoints={{
						640: { slidesPerView: 2 },
						768: { slidesPerView: 3 },
						1024: { slidesPerView: 4 },
					}}
					pagination={{ el: '.custom-pagination', clickable: true }}
					navigation
					modules={[Pagination, Navigation]}
					className='w-full'>
					{accommodationLoading ? (
						<p className='text-white text-lg'>Loading...</p>
					) : accommodationError ? (
						<p className='text-red-500 text-lg'>{error}</p>
					) : (
						OnlyRatedAccommodation?.sort(
							(a, b) => b.rating - a.rating
						).map((hotel) => (
							<SwiperSlide key={hotel._id}>
								<HotelCard key={hotel._id} {...hotel} />
							</SwiperSlide>
						))
					)}
				</Swiper>
			</div>
		</div>
	);
}
