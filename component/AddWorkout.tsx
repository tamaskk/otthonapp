import React, { useEffect, useState } from 'react';

enum ExerciseType {
  CHEST = "chest",
  BACK = "back",
  LEG = "leg",
  BICEPS = "biceps",
  TRICEPS = "triceps",
  SHOULDER = "shoulder",
  ABS = "abs",
  FUNCTIONAL = "functional",
  CARDIO = "cardio",
  GLUTES = "glutes",
  MOBILITY = "mobility",
  STRETCHING = "stretching",
  OTHER = "other",
}

interface Exercise {
  _id: string;
  name: string;
  description: string;
  types: ExerciseType[];
  repetitions: number | null;
  sets: number | null;
  weight: number | null;
  restTime: number | null;
}

const AddWorkoutComponent = () => {
  const [workoutName, setWorkoutName] = useState<string>("");
  const [workoutDescription, setWorkoutDescription] = useState<string>("");
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [workoutTypes, setWorkoutTypes] = useState<ExerciseType[]>([]);
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [exerciseFilter, setExerciseFilter] = useState<ExerciseType | "all">("all");
  const [isSaving, setIsSaving] = useState(false);

  const fetchExercises = async () => {
    try {
      const response = await fetch("/api/exercise");
      if (!response.ok) throw new Error("Failed to fetch exercises");
      const data = await response.json();
      setExerciseList(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const toggleWorkoutType = (type: ExerciseType) => {
    setWorkoutTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const saveWorkout = async () => {
    setIsSaving(true);
    const workout = {
      name: workoutName,
      description: workoutDescription,
      types: workoutTypes,
      exercises: selectedExercises,
    };

    try {
      const response = await fetch("/api/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workout),
      });

      if (!response.ok) throw new Error("Failed to save workout");

      const data = await response.json();
      setWorkoutName("");
      setWorkoutDescription("");
      setSelectedExercises([]);
      setWorkoutTypes([]);
      setExerciseFilter("all");
      console.log("Workout saved successfully:", data);
    } catch (error) {
      console.error("Error saving workout:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExerciseSelection = (exercise: Exercise) => {
    setSelectedExercises(prev =>
      prev.some(e => e._id === exercise._id)
        ? prev.filter(e => e._id !== exercise._id)
        : [...prev, exercise]
    );
  };

  const filteredExercises =
    exerciseFilter === "all"
      ? exerciseList
      : exerciseList.filter(ex => ex.types.includes(exerciseFilter));

  return (
    <div className="max-w-4xl text-black mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-4">Add New Workout</h1>

      {/* Name Input */}
      <input
        type="text"
        placeholder="Workout Name"
        value={workoutName}
        onChange={e => setWorkoutName(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
      />

      {/* Description */}
      <textarea
        placeholder="Workout Description"
        value={workoutDescription}
        onChange={e => setWorkoutDescription(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md resize-none h-24 focus:outline-none focus:ring focus:ring-blue-400"
      />

      {/* Workout Types */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Workout Types</h2>
        <div className="flex flex-wrap gap-2">
          {Object.values(ExerciseType).map(type => (
            <label
              key={type}
              className="flex items-center gap-2 px-3 py-1 border rounded-full cursor-pointer text-sm transition hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={workoutTypes.includes(type)}
                onChange={() => toggleWorkoutType(type)}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-sm">Filter Exercises by Type:</label>
        <select
          value={exerciseFilter}
          onChange={(e) => setExerciseFilter(e.target.value as ExerciseType | "all")}
          className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        >
          <option value="all">All Types</option>
          {Object.values(ExerciseType).map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Exercise Selection */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Select Exercises</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
          {filteredExercises.map(exercise => (
            <div
              key={exercise._id}
              className={`p-3 border rounded-md cursor-pointer hover:shadow transition ${
                selectedExercises.some(e => e._id === exercise._id)
                  ? "bg-blue-100 border-blue-400"
                  : "bg-white"
              }`}
              onClick={() => handleExerciseSelection(exercise)}
            >
              <h3 className="font-medium">{exercise.name}</h3>
              <p className="text-sm text-gray-600">{exercise.description}</p>
              <p className="text-xs text-gray-500">
                Types: {exercise.types.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveWorkout}
        disabled={isSaving}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Workout"}
      </button>
    </div>
  );
};

export default AddWorkoutComponent;
