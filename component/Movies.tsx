import { showNotification } from "@/lib/showNotification";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import ViewModeSwitch from "./ViewModeSwitch";

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
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [items, setItems] = useState<any[]>([]);
  const [genres, setGenres] = useState<
    { id: number; name: string; title: string }[]
  >([]);
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
  const [addSavedModal, setAddSavedModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    genre: "",
    poster: "",
    whereToWatch: "",
  });
  const years = Array.from({ length: 46 }, (_, i) => i + 1980);

  useEffect(() => {
    if (type === "saved") return;
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
    if (type === "saved") return;
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
      credentials: 'include',
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
      credentials: "include",
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
      credentials: "include",
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
      <div className="absolute top-5 left-4">
        <ViewModeSwitch
          onViewChange={setViewMode}
          storageKey="movies-view-mode"
          defaultView="grid"
        />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        Film és sorozat kereső
      </h1>
      <div className="flex flex-wrap gap-4 justify-center mb-6 sticky top-0 bg-white z-10 p-4">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAddSavedModal(true);
              }}
              className={`px-3 py-2 rounded bg-blue-600`}
            >
              Hozzáadás
            </button>
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
          </div>
        </div>
        {type !== "saved" && (
          <>
            <select
              onChange={(e) => handleFilterChange("genre", e.target.value)}
              className="text-black p-2 rounded border-gray-300 border"
            >
              <option value="">Típus</option>
              {genres &&
                genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
            </select>
            <select
              onChange={(e) =>
                handleFilterChange("releaseYear", e.target.value)
              }
              className="text-black p-2 rounded border-gray-300 border"
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
              className="text-black p-2 rounded border-gray-300 border"
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
        {type !== "saved" && viewMode === "grid" && (
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

        {type !== "saved" && viewMode === "table" && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-black rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poszter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cím</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Típus</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leírás</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items?.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} onClick={() => setPickedMovie(item)} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={item.title || item.name}
                          className="h-20 w-14 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.title || item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.genre_ids.map(genreName).join(", ")}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2">{item.overview}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`https://www.themoviedb.org/${type}/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Where to watch?
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Nincs találat
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {type === "saved" && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedItems?.length > 0 ? (
              savedItems.map((item) => (
                <div
                  onClick={() => setPickedSavedMovie(item)}
                  key={item.id}
                  className="bg-white rounded-lg shadow-xl text-black p-4"
                >
                  <img
                    src={item.poster ? (item.poster.includes('http') ? item.poster : `https://image.tmdb.org/t/p/w500${item.poster}`) : '/fallback-image.jpg'}
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

        {type === "saved" && viewMode === "table" && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-black rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poszter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Név</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Epizód</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Évad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {savedItems?.length > 0 ? (
                  savedItems.map((item) => (
                    <tr key={item.id} onClick={() => setPickedSavedMovie(item)} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={item.poster ? (item.poster.includes('http') ? item.poster : `https://image.tmdb.org/t/p/w500${item.poster}`) : '/fallback-image.jpg'}
                          alt={item.name}
                          className="h-20 w-14 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.currentEpisode || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.currentSeason || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={typeof item.whereToWatch === 'string' ? item.whereToWatch : item.whereToWatch[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Where to watch?
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Nincs találat
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

      <Modal
        handlerFunction={() => setPickedMovie(null)}
        state={pickedMovie !== null}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${pickedMovie?.poster_path}`}
          alt={pickedMovie?.title || pickedMovie?.name}
          className="w-full h-[300px] object-cover rounded-md mb-4 mt-8"
        />
        <h2 className="text-xl font-bold mb-2">
          {pickedMovie?.title || pickedMovie?.name}
        </h2>
        <p className="text-sm italic text-gray-600 mb-2">
          Típus: {pickedMovie?.genre_ids?.map(genreName).join(", ")}
        </p>
        <p className="text-sm text-gray-800 whitespace-pre-wrap line-clamp-4">
          {pickedMovie?.overview}
        </p>
        <a
          href={`https://www.themoviedb.org/${type}/${pickedMovie?.id}`}
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
      </Modal>

      <Modal
        handlerFunction={() => setPickedSavedMovie(null)}
        state={pickedSavedMovie !== null}
      >
        <img
          src={pickedSavedMovie?.poster ? (pickedSavedMovie?.poster.includes('http') ? pickedSavedMovie?.poster : `https://image.tmdb.org/t/p/w500${pickedSavedMovie?.poster}`) : '/fallback-image.jpg'}
          alt={pickedSavedMovie?.title || pickedSavedMovie?.name}
          className="w-full h-[300px] min-w-[300px] object-cover rounded-md mb-4 mt-8"
        />
        <h2 className="text-xl font-bold mb-2 text-black">
          {pickedSavedMovie?.title || pickedSavedMovie?.name}
        </h2>
        <p className="text-sm text-black whitespace-pre-wrap line-clamp-4">
          {pickedSavedMovie?.overview}
        </p>
        <p className="text-sm italic text-black mb-2">
          Hol nézhető: {pickedSavedMovie?.whereToWatch}
        </p>
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Aktuális epizód:
          </label>
          <input
            type="number"
            value={pickedSavedMovie?.currentEpisode}
            onChange={(e) =>
              setPickedSavedMovie((prev: any) => ({
                ...prev,
                currentEpisode: parseInt(e.target.value),
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Aktuális évad:
          </label>
          <input
            type="number"
            value={pickedSavedMovie?.currentSeason}
            onChange={(e) =>
              setPickedSavedMovie((prev: any) => ({
                ...prev,
                currentSeason: parseInt(e.target.value),
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md text-black"
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
        <button
          onClick={async () => {
            const response = await fetch("/api/movies", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                _id: pickedSavedMovie._id,
              }),
            });
            if (!response.ok) {
              showNotification("Hiba történt a törlés során!", "error");
              return;
            }
            setPickedSavedMovie(null);
            getSavedItems();
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full"
        >
          Törlés
        </button>
      </Modal>

      <Modal
        handlerFunction={() => setAddSavedModal(false)}
        state={addSavedModal}
      >
        <div
          className="text-black"
        >
          <h1>Új film / sorozat hozzáadása</h1>
          <input
            type="text"
            placeholder="Film/Sorozat neve"
            value={newItem.name}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <input
            type="text"
            placeholder="Melyik oldalon nézhető?"
            value={newItem.whereToWatch}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, whereToWatch: e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <input
            type="text"
            placeholder="Kép url"
            value={newItem.poster}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, poster: e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <select
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, genre: e.target.value }))
            }
            className="text-black w-full p-2 rounded border-gray-300 border mb-4"
          >
            <option value="">Típus</option>
            {genres &&
              genres.map((g) => (
                <option key={g.id} value={g.name}>
                  {g.title}
                </option>
              ))}
          </select>
          <button
            onClick={async () => {
              const response = await fetch("/api/movies", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: newItem.name,
                  whereToWatch: newItem.whereToWatch,
                  poster: newItem.poster,
                  genre: newItem.genre,
                }),
              });
              if (!response.ok) {
                showNotification("Hiba történt a mentés során!", "error");
                return;
              }
              setAddSavedModal(false);
              getSavedItems();
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
          >
            Mentés
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Movies;
