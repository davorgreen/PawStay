import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import logo from '../assets/logo.png';

interface AccommodationType {
	name: string;
	type: string;
	city: string;
	address: string;
	distance: string;
	photos?: string[];
	title: string;
	description: string;
	rating: number;
	cheapestPrice: number;
	featured: boolean;
	_id: string;
}

const AccommodationList: React.FC = () => {
	const { type } = useParams();

	const { data, loading, error } = useFetch<AccommodationType[]>(
		`/api/hotels/byType?type=${type}`
	);

	return (
		<div className='flex justify-center items-center flex-wrap gap-10 mt-10 mb-10'>
			{loading ? (
				<p className='text-white text-lg'>Loading...</p>
			) : error ? (
				<p className='text-red-500 text-lg'>{error}</p>
			) : (
				data?.map((accommodation) => (
					<div
						key={accommodation._id}
						className='w-full sm:w-96 h-full bg-blue-200 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 ease-in-out text-center'>
						<img
							src={accommodation.photos?.[0] || logo}
							alt={accommodation.name}
							className='h-48 w-full object-contain'
						/>
						<div className='p-4 flex flex-col gap-4'>
							<h3 className='text-2xl font-bold text-blue-500'>
								{accommodation.name}
							</h3>
							<p className='text-gray-600 text-md'>
								{accommodation.city}
							</p>
							<p className='text-gray-500 text-sm'>
								{accommodation.distance} meters
							</p>
							<p className='text-gray-500 text-lg font-semibold'>
								{accommodation.description}
							</p>
							<p className='text-lg font-bold text-blue-500'>
								${accommodation.cheapestPrice} / night
							</p>
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default AccommodationList;
