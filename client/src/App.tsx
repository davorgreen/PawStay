import Header from './components/Header';
import Navbar from './components/Navbar';
import useFetch from './hooks/useFetch';

function App() {
	const { data, loading, error } = useFetch(
		'api/hotels/countByCity?cities=Subotica,Madird,London'
	);

	return (
		<div>
			<Navbar />
			<Header />
		</div>
	);
}

export default App;
