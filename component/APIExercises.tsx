import { showNotification } from "@/lib/showNotification";
import { useState } from "react";

// Define types for muscle groups and exercises
interface MuscleGroup {
  id: number;
  name: string;
  type: string;
}

interface Exercise {
  id: number;
  name: string;
  branded_video: string | null;
  reps: number | null;
  sets: number | null;
  rest_time: number | null;
  weight: number | null;
  // Add more fields as needed based on actual API response
}

// Hardcoded muscle groups (ideally fetched from API)
const muscleGroups: MuscleGroup[] = [
  { id: 47, name: "Váll", type: "shoulder" },
  { id: 4, name: "Nyak", type: "neck" },
  { id: 1, name: "Bicepsz", type: "biceps" },
  { id: 10, name: "Alkar", type: "forearm" },
  { id: 43, name: "Kéz", type: "hand" },
  { id: 15, name: "Oldal", type: "side" },
  { id: 12, name: "Has", type: "back" },
  { id: 3, name: "Comb", type: "chest" },
  { id: 11, name: "Alsó láb", type: "leg" },
  { id: 5, name: "Tricepsz", type: "triceps" },
  { id: 14, name: "Hát felső", type: "back" },
  { id: 7, name: "Hát oldal", type: "back" },
  { id: 13, name: "Hát alsó", type: "back" },
  { id: 8, name: "Fenék", type: "glutes" },
  //   { id: 11, name: 'Comb hajlító'}
];

const categories = [
  { id: 2, name: "Súlyzós edzés" },
  { id: 4, name: "Gépes edzés" },
  { id: 7, name: "Kettlebell" },
  { id: 9, name: "Kábel" },
  { id: 11, name: "Tárcsás" },
  { id: 85, name: "Smith gép" },
  { id: 1, name: "Barbell" },
  { id: 3, name: "Testtömeg" },
  { id: 27, name: "Kardió" },
];

const APIExercisesComponent = () => {
  // State for query parameters with defaults from your sample
  const [limit, setLimit] = useState<number | null>(1);
  const [offset, setOffset] = useState<number | null>(1);
  const [category, setCategory] = useState<number | null>(null);
  const [status, setStatus] = useState<any>("Published");
  const [ordering, setOrdering] = useState<any>("-featured_weight");
  const [muscles, setMuscles] = useState<any>(1);

  // State for fetched data and UI
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch exercises based on current parameters
  const fetchExercises = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        limit: limit?.toString() || "1",
        offset: offset?.toString() || "0",
        category: category?.toString() || "",
        status,
        ordering,
        muscles: muscles.toString(),
      });

      const response = await fetch(
        `/api/api-exercise?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch exercises: ${response.statusText}`);
      }

      const data = await response.json();

      // Handle case where data.results is not an array or is empty
      if (!Array.isArray(data.results)) {
        throw new Error("Invalid response format: results is not an array");
      }

      // Extract exercises and YouTube links
      const exercisesWithLinks: Exercise[] = data.results.map(
        (exercise: any) => {
          return {
            id: exercise.id || 0, // Fallback for missing ID
            name: exercise.name || "Unnamed Exercise", // Fallback for missing name
            branded_video: exercise.male_images[0].branded_video, // Embed URL or null
          };
        }
      );

      setExercises(exercisesWithLinks);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const saveExercise = async (exerciseItem: Exercise) => {
    if (
      !exerciseItem.reps ||
      !exerciseItem.sets ||
      !exerciseItem.weight ||
      !exerciseItem.rest_time ||
      !exerciseItem.branded_video
    ) {
      showNotification("Minden mezőt ki kell tölteni", "error");
      return;
    }

    const exercise = {
      name: exerciseItem.name,
      description: "",
      types: [muscleGroups.find((muscle) => muscle.id === muscles)?.type],
      repetitions: exerciseItem.reps,
      sets: exerciseItem.sets,
      weight: exerciseItem.weight,
      restTime: exerciseItem.rest_time,
      video: exerciseItem.branded_video,
      note: "",
    };

    const response = await fetch("/api/exercise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(exercise),
    });

    if (response.ok) {
      const data = await response.json();
      showNotification("Edzés mentve", "success");
    } else {
      console.error("Error saving exercise:", response.statusText);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg text-black">
      <h1 className="text-2xl font-bold mb-4 mt-4 text-center">
        Edzés keresése MuscleWiki-n
      </h1>
      <div className="flex flex-col space-y-6 bg-white p-6 rounded-lg shadow-lg border border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum eredmények száma
            </label>
            <input
              type="number"
              value={limit || ""}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full border border-gray-300 p-2.5 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              min="1"
              max="100"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keresés előzményeinek száma
            </label>
            <input
              type="number"
              value={offset || ""}
              disabled={true}
              onChange={(e) => setOffset(Number(e.target.value))}
              className="w-full border disabled:bg-gray-100 border-gray-300 p-2.5 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Edzés kategóriája
          </label>
          <select
            value={category || ""}
            onChange={(e) => setCategory(Number(e.target.value))}
            className="w-full border border-gray-300 p-2.5 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition duration-200"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Izmok
          </label>
          <select
            value={muscles}
            onChange={(e) => setMuscles(Number(e.target.value))}
            className="w-full border border-gray-300 p-2.5 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition duration-200"
          >
            {muscleGroups.map((muscle) => (
              <option key={muscle.id} value={muscle.id}>
                {muscle.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchExercises}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition duration-200 hover:scale-[1.02] active:scale-[0.98] text-base font-medium shadow-md"
        >
          Edzés keresése
        </button>
      </div>

      {loading && <p className="mt-4 text-center">Loading...</p>}
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      <div className="mt-4 space-y-4">
        {exercises.length > 0
          ? exercises.map((exercise) => (
              <div key={exercise.id} className="p-4 border rounded">
                <h3 className="text-lg font-bold">{exercise.name}</h3>
                {exercise.branded_video && (
                  <div className="aspect-w-16 aspect-h-9">
                    <video
                      src={exercise.branded_video}
                      // controls
                      playsInline
                      autoPlay
                      muted
                      loop
                      preload="metadata"
                    />
                  </div>
                )}
                <div className="flex flex-row flex-wrap gap-2 justify-between w-full mt-4">
                  <input
                    className="border p-2 w-[47%] rounded text-base"
                    placeholder="Ismétlés"
                    type="number"
                    value={exercise.reps || ""}
                    onChange={(e) => {
                      const updatedExercises = exercises.map((ex) =>
                        ex.id === exercise.id
                          ? { ...ex, reps: Number(e.target.value) }
                          : ex
                      );
                      setExercises(updatedExercises);
                    }}
                  />
                  <input
                    className="border p-2 w-[47%] rounded text-base"
                    placeholder="Sorozat"
                    type="number"
                    value={exercise.sets || ""}
                    onChange={(e) => {
                      const updatedExercises = exercises.map((ex) =>
                        ex.id === exercise.id
                          ? { ...ex, sets: Number(e.target.value) }
                          : ex
                      );
                      setExercises(updatedExercises);
                    }}
                  />
                  <input
                    className="border p-2 w-[47%] rounded text-base"
                    placeholder="Pihenés"
                    type="number"
                    value={exercise.rest_time || ""}
                    onChange={(e) => {
                      const updatedExercises = exercises.map((ex) =>
                        ex.id === exercise.id
                          ? { ...ex, rest_time: Number(e.target.value) }
                          : ex
                      );
                      setExercises(updatedExercises);
                    }}
                  />
                  <input
                    className="border p-2 w-[47%] rounded text-base"
                    placeholder="Súly"
                    type="number"
                    value={exercise.weight || ""}
                    onChange={(e) => {
                      const updatedExercises = exercises.map((ex) =>
                        ex.id === exercise.id
                          ? { ...ex, weight: Number(e.target.value) }
                          : ex
                      );
                      setExercises(updatedExercises);
                    }}
                  />
                </div>
                <button
                  onClick={() => saveExercise(exercise)}
                  className="bg-blue-500 w-full mt-2 text-white p-2 rounded hover:bg-blue-600 text-base"
                >
                  Mentés
                </button>
              </div>
            ))
          : !loading && <p className="text-center">No exercises found.</p>}
      </div>
    </div>
  );
};

export default APIExercisesComponent;
