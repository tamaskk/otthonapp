import React, { useEffect, useState } from 'react';

const apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNzhjOWFkZGE5MGJlMmE0NThhZWJmYmRkZDk1NDI2MCIsIm5iZiI6MTc0NTE2MDkxMi40MDMsInN1YiI6IjY4MDUwYWQwMDMzNDRhZWU3MDg5ZDYwMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.74LRIyeXwTUYFI5IOiLhFZZRfvxP20zbPHN2CxjbgBs";

const Movies = () => {
    const [type, setType] = useState<'movie' | 'tv'>('movie');
    const [items, setItems] = useState<any[]>([]);
    const [genres, setGenres] = useState<{ id: number, name: string }[]>([]);
    const [filters, setFilters] = useState({
        genre: '',
        releaseYear: '',
        rating: '',
        page: 1
    });
    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);

    const years = Array.from({ length: 46 }, (_, i) => i + 1980);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/genre/${type}/list?language=en`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => setGenres(data.genres));
    }, [type]);

    useEffect(() => {
        const { genre, releaseYear, rating, page } = filters;
        let url = `https://api.themoviedb.org/3/discover/${type}?page=${page}`;

        if (genre) url += `&with_genres=${genre}`;
        if (releaseYear) url += `&primary_release_year=${releaseYear}`;
        if (rating) url += `&vote_average.gte=${rating}`;

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setItems(data.results);
                setTotalPages(data.total_pages);
                setTotalResults(data.total_results);
            });
    }, [filters, type]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const genreName = (id: number) => genres.find(g => g.id === id)?.name || '';

    return (
        <div className="p-4 max-w-6xl mx-auto text-white">
            <h1 className="text-3xl font-bold text-center mb-6 text-black">Movies & Series Explorer</h1>
            <div className="flex flex-wrap gap-4 justify-center mb-6">
                <button onClick={() => setType('movie')} className={`px-4 py-2 rounded ${type === 'movie' ? 'bg-blue-600' : 'bg-gray-700'}`}>Movies</button>
                <button onClick={() => setType('tv')} className={`px-4 py-2 rounded ${type === 'tv' ? 'bg-blue-600' : 'bg-gray-700'}`}>Series</button>
                <select onChange={(e) => handleFilterChange('genre', e.target.value)} className="text-black p-2 rounded">
                    <option value="">Genre</option>
                    {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <select onChange={(e) => handleFilterChange('releaseYear', e.target.value)} className="text-black p-2 rounded">
                    <option value="">Year</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
                <select onChange={(e) => handleFilterChange('rating', e.target.value)} className="text-black p-2 rounded">
                    <option value="">Rating</option>
                    {[...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}+</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-gray-800 rounded-lg shadow p-4">
                        <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} className="rounded mb-2 w-full h-[400px] object-cover" />
                        <h2 className="text-xl font-semibold">{item.title || item.name}</h2>
                        <p className="text-sm italic text-gray-300 mb-1">Genres: {item.genre_ids.map(genreName).join(', ')}</p>
                        <p className="text-sm text-gray-400">{item.overview?.slice(0, 100)}...</p>
                        <a
                            href={`https://www.themoviedb.org/${type}/${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-2 text-blue-400 hover:underline"
                        >Where to watch?</a>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <button
                    onClick={() => setFilters(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                    disabled={filters.page === 1}
                >Previous</button>
                <span className="px-4 py-2 text-black">{filters.page} / {totalPages} ({totalResults})</span>
                <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                >Next</button>
            </div>
        </div>
    );
};

export default Movies;