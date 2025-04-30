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

function App() {
	return (
		<Router>
			<Routes>
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
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
			</Routes>
		</Router>
	);
}

export default App;
