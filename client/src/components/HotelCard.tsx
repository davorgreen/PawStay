import { Rating } from '@mui/material';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

type HotelCardProps = {
	name: string;
	photos: string[];
	city: string;
	address: string;
	rating: number;
	_id: string;
};

const HotelCard: React.FC<HotelCardProps> = ({
	name,
	city,
	address,
	photos,
	rating,
	_id,
}) => {
	return (
		<div className=' bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 ease-in-out text-center'>
			<img
				src={photos?.[0] || logo}
				alt={name}
				className='h-48 w-full object-contain'
			/>
			<div className='p-4 flex flex-col items-center gap-4'>
				<h3 className='text-xl font-semibold text-blue-500'>
					{name}
				</h3>
				<p className='text-gray-500 text-md'>
					{' '}
					{address}, {city}
				</p>
				<div className='text-lg font-medium flex items-center gap-2'>
					{rating ? (
						<>
							{}
							<span>{rating}</span>
							<Rating
								name='half-rating-read'
								value={rating}
								precision={0.5}
								readOnly
							/>
						</>
					) : (
						<p>No rating available</p>
					)}
				</div>
			</div>
			<div className='flex items-center justify-center mb-4'>
				<Link to={`/hotel/${_id}`}>
					<button className='bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg px-12 py-2 rounded-xl  transition duration-300'>
						Book
					</button>
				</Link>
			</div>
		</div>
	);
};

export default HotelCard;
