import { showNotification } from "@/lib/showNotification";
import React, { useEffect, useState } from "react";

const apiKey =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNzhjOWFkZGE5MGJlMmE0NThhZWJmYmRkZDk1NDI2MCIsIm5iZiI6MTc0NTE2MDkxMi40MDMsInN1YiI6IjY4MDUwYWQwMDMzNDRhZWU3MDg5ZDYwMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.74LRIyeXwTUYFI5IOiLhFZZRfvxP20zbPHN2CxjbgBs";

type Genre = {
  id: number;
  name: string;
  title: string; // Hungarian translation
};

const translations: Record<string, string> = {
  Action: "Akció",
  Adventure: "Kaland",
  Animation: "Animáció",
  Comedy: "Vígjáték",
  Crime: "Bűnügyi",
  Documentary: "Dokumentumfilm",
  Drama: "Dráma",
  Family: "Családi",
  Fantasy: "Fantasy",
  History: "Történelem",
  Horror: "Horror",
  Music: "Zene",
  Mystery: "Rejtély",
  Romance: "Romantikus",
  "Science Fiction": "Tudományos-fantasztikus",
  "TV Movie": "TV film",
  Thriller: "Thriller",
  War: "Háborús",
  Western: "Western",
};

const Movies = () => {
  const [type, setType] = useState<"movie" | "tv" | "saved">("saved");
  const [items, setItems] = useState<any[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string; title: string }[]>([]);
  const [filters, setFilters] = useState({
    genre: "",
    releaseYear: "",
    rating: "",
    page: 1,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [savedItems, setSavedItems] = useState<
    {
      name: string;
      id: string;
      whereToWatch: string | string[];
      poster?: string;
      genre?: string;
      currentEpisode?: number;
      currentSeason?: number;
    }[]
  >([]);
  const [pickedMovie, setPickedMovie] = useState<any>(null);
  const [pickedSavedMovie, setPickedSavedMovie] = useState<any>(null);

  const years = Array.from({ length: 46 }, (_, i) => i + 1980);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/${type}/list?language=en`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const translatedGenres = data.genres?.map((genre: Genre) => ({
          ...genre,
          title: translations[genre.name] || genre.name,
        }));
        setGenres(translatedGenres);
      });
  }, [type]);

  useEffect(() => {
    const { genre, releaseYear, rating, page } = filters;
    let url = `https://api.themoviedb.org/3/discover/${type}?page=${page}`;

    if (genre) url += `&with_genres=${genre}`;
    if (releaseYear) url += `&primary_release_year=${releaseYear}`;
    if (rating) url += `&vote_average.gte=${rating}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data.results);
        setTotalPages(data.total_pages);
        setTotalResults(data.total_results);
      });
  }, [filters, type]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const getSavedItems = async () => {
    const response = await fetch("/api/movies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setSavedItems(data.savedItems);
  };

  const saveItem = async () => {
    if (!pickedMovie) return;

    showNotification("Kérlek várj...", "info");

    const response = await fetch("/api/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: pickedMovie.title || pickedMovie.name,
        id: pickedMovie.id,
        whereToWatch: `https://www.themoviedb.org/${type}/${pickedMovie.id}`,
        poster: pickedMovie.poster_path,
        genre: pickedMovie.genre_ids.map(genreName).join(", "),
      }),
    });
    if (!response.ok) {
      showNotification("Hiba történt a mentés során!", "error");
      return;
    }

    const data = await response.json();
    showNotification("Sikeresen elmentetted!", "success");
  };

  useEffect(() => {
    getSavedItems();
  }, []);

  const genreName = (id: number) =>
    genres ? genres.find((g) => g.id === id)?.name || "" : "";

  const saveProcess = async () => {
    if (!pickedSavedMovie) return;

    showNotification("Kérlek várj...", "info");

    const response = await fetch("/api/movies", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: pickedSavedMovie._id,
        currentEpisode: pickedSavedMovie.currentEpisode,
        currentSeason: pickedSavedMovie.currentSeason,
      }),
    });
    if (!response.ok) {
      showNotification("Hiba történt a mentés során!", "error");
      return;
    }

    const data = await response.json();
    showNotification("Sikeresen elmentetted!", "success");
  };

  return (
    <div className="p-4 max-w-6xl mx-auto max-h-[100dvh] flex-1 h-full flex flex-col text-white">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">
        Film és sorozat kereső
      </h1>
      <div className="flex flex-wrap gap-4 justify-center mb-6 sticky top-0 bg-white z-10 p-4">
        <button
          onClick={() => {
            setType("saved");
            getSavedItems();
          }}
          className={`px-3 py-2 rounded ${
            type === "saved" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Elmentett
        </button>
        <button
          onClick={() => setType("movie")}
          className={`px-3 py-2 rounded ${
            type === "movie" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Filmek
        </button>
        <button
          onClick={() => setType("tv")}
          className={`px-3 py-2 rounded ${
            type === "tv" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Sorozatok
        </button>
        {type !== "saved" && (
          <>
            <select
              onChange={(e) => handleFilterChange("genre", e.target.value)}
              className="text-black p-2 rounded"
            >
              <option value="">Típus</option>
              {genres && genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => handleFilterChange("releaseYear", e.target.value)}
              className="text-black p-2 rounded"
            >
              <option value="">Évszám</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => handleFilterChange("rating", e.target.value)}
              className="text-black p-2 rounded"
            >
              <option value="">Értékelés</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}+
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {type !== "saved" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items?.length > 0 ? (
              items.map((item) => (
                <div
                  onClick={() => setPickedMovie(item)}
                  key={item.id}
                  className="bg-white rounded-lg shadow-xl text-black p-4"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="rounded mb-2 w-full h-[400px] object-cover"
                  />
                  <h2 className="text-xl font-semibold">
                    {item.title || item.name}
                  </h2>
                  <p className="text-sm italic text-gray-300 mb-1">
                    Típus: {item.genre_ids.map(genreName).join(", ")}
                  </p>
                  <p className="text-sm text-gray-400">
                    {item.overview?.slice(0, 100)}...
                  </p>
                  <a
                    href={`https://www.themoviedb.org/${type}/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-blue-400 hover:underline"
                  >
                    Where to watch?
                  </a>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500">
                Nincs találat
              </div>
            )}
          </div>
        )}

        {type === "saved" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedItems?.length > 0 ? (
              savedItems.map((item) => (
                <div
                  onClick={() => setPickedSavedMovie(item)}
                  key={item.id}
                  className="bg-white rounded-lg shadow-xl text-black p-4"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item?.poster}`}
                    alt={item.name}
                    className="rounded mb-2 w-full h-[400px] object-cover"
                  />
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-sm italic text-black mb-1">
                    Jelenlegi epizód: {item.currentEpisode}
                  </p>
                  <p className="text-sm italic text-black mb-1">
                    Jelenlegi évad: {item.currentSeason}
                  </p>
                  <a
                    href={`https://www.themoviedb.org/${type}/${item?.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-blue-400 hover:underline"
                  >
                    Where to watch?
                  </a>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500">
                Nincs találat
              </div>
            )}
          </div>
        )}
      </div>

      {type !== "saved" ? (
        <div className="flex justify-center gap-4 mt-8 sticky bottom-0 bg-white p-4 z-10">
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: Math.max(prev.page - 1, 1),
              }))
            }
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white"
            disabled={filters.page === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-black">
            {filters.page} / {totalPages} ({totalResults})
          </span>
          <button
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white"
          >
            Next
          </button>
        </div>
      ) : (
        <div className="text-center mt-4 sticky bottom-0 bg-white p-4 z-10">
          <span className="text-black">
            Elmentett filmek/sorozatok: {savedItems?.length}
          </span>
        </div>
      )}

      {/* Modal for Picked Movie */}
      {pickedMovie && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 text-black">
      <button
        onClick={() => setPickedMovie(null)}
        className="absolute top-3 right-3 text-white bg-red-500 rounded-md px-2 text-lg"
        aria-label="Close"
      >
        X
      </button>
      <img
        src={`https://image.tmdb.org/t/p/w500${pickedMovie.poster_path}`}
        alt={pickedMovie.title || pickedMovie.name}
        className="w-full h-[300px] object-cover rounded-md mb-4 mt-8"
      />
      <h2 className="text-xl font-bold mb-2">
        {pickedMovie.title || pickedMovie.name}
      </h2>
      <p className="text-sm italic text-gray-600 mb-2">
        Típus: {pickedMovie?.genre_ids?.map(genreName).join(", ")}
      </p>
      <p className="text-sm text-gray-800 whitespace-pre-wrap line-clamp-4">
        {pickedMovie.overview}
      </p>
      <a
        href={`https://www.themoviedb.org/${type}/${pickedMovie.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-4 text-blue-600 hover:underline font-medium"
      >
        Hol nézhető?
      </a>
      <button
        onClick={saveItem}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
      >
        Hozzáadás a kedvencekhez
      </button>
    </div>
  </div>
)}

      {/* Modal for Picked Saved Movie */}
      {pickedSavedMovie && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 text-black">
      <button
        onClick={() => setPickedSavedMovie(null)}
        className="absolute top-3 right-3 text-white bg-red-500 rounded-md px-2 text-lg"
        aria-label="Close"
      >
        X
      </button>
      <img
        src={`https://image.tmdb.org/t/p/w500${pickedSavedMovie?.poster}`}
        alt={pickedSavedMovie?.title || pickedSavedMovie?.name}
        className="w-full h-[300px] object-cover rounded-md mb-4 mt-8"
      />
      <h2 className="text-xl font-bold mb-2">
        {pickedSavedMovie?.title || pickedSavedMovie?.name}
      </h2>
      <p className="text-sm text-gray-800 whitespace-pre-wrap line-clamp-4">
        {pickedSavedMovie?.overview}
      </p>
      <div className="mt-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Aktuális epizód:
        </label>
        <input
          type="number"
          value={pickedSavedMovie?.currentEpisode || 0}
          onChange={(e) =>
            setPickedSavedMovie((prev: any) => ({
              ...prev,
              currentEpisode: parseInt(e.target.value) || 0,
            }))
          }
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Aktuális évad:
        </label>
        <input
          type="number"
          value={pickedSavedMovie?.currentSeason || 0}
          onChange={(e) =>
            setPickedSavedMovie((prev: any) => ({
              ...prev,
              currentSeason: parseInt(e.target.value) || 0,
            }))
          }
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <a
        href={`https://www.themoviedb.org/${type}/${pickedSavedMovie?.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-4 text-blue-600 hover:underline font-medium"
      >
        Hol nézhető?
      </a>
      <button
        onClick={saveProcess}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
      >
        Mentés
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Movies;