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

function App() {
	return (
		<Router>
			<ToastContainer position='top-center' autoClose={3000} />
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
					<Route path='/profile' element={<ProfilePage />} />
				</Route>
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
			</Routes>
		</Router>
	);
}

export default App;
