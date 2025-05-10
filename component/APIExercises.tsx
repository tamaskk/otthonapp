import { useState } from 'react';

// Define types for muscle groups and exercises
interface MuscleGroup {
  id: number;
  name: string;
}

interface Exercise {
  id: number;
  name: string;
  description: string;
  // Add more fields as needed based on actual API response
}

// Hardcoded muscle groups (ideally fetched from API)
const muscleGroups: MuscleGroup[] = [
  { id: 1, name: 'Biceps' },
  { id: 2, name: 'Triceps' },
  { id: 3, name: 'Chest' },
  { id: 4, name: 'Back' },
];

const APIExercisesComponent = () => {
  // State for query parameters with defaults from your sample
  const [limit, setLimit] = useState(4);
  const [offset, setOffset] = useState(0);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Published');
  const [ordering, setOrdering] = useState('-featured_weight');
  const [muscles, setMuscles] = useState(1);

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
        limit: limit.toString(),
        offset: offset.toString(),
        category: category,
        status: status,
        ordering: ordering,
        muscles: muscles.toString(),
      });
      const response = await fetch(`https://musclewiki.com/newapi/exercise/exercises/?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }
      const data = await response.json();
      setExercises(data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg text-black">
      <h1 className="text-2xl font-bold mb-4 text-center">Exercise Search</h1>
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Limit</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full border p-2 rounded text-base"
            min="1"
            max="100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Offset</label>
          <input
            type="number"
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            className="w-full border p-2 rounded text-base"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded text-base"
          >
            <option value="">All</option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded text-base"
          >
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ordering</label>
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="w-full border p-2 rounded text-base"
          >
            <option value="-featured_weight">Featured</option>
            <option value="name">Name A-Z</option>
            <option value="-name">Name Z-A</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Muscles</label>
          <select
            value={muscles}
            onChange={(e) => setMuscles(Number(e.target.value))}
            className="w-full border p-2 rounded text-base"
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
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-base"
        >
          Fetch Exercises
        </button>
      </div>

      {loading && <p className="mt-4 text-center">Loading...</p>}
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      <div className="mt-4 space-y-4">
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <div key={exercise.id} className="p-4 border rounded">
              <h3 className="text-lg font-bold">{exercise.name}</h3>
              <p className="text-sm">{exercise.description}</p>
            </div>
          ))
        ) : (
          !loading && <p className="text-center">No exercises found.</p>
        )}
      </div>
    </div>
  );
};

export default APIExercisesComponent;