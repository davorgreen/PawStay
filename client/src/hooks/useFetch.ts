import axios from 'axios';
import { useEffect, useState } from 'react';

const useFetch = <T>(url: string) => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res = await axios.get<T>(url, {
					withCredentials: true,
				});
				setData(res.data);
			} catch (err) {
				if (axios.isAxiosError(err)) {
					setError(err.response?.data?.message || err.message);
				}
			}
			setLoading(false);
		};
		fetchData();
	}, [url]);

	const reFetch = async () => {
		setLoading(true);
		try {
			const res = await axios.get<T>(url, {
				withCredentials: true,
			});
			setData(res.data);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message);
			}
		}
		setLoading(false);
	};

	return { data, loading, error, reFetch };
};

export default useFetch;
