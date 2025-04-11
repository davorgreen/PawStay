import logo from '../assets/logo.png';

const Navbar = () => {
	return (
		<div className='flex relative items-center justify-between bg-blue-300 h-20 px-8'>
			<div className=''>
				<img
					src={logo}
					alt='Logo'
					className=' absolute top-2 h-36 w-36 object-contain rounded-full'
				/>
			</div>
			<div className='flex gap-4'>
				<button className='text-white text-xl font-semibold hover:bg-blue-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out'>
					Register
				</button>
				<button className='text-white text-xl font-semibold hover:bg-blue-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out'>
					Login
				</button>
				<button className='text-white text-xl font-semibold'>
					Profile
				</button>
			</div>
		</div>
	);
};

export default Navbar;
