import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './useUser';

const useAxiosInterceptors = () => {
	const navigate = useNavigate();
	const { logout } = useUser();

	useEffect(() => {
		const responseInterceptor = axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (
					(error.response && error.response.status === 403) ||
					error.response.status === 401
				) {
					logout();
					navigate('/login');
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axios.interceptors.response.eject(responseInterceptor);
		};
	}, [navigate, logout]);
};

export default useAxiosInterceptors;
