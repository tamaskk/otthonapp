import React, { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { showNotification } from '@/lib/showNotification';

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
  OTHER = "other"
}

const exerciseTypeOptions: { name: string, value: ExerciseType }[] = [
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
  { name: "Egyéb", value: ExerciseType.OTHER }
];

const AddExerciseComponent = () => {
  const [exerciseName, setExerciseName] = useState<string>("");
  const [exerciseDescription, setExerciseDescription] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<ExerciseType[]>([]);
  const [repetitions, setRepetitions] = useState<number | null>(null);
  const [sets, setSets] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [restTime, setRestTime] = useState<number | null>(null);

  const toggleExerciseType = (type: ExerciseType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const saveExercise = async () => {
    const exercise = {
      name: exerciseName,
      description: exerciseDescription,
      types: selectedTypes,
      repetitions,
      sets,
      weight,
      restTime
    };

    const response = await fetch("/api/exercise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(exercise)
    });

    if (response.ok) {
      const data = await response.json();
      showNotification('Gyakorlat mentve', 'success');
      // Reset form fields
      setExerciseName("");
      setExerciseDescription("");
      setSelectedTypes([]);
      setRepetitions(null);
      setSets(null);
      setWeight(null);
      setRestTime(null);
    } else {
      console.error("Error saving exercise:", response.statusText);
    }
  };

  return (
    <div className="max-h-[100dvh] text-black p-8 flex-1 h-screen overflow-y-auto overflow-x-hidden flex flex-col relative bg-gray-50">
    <h2 className="text-2xl font-semibold">Új gyakorlat hozzáadása</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Gyakorlat neve"
          className="w-full border placeholder:text-gray-500 rounded-xl px-4 py-2"
          value={exerciseName}
          onChange={e => setExerciseName(e.target.value)}
        />

        <textarea
          placeholder="Leírás (opcionális)"
          className="w-full border rounded-xl px-4 py-2 placeholder:text-gray-500 min-h-[100px]"
          value={exerciseDescription}
          onChange={e => setExerciseDescription(e.target.value)}
        />

        <div>
          <p className="font-medium mb-2">Típus(ok)</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {exerciseTypeOptions.map(({ name, value }) => (
              <button
                key={value}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-sm ${
                  selectedTypes.includes(value)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
                onClick={() => toggleExerciseType(value)}
              >
                {name}
                {selectedTypes.includes(value) && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <input
            type="number"
            placeholder="Ismétlések"
            className="border rounded-xl px-3 py-2 w-full"
            value={repetitions || ''}
            onChange={e => setRepetitions(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Sorozatok"
            className="border rounded-xl px-3 py-2 w-full"
            value={sets || ''}
            onChange={e => setSets(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Súly (kg)"
            className="border rounded-xl px-3 py-2 w-full"
            value={weight || ''}
            onChange={e => setWeight(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Pihenő (mp)"
            className="border rounded-xl px-3 py-2 w-full"
            value={restTime || ''}
            onChange={e => setRestTime(Number(e.target.value))}
          />
        </div>

        <button
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl"
          onClick={saveExercise}
        >
          Gyakorlat mentése
        </button>
        <button
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl"
        >
          AI Generálás
        </button>
      </div>
    </div>
  );
};

export default AddExerciseComponent;
