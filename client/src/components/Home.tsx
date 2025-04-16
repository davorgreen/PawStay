import HotelCard from '../components/HotelCard.tsx';

const hotelList = [
	{
		name: 'Sea Breeze Hotel',
		location: 'Barcelona, Spain',
		image:
			'https://www.veryimportantpaws.com/wp-content/uploads/2021/11/BC4A7513-1536x1024.jpg',
		price: '$120',
	},
	{
		name: 'Mountain View Lodge',
		location: 'Zermatt, Switzerland',
		image:
			'https://www.mallory.co.uk/wp-content/uploads/2022/12/Joey-1.jpg',
		price: '$150',
	},
	{
		name: 'City Lights Inn',
		location: 'New York, USA',
		image:
			'https://stories-editor.hilton.com/wp-content/uploads/2023/04/Canopy-by-Hilton-Boston-Downtown-Paws-in-the-Neighborhood-Program-Jamie-Mercurio-Photography-.jpg?w=1024',
		price: '$200',
	},
];

export default function Home() {
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
						<HotelCard key={index} {...hotel} />
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
