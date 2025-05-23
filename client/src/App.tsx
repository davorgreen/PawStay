import AccommodationList from './components/AccommodationList';
import Home from './components/Home';
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './components/ProfilePage';
import useAxiosInterceptors from './hooks/useAxiosInterceptors';
import { ReactNode } from 'react';
import HotelDetailsPage from './pages/HotelDetailsPage';

interface AxiosWrapperProps {
	children: ReactNode;
}

const AxiosWrapper = ({ children }: AxiosWrapperProps) => {
	useAxiosInterceptors();
	return <>{children}</>;
};

function App() {
	return (
		<Router>
			<ToastContainer position='top-center' autoClose={3000} />
			<AxiosWrapper>
				<Routes>
					<Route element={<ProtectedRoute />}>
						<Route
							path='/'
							element={
								<Layout>
									<Home />
								</Layout>
							}
						/>
						<Route
							path='/accommodation/:type'
							element={
								<Layout>
									<AccommodationList />
								</Layout>
							}
						/>
						<Route
							path='/hotel/:id'
							element={
								<Layout>
									<HotelDetailsPage />
								</Layout>
							}
						/>
						<Route path='/profile' element={<ProfilePage />} />
					</Route>
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
				</Routes>
			</AxiosWrapper>
		</Router>
	);
}

export default App;
