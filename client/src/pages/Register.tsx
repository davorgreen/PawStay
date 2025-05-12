import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface RegisterForm {
	username: string;
	email: string;
	password: string;
}

const Register = () => {
	const [formData, setFormData] = useState<RegisterForm>({
		username: '',
		email: '',
		password: '',
	});
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<null | string>(null);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const navigate = useNavigate();
	const emailRegex =
		/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const passwordRegex = /^[A-Z](?=.*\d)[A-Za-z0-9]{7,}$/;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setError(null);
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	//validate register form
	const validateForm = () => {
		if (!emailRegex.test(formData.email)) {
			setError('Invalid email format');
			return false;
		}
		if (!passwordRegex.test(formData.password)) {
			setError(
				'Password must be at least 8 characters long, start with an uppercase letter, and contain at least one number.'
			);
			return false;
		}
		return true;
	};

	//submit form
	const handleSubmitRegisterForm = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}
		setLoading(true);
		try {
			await axios.post('/api/auth/register', formData);
			toast.success('Register successful!');
			navigate('/login');
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const message = err.response?.data?.message || err.message;
				setError(message);
				toast.error(message);
			}
		} finally {
			setLoading(false);
		}
	};
	return (
		<div>
			<Link to='/'>
				<img
					src={logo}
					alt='logo'
					className='absolute top-3 left-3 h-48 w-48 object-contain rounded-full'
				/>
			</Link>
			<div className='min-h-screen flex justify-center items-center bg-blue-300'>
				<div className='w-[90%] max-w-[500px] bg-blue-200 border-4 border-blue-800 p-8 rounded-xl shadow-lg'>
					<Link
						to={'/login'}
						className='flex justify-end mb-4 underline text-md text-blue-900'>
						I already have an account? Click here to log in
					</Link>
					<h2 className='text-2xl font-bold text-center mb-6 text-blue-900'>
						Register
					</h2>
					<form
						onSubmit={handleSubmitRegisterForm}
						className='flex flex-col gap-6'>
						<div>
							<label className='block mb-2 text-blue-900 font-semibold'>
								Username
							</label>
							<input
								type='text'
								name='username'
								value={formData.username}
								onChange={handleChange}
								required
								autoComplete='username'
								className='w-full px-4 py-2 border bg-white text-black border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-700'
							/>
						</div>
						<div>
							<label className='block mb-2 text-blue-900 font-semibold'>
								Email
							</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								required
								autoComplete='email'
								className='w-full px-4 py-2 border bg-white text-black border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-700'
							/>
						</div>
						<div>
							<label className=' block mb-2 text-blue-900 font-semibold'>
								Password
							</label>
							<div className='flex justify-center items-center gap-2'>
								<input
									type={showPassword ? 'text' : 'password'}
									name='password'
									value={formData.password}
									onChange={handleChange}
									required
									autoComplete='current-password'
									className='w-full px-4 py-2 border bg-white text-black border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-700'
								/>
								<span
									className='right-3 text-blue-800 cursor-pointer'
									onClick={() => setShowPassword((prev) => !prev)}>
									{showPassword ? (
										<FaEyeSlash size={30} />
									) : (
										<FaEye size={30} />
									)}
								</span>
							</div>
						</div>
						{error && (
							<p className='text-red-600 text-sm mt-1'>{error}</p>
						)}
						<button
							type='submit'
							className='bg-blue-800 text-white font-bold py-2 rounded hover:bg-blue-900 transition duration-200'>
							Register
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
