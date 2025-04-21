import React, { useState } from 'react'
import { Check } from 'lucide-react'
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
  const [note, setNote] = useState<string>("");

  const toggleExerciseType = (type: ExerciseType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const getAIExercise = async () => {

    if (selectedTypes.length === 0) {
      showNotification('Kérlek válassz egy típust!', 'error');
      return;
    }

    try {
      showNotification('AI recept generálása folyamatban...', 'info');
      const response = await fetch('/api/ai-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: selectedTypes[0] }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('AI Recipe:', data);
        setExerciseName(data.name);
        setExerciseDescription(data.description);
        setSelectedTypes(data.types.map((type: string) => type.toLowerCase() as ExerciseType));
        setRepetitions(data.repetitions);
        setSets(data.sets);
        setWeight(data.weight);
        setRestTime(data.restTime);
        setNote(data.note);
        showNotification('AI recept sikeresen generálva!', 'success');
      } else {
        console.error('Error fetching AI recipe:', data.error);
      }
    } catch (error) { 
      console.error('Error:', error);
    }
  }

  const saveExercise = async () => {
    const exercise = {
      name: exerciseName,
      description: exerciseDescription,
      types: selectedTypes,
      repetitions,
      sets,
      weight,
      restTime,
      note
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
<div className="max-h-[100dvh] h-screen overflow-y-auto overflow-x-hidden flex flex-col bg-gray-100 text-gray-900 p-6 sm:p-8">
<h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Új gyakorlat hozzáadása</h1>

  <div className="space-y-6 bg-white rounded-2xl shadow-sm p-6 sm:p-8">
    <input
      type="text"
      placeholder="Gyakorlat neve"
      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      value={exerciseName}
      onChange={e => setExerciseName(e.target.value)}
    />

    <textarea
      placeholder="Leírás (opcionális)"
      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 placeholder:text-gray-400 min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      value={exerciseDescription}
      onChange={e => setExerciseDescription(e.target.value)}
    />

    <div>
      <p className="font-semibold text-gray-700 mb-3">Típus(ok)</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {exerciseTypeOptions.map(({ name, value }) => (
          <button
            key={value}
            className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm font-medium transition ${
              selectedTypes.includes(value)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
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
        className="border border-gray-200 rounded-lg px-4 py-3 w-full text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={repetitions || ''}
        onChange={e => setRepetitions(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Sorozatok"
        className="border border-gray-200 rounded-lg px-4 py-3 w-full text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={sets || ''}
        onChange={e => setSets(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Súly (kg)"
        className="border border-gray-200 rounded-lg px-4 py-3 w-full text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={weight || ''}
        onChange={e => setWeight(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Pihenő (mp)"
        className="border border-gray-200 rounded-lg px-4 py-3 w-full text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={restTime || ''}
        onChange={e => setRestTime(Number(e.target.value))}
      />
    </div>

    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={saveExercise}
      >
        Gyakorlat mentése
      </button>
      <button
        onClick={getAIExercise}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        AI Generálás
      </button>
    </div>
  </div>
</div>
  );
};

export default AddExerciseComponent;
