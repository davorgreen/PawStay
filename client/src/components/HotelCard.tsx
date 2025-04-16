import React from 'react';

type HotelCardProps = {
	name: string;
	location: string;
	image: string;
	price: string;
};

const HotelCard: React.FC<HotelCardProps> = ({
	name,
	location,
	image,
	price,
}) => {
	return (
		<div className='w-96 h-full bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 ease-in-out'>
			<img
				src={image}
				alt={name}
				className='h-48 w-full object-cover'
			/>
			<div className='p-4 flex flex-col items-center gap-4'>
				<h3 className='text-xl font-semibold text-blue-500'>
					{name}
				</h3>
				<p className='text-gray-500 text-md'>{location}</p>
				<p className='text-blue-500 font-medium mt-2 text-xl'>
					{price} / night
				</p>
			</div>
			<div className='flex items-center justify-center mb-4'>
				<button className='bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg px-12 py-2 rounded-xl  transition duration-300'>
					Book
				</button>
			</div>
		</div>
	);
};

export default HotelCard;
