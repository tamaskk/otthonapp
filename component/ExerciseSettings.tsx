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
  types: ExerciseType[] | null;
  repetitions: number | null;
  sets: number | null;
  weight: number | null;
  restTime: number | null;
}

const exerciseTypeOptions: { name: string; value: ExerciseType }[] = [
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

const ExerciseSettingsComponent = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/exercise");
        const data = await response.json();
        if (!Array.isArray(data)) {
          showNotification('Hiba történt az adatok betöltésekor', 'error');
          return;
        }
        setExercises(data);
      } catch (error) {
        showNotification('Hiba történt az adatok betöltésekor', 'error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchExercises();
  }, []);

  const openModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleInputChange = (field: keyof Exercise, value: any) => {
    if (!selectedExercise) return;
    setSelectedExercise({ ...selectedExercise, [field]: value });
  };

  const toggleExerciseType = (type: ExerciseType) => {
    if (!selectedExercise) return;
  
    const updatedTypes = selectedExercise?.types?.includes(type)
      ? selectedExercise?.types?.filter((t) => t !== type)
      : [...(selectedExercise?.types || []), type];
  
    setSelectedExercise({
      ...selectedExercise,
      types: updatedTypes,
    });
  };
  

  const saveEditedExercise = async () => {
    if (!selectedExercise) return;

    const editedExercise = {
      name: selectedExercise.name,
      description: selectedExercise.description,
      types: selectedExercise.types,
      repetitions: selectedExercise.repetitions,
      sets: selectedExercise.sets,
      weight: selectedExercise.weight,
      restTime: selectedExercise.restTime,
    };

    const response = await fetch(`/api/exercise?id=${selectedExercise._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ exercise: editedExercise }),
    });

    if (!response.ok) {
      showNotification('Hiba történt a gyakorlat mentésekor', 'error');
      return;
    }

    const data = await response.json();

    if (!data) {
      showNotification('Hiba történt a gyakorlat mentésekor', 'error');
      return;
    }

    showNotification('Gyakorlat mentve', 'success');

    setExercises((prev) =>
      prev.map((e) =>
        e.name === selectedExercise?.name ? selectedExercise! : e
      )
    );
    setModalOpen(false);
  };

  const deleteExercise = async () => {
    if (!selectedExercise) return;

    const confirmModal = window.confirm(
      `Biztosan törölni szeretnéd a "${selectedExercise.name}" gyakorlatot?`
    );

    const response = await fetch(`/api/exercise?id=${selectedExercise._id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      showNotification('Hiba történt a gyakorlat törlésekor', 'error');
      return;
    }

    const data = await response.json();

    if (!data) {
      showNotification('Hiba történt a gyakorlat törlésekor', 'error');
      return;
    }

    showNotification('Gyakorlat törölve', 'success');

    setExercises((prev) =>
      prev.filter((e) => e.name !== selectedExercise.name)
    );
    setModalOpen(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto text-black">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Gyakorlatok kezelése
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-4">Még nincsenek gyakorlatok</p>
          <p className="text-gray-500">Kattints a szerkesztés gombra egy új gyakorlat hozzáadásához</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {exercises.map((exercise, idx) => (
            <div
              key={idx}
              onClick={() => openModal(exercise)}
              className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 cursor-pointer shadow"
            >
              <h3 className="text-lg font-bold">{exercise.name}</h3>
              <p className="text-sm text-gray-600">{exercise.description}</p>
              <p className="text-sm text-gray-600">
                {exercise?.types
                  ?.map(
                    (type) =>
                      exerciseTypeOptions.find((opt) => opt.value === type)?.name
                  )
                  .join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal
        handlerFunction={() => setModalOpen(false)}
        state={modalOpen}
      >
        <div className="space-y-4 h-fit">
          <span>
            <strong>Gyakorlat neve:</strong>
          </span>
          <input
            className="w-full border rounded p-2"
            value={selectedExercise?.name}
            disabled={!isEditing}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <span>
            <strong>Típus(ok):</strong>
          </span>
          {isEditing ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {exerciseTypeOptions.map(({ name, value }) => (
                <button
                  key={value}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border text-sm ${
                    selectedExercise?.types?.includes(value)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                  onClick={() => toggleExerciseType(value)}
                >
                  {name}
                  {selectedExercise?.types?.includes(value) && (
                    <Check size={16} />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <p>
              {(selectedExercise?.types ?? [])
                .map(
                  (type) =>
                    exerciseTypeOptions.find((opt) => opt.value === type)?.name
                )
                .join(", ")}
            </p>

          )}

          <span>
            <strong>Ismétlések:</strong>
          </span>
          <input
            className="w-full border rounded p-2"
            type="number"
            placeholder="Ismétlés"
            value={selectedExercise?.repetitions ?? ""}
            disabled={!isEditing}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty string or valid number
              if (value === '') {
                handleInputChange('repetitions', '');
              } else if (!isNaN(Number(value))) {
                handleInputChange('repetitions', value);
              }
            }}
          />
          <span>
            <strong>Szettek:</strong>
          </span>
          <input
            className="w-full border rounded p-2 disabled:bg-gray-100"
            type="text"
            placeholder="Szettek"
            value={selectedExercise?.sets ?? ''}
            disabled={!isEditing}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty string or valid number
              if (value === '') {
                handleInputChange('sets', '');
              } else if (!isNaN(Number(value))) {
                handleInputChange('sets', value);
              }
            }}
          />
          <span>
            <strong>Súly:</strong>
          </span>
          <input
            className="w-full border rounded p-2"
            type="number"
            placeholder="Súly (kg)"
            value={selectedExercise?.weight ?? ""}
            disabled={!isEditing}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty string or valid number
              if (value === '') {
                handleInputChange('weight', '');
              } else if (!isNaN(Number(value))) {
                handleInputChange('weight', value);
              }
            }}
          />
          <span>
            <strong>Pihenőidő:</strong>
          </span>
          <input
            className="w-full border rounded p-2"
            type="number"
            placeholder="Pihenőidő (mp)"
            value={selectedExercise?.restTime ?? ""}
            disabled={!isEditing}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty string or valid number
              if (value === '') {
                handleInputChange('restTime', '');
              } else if (!isNaN(Number(value))) {
                handleInputChange('restTime', value);
              }
            }}
          />

          <div className="flex flex-col sm:flex-row items-center gap-2">
            {isEditing ? (
              <button
                className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={saveEditedExercise}
              >
                Mentés
              </button>
            ) : (
              <button
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon className="w-4 h-4" />
                Szerkesztés
              </button>
            )}
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={deleteExercise}
            >
              <TrashIcon className="w-4 h-4" />
              Törlés
            </button>
            <button
              className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={() => setModalOpen(false)}
            >
              Bezárás
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExerciseSettingsComponent;
