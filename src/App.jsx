import { useState, useRef, useCallback } from 'react';
import './App.css';
import useBookSearch from './api/useBookSearch';

function App() {
	const [query, setQuery] = useState('');
	const [pageNumber, setPageNumber] = useState(1);
	const { error, loading, dataBooks, hasMore } = useBookSearch(query, pageNumber);

	const observer = useRef();
	const lastBookElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					console.log('Visible');
					setPageNumber((prev) => prev + 1);
				}
			});
			if (node) observer.current.observe(node);
			console.log(node);
		},
		[loading, hasMore],
	);

	const handleSearch = (e) => {
		setQuery(e.target.value);
		setPageNumber(1);
	};

	return (
		<div className="App">
			<input type="text" value={query} onChange={handleSearch} />
			{dataBooks.map((book, index) => {
				if (dataBooks.length === index + 1) {
					return (
						<div key={index} ref={lastBookElementRef} style={{ color: 'red' }}>
							<p>{book.title}</p>
						</div>
					);
				} else {
					return (
						<div key={index}>
							<p>{book.title}</p>
						</div>
					);
				}
			})}
			{!!loading && <div>Loading...</div>}
			{!!error && <div>Error</div>}
		</div>
	);
}

export default App;
