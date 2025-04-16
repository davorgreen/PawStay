import cover from '../assets/hotel.webp';
import SearchField from './SearchField';
const Header = () => {
	return (
		<div
			className='h-96 bg-center bg-cover bg-no-repeat  bg-blue-400 flex flex-col justify-center items-center text-center px-4'
			style={{
				backgroundImage: `url(${cover})`,
			}}>
			<h2 className=' bg-blue-400 text-white text-2xl md:text-3xl font-bold mb-4 mt-10'>
				Join now and enjoy a lifetime discount!
			</h2>
			<p className=' bg-blue-400 text-white font-semibold text-lg md:text-xl mb-6'>
				Register or sign in today and unlock exclusive benefits that
				last forever.
			</p>
			<button className=' mt-10 text-white text-xl font-semibold hover:bg-blue-500 bg-blue-600 px-6 py-3 rounded-lg transition duration-300 ease-in-out'>
				Sign in / Register
			</button>
			<div className='mt-10'>
				<SearchField />
			</div>
		</div>
	);
};

export default Header;
