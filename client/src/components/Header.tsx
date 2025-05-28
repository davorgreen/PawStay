import cover from '../assets/hotel.webp';
import SearchAccommodation from './SearchAccommodation';

const Header = () => {
	return (
		<div
			className='h-96 bg-center bg-cover bg-no-repeat  bg-blue-400 flex flex-col justify-center items-center text-center px-4'
			style={{
				backgroundImage: `url(${cover})`,
			}}>
			<h2 className='hidden lg:block bg-blue-400 text-white text-2xl md:text-3xl font-bold mb-4'>
				Join now and enjoy a lifetime discount!
			</h2>
			<p className='hidden lg:block bg-blue-400 text-white font-semibold text-lg md:text-xl mb-6'>
				Register or sign in today and unlock exclusive benefits that
				last forever.
			</p>
			<div className='mt-10'>
				<SearchAccommodation />
			</div>
		</div>
	);
};

export default Header;
