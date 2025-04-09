import useFetch from './hooks/useFetch';

function App() {
	const { data, loading, error } = useFetch(
		'api/hotels/countByCity?cities=Subotica,Madird,London'
	);
	console.log(data);
}

export default App;
