import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useUser } from '../hooks/useUser';
import { toast } from 'react-toastify';

const Navbar = () => {
	const navigate = useNavigate();
	const { user, logout } = useUser();

	const handleLogoutUser = () => {
		logout();
		navigate('/login');
		toast.success('Logout successful!');
	};
	return (
		<div className='flex relative items-center justify-between bg-blue-300 h-20 px-8'>
			<div className=''>
				<Link to='/'>
					<img
						src={logo}
						alt='Logo'
						className=' absolute top-3 h-36 w-36 object-contain rounded-full'
					/>
				</Link>
			</div>
			<div className='flex gap-4'>
				<button
					onClick={handleLogoutUser}
					className='text-white text-xl font-semibold hover:bg-blue-500 px-4 py-2 rounded-lg transition duration-300 ease-in-out'>
					Logout
				</button>
				<Link
					to={'/profile'}
					className='text-white text-xl font-semibold flex items-center'>
					{''} {user ? user.username : 'no user found'}
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
