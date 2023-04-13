import { useEffect, useState } from 'react';
import axios from 'axios';
const useBookSearch = (query, pageNumber) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [dataBooks, setDataBooks] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setDataBooks([]);
	}, [query]);

	useEffect(() => {
		let cancel;
		setError(false);
		setLoading(true);
		axios({
			method: 'GET',
			url: 'http://openlibrary.org/search.json',
			params: { q: query, page: pageNumber },
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				console.log(res.data.docs);
				setDataBooks((prevBooks) => {
					return [...prevBooks, ...res.data.docs];
				});
				setHasMore(res.data.docs.lenght > 0);
				setLoading(false);
			})
			.catch((e) => {
				if (axios.isCancel(e)) {
					console.log('cancelado');
					return;
				} else {
					console.log('error');
					setError(true);
				}
			});
		return () => cancel();
	}, [query, pageNumber]);

	return { error, loading, dataBooks, hasMore };
};

export default useBookSearch;
