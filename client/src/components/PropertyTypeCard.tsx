import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

type PropertyTypeCardProps = {
	type: string;
	count: number;
	image?: string;
};

const PropertyTypeCard: React.FC<PropertyTypeCardProps> = ({
	type,
	count,
}) => {
	const navigate = useNavigate();
	const handleOpenProperty = () => {
		navigate(`/accommodation/${type}`);
	};

	return (
		<div className='w-full sm:w-96 h-full bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 ease-in-out text-center'>
			<img
				src={logo}
				alt={type}
				className='h-48 w-full object-contain'
			/>
			<div className='p-4 flex flex-col items-center gap-4'>
				<h3 className='text-3xl font-bold text-blue-500'>{type}</h3>
				<p className='text-gray-500 text-lg font-semibold'>
					{count} properties
				</p>
			</div>
			<div className='flex items-center justify-center mb-4'>
				<button
					onClick={handleOpenProperty}
					className='bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg px-12 py-2 rounded-xl transition duration-300'>
					View
				</button>
			</div>
		</div>
	);
};

export default PropertyTypeCard;
