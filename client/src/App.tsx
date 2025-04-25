import AccommodationList from './components/AccommodationList';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';
import Navbar from './components/Navbar';
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from 'react-router-dom';

function App() {
	return (
		<Router>
			<div className='min-h-screen flex flex-col'>
				<Navbar />
				<Header />
				<Routes>
					<Route path='/' element={<Home />} />
					<Route
						path='/accommodation/:type'
						element={<AccommodationList />}
					/>
					{/*  */}
				</Routes>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
