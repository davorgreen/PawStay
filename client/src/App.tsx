import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';
import Navbar from './components/Navbar';
import useFetch from './hooks/useFetch';

function App() {
	const { data, loading, error } = useFetch(
		'api/hotels/countByCity?cities=Subotica,Madird,London'
	);

	return (
		<div className='min-h-screen flex flex-col'>
			<Navbar />
			<Header />
			<Home />
			<Footer />
		</div>
	);
}

export default App;
