import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Check } from "lucide-react";
import { showNotification } from "@/lib/showNotification";
import Modal from "./Modal";

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

interface Workout {
  _id: string;
  name: string;
  description: string;
  types: ExerciseType[];
  exercises: Exercise[];
}

const workoutTypeOptions: { name: string; value: ExerciseType }[] = [
  { name: "Mell", value: ExerciseType.CHEST },
  { name: "Hát", value: ExerciseType.BACK },
  { name: "Láb", value: ExerciseType.LEG },
  { name: "Bicepsz", value: ExerciseType.BICEPS },
  { name: "Tricepsz", value: ExerciseType.TRICEPS },
  { name: "Váll", value: ExerciseType.SHOULDER },
  { name: "Has", value: ExerciseType.ABS },
  { name: "Funkcionális", value: ExerciseType.FUNCTIONAL },
  { name: "Kardió", value: ExerciseType.CARDIO },
  { name: "Fenék", value: ExerciseType.GLUTES },
  { name: "Mobilitás", value: ExerciseType.MOBILITY },
  { name: "Nyújtás", value: ExerciseType.STRETCHING },
  { name: "Egyéb", value: ExerciseType.OTHER },
];

const WorkoutSettingsComponent = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/workout");
        const data = await response.json();
        if (!Array.isArray(data)) {
          showNotification("Hiba történt az adatok betöltésekor", "error");
          return;
        }
        setWorkouts(data);
      } catch (error) {
        showNotification("Hiba történt az adatok betöltésekor", "error");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchExercises = async () => {
      try {
        const response = await fetch("/api/exercise");
        const data = await response.json();
        if (!Array.isArray(data)) {
          showNotification("Hiba történt a gyakorlatok betöltésekor", "error");
          return;
        }
        setAvailableExercises(data);
      } catch (error) {
        showNotification("Hiba történt a gyakorlatok betöltésekor", "error");
      }
    };

    fetchWorkouts();
    fetchExercises();
  }, []);

  const openModal = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleInputChange = (field: keyof Workout, value: any) => {
    if (!selectedWorkout) return;
    setSelectedWorkout({ ...selectedWorkout, [field]: value });
  };

  const toggleWorkoutType = (type: ExerciseType) => {
    if (!selectedWorkout) return;
    const updatedTypes = selectedWorkout.types.includes(type)
      ? selectedWorkout.types.filter((t) => t !== type)
      : [...selectedWorkout.types, type];
    setSelectedWorkout({
      ...selectedWorkout,
      types: updatedTypes,
    });
  };

  const toggleExercise = (exercise: Exercise) => {
    if (!selectedWorkout) return;
    const updatedExercises = selectedWorkout.exercises.some(
      (e) => e._id === exercise._id
    )
      ? selectedWorkout.exercises.filter((e) => e._id !== exercise._id)
      : [...selectedWorkout.exercises, exercise];
    setSelectedWorkout({
      ...selectedWorkout,
      exercises: updatedExercises,
    });
  };

  const saveEditedWorkout = async () => {
    if (!selectedWorkout) return;
    setIsSaving(true);

    const editedWorkout = {
      name: selectedWorkout.name,
      description: selectedWorkout.description,
      types: selectedWorkout.types,
      exercises: selectedWorkout.exercises,
    };

    try {
      const response = await fetch(`/api/workout?id=${selectedWorkout._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workout: editedWorkout }),
      });

      if (!response.ok) {
        showNotification("Hiba történt az edzés mentésekor", "error");
        return;
      }

      const data = await response.json();
      if (!data) {
        showNotification("Hiba történt az edzés mentésekor", "error");
        return;
      }

      showNotification("Edzés mentve", "success");

      setWorkouts((prev) =>
        prev.map((w) =>
          w._id === selectedWorkout._id ? selectedWorkout : w
        )
      );
      setModalOpen(false);
    } catch (error) {
      showNotification("Hiba történt az edzés mentésekor", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteWorkout = async () => {
    if (!selectedWorkout) return;
    setIsDeleting(true);

    const confirmModal = window.confirm(
      `Biztosan törölni szeretnéd a "${selectedWorkout.name}" edzést?`
    );
    if (!confirmModal) {
      setIsDeleting(false);
      return;
    }

    try {
      const response = await fetch(`/api/workout?id=${selectedWorkout._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        showNotification("Hiba történt az edzés törlésekor", "error");
        return;
      }

      const data = await response.json();
      if (!data) {
        showNotification("Hiba történt az edzés törlésekor", "error");
        return;
      }

      showNotification("Edzés törölve", "success");

      setWorkouts((prev) =>
        prev.filter((w) => w._id !== selectedWorkout._id)
      );
      setModalOpen(false);
    } catch (error) {
      showNotification("Hiba történt az edzés törlésekor", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto text-black">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Edzés beállítások
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : workouts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">Még nincsenek edzések.</p>
          <p className="text-gray-500 mt-2">Kattints a szerkesztés gombra egy új edzés létrehozásához.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {workouts.map((workout) => (
            <div
              key={workout._id}
              onClick={() => openModal(workout)}
              className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 cursor-pointer shadow"
            >
              <h3 className="text-lg font-bold">{workout.name}</h3>
              <p className="text-sm text-gray-600">{workout.description}</p>
              <p className="text-sm text-gray-600">
                {workout.types
                  .map(
                    (type) =>
                      workoutTypeOptions.find((opt) => opt.value === type)?.name
                  )
                  .join(", ")}
              </p>
              <p className="text-sm text-gray-600">
                Gyakorlatok: {workout.exercises.map((e) => e.name).join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal
        handlerFunction={() => setModalOpen(false)}
        state={modalOpen}
      >
        {selectedWorkout && (
          <div className="space-y-4">
            <span>
              <strong>Edzés neve:</strong>
            </span>
            <input
              className="w-full border rounded p-2"
              value={selectedWorkout.name}
              disabled={!isEditing}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <span>
              <strong>Leírás:</strong>
            </span>
            <textarea
              className="w-full border rounded p-2"
              value={selectedWorkout.description}
              disabled={!isEditing}
              onChange={(e) =>
                handleInputChange("description", e.target.value)
              }
            />
            <span>
              <strong>Típus(ok):</strong>
            </span>
            {isEditing ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {workoutTypeOptions.map(({ name, value }) => (
                  <button
                    key={value}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl border text-sm ${
                      selectedWorkout.types.includes(value)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    onClick={() => toggleWorkoutType(value)}
                  >
                    {name}
                    {selectedWorkout.types.includes(value) && (
                      <Check size={16} />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p>
                {selectedWorkout.types
                  .map(
                    (type) =>
                      workoutTypeOptions.find((opt) => opt.value === type)?.name
                  )
                  .join(", ")}
              </p>
            )}
            <span>
              <strong>Gyakorlatok:</strong>
            </span>
            {isEditing ? (
              <div className="max-h-40 overflow-y-auto">
                {availableExercises.map((exercise) => (
                  <button
                    key={exercise._id}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm mb-2 ${
                      selectedWorkout.exercises.some(
                        (e) => e._id === exercise._id
                      )
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                    onClick={() => toggleExercise(exercise)}
                  >
                    {exercise.name}
                    {selectedWorkout.exercises.some(
                      (e) => e._id === exercise._id
                    ) && <Check size={16} />}
                  </button>
                ))}
              </div>
            ) : (
              <p>
                {selectedWorkout.exercises.map((e) => e.name).join(", ")}
              </p>
            )}

            <div className="flex justify-end space-x-4 mt-4">
              {isEditing ? (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={saveEditedWorkout}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mentés...
                    </div>
                  ) : (
                    "Mentés"
                  )}
                </button>
              ) : (
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setIsEditing(true)}
                >
                  <PencilIcon className="w-4 h-4" />
                  Szerkesztés
                </button>
              )}
              <button
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={deleteWorkout}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Törlés...
                  </div>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4" />
                    Törlés
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
export default WorkoutSettingsComponent;