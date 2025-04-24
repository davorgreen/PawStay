import { useEffect, useState } from 'react';
import HotelCard from '../components/HotelCard.tsx';
import axios from 'axios';
import PropertyTypeCard from './PropertyTypeCard.tsx';

type HotelType = 'Hotel' | 'Apartments' | 'Resorts' | 'Villas';

interface HotelTypeCount {
	type: HotelType;
	count: number;
}

export default function Home() {
	const [hotelList, setHotelList] = useState<HotelTypeCount[]>([]);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res = await axios.get<HotelTypeCount[]>(
					'api/hotels/countByType'
				);
				console.log(res.data);
				setHotelList(res.data);
			} catch (err) {
				if (axios.isAxiosError(err)) {
					setError(err.response?.data?.message || err.message);
				}
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<div className='h-[1200px] bg-blue-300 px-10 py-8 flex flex-col justify-center gap-8'>
			<h1 className='text-5xl font-bold text-start text-white'>
				Best Destinations
			</h1>
			<h2 className='text-3xl font-semibold mb-4 text-white'>
				Browse by property type
			</h2>
			<div className='flex flex-col items-center'>
				<div className='flex gap-6 overflow-x-auto pb-4'>
					{hotelList.map((hotel, index) => (
						<PropertyTypeCard
							key={index}
							type={hotel.type}
							count={hotel.count}
						/>
					))}
				</div>
			</div>
			<h2 className='text-3xl font-semibold mb-4 text-white'>
				Guest Favorites
			</h2>
			<div className='flex flex-col items-center'>
				<div className='flex gap-6 overflow-x-auto pb-4'>
					{hotelList.map((hotel, index) => (
						<HotelCard key={`rec-${index}`} {...hotel} />
					))}
				</div>
			</div>
		</div>
	);
}
