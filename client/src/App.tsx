import Navbar from './components/Navbar';
import useFetch from './hooks/useFetch';

function App() {
	const { data, loading, error } = useFetch(
		'api/hotels/countByCity?cities=Subotica,Madird,London'
	);

	return (
		<div>
			<Navbar />
		</div>
	);
}

export default App;
