import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { showNotification } from "@/lib/showNotification";
import { useRouter } from "next/router";

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

interface WorkoutProgress {
  workoutId: string;
  _id: string;
  startTime: string;
  currentExerciseIndex: number;
  exerciseProgress: {
    [exerciseId: string]: {
      sets: { completed: boolean; reps: number; weight: number }[];
    };
  };
}

const WorkoutListComponent = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [progress, setProgress] = useState<WorkoutProgress | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("/api/workout");
        const data = await response.json();
        if (!Array.isArray(data)) {
          showNotification("Hiba történt az edzések betöltésekor", "error");
          return;
        }
        setWorkouts(data);
      } catch (error) {
        showNotification("Hiba történt az edzések betöltésekor", "error");
      }
    };

    fetchWorkouts();

    const savedProgress = localStorage.getItem("workoutProgress");
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
      setShowResumeModal(true);
    }
  }, []);

  const startWorkout = (workout: Workout) => {
    router.push(`/current-workout?workoutId=${workout._id}`);
  };

  const resumeWorkout = () => {
    if (!progress) return;
    router.push(`/current-workout?workoutId=${progress._id}`);
    setShowResumeModal(false);
  };

  const deleteProgress = () => {
    localStorage.removeItem("workoutProgress");
    setProgress(null);
    setShowResumeModal(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto text-black">
      <h2 className="text-2xl font-semibold mb-4">Edzések indítása</h2>
      <div className="grid gap-4">
        {workouts.map((workout) => (
          <div
            key={workout._id}
            className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 cursor-pointer shadow flex justify-between items-center"
          >
            <div onClick={() => startWorkout(workout)}>
              <h3 className="text-lg font-bold">{workout.name}</h3>
              <p className="text-sm text-gray-600">{workout.description}</p>
              <p className="text-sm text-gray-600">
                Gyakorlatok: {workout.exercises.map((e) => e.name).join(", ")}
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => startWorkout(workout)}
            >
              <PlayIcon className="w-4 h-4" />
              Indítás
            </button>
          </div>
        ))}
      </div>

      <Dialog
        open={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        className="relative z-50 text-black"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg space-y-4">
            <Dialog.Title className="text-xl font-bold text-center">
              Folytatás
            </Dialog.Title>
            <p>Folytatni szeretnéd a korábbi edzést, vagy újat kezdeni?</p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={resumeWorkout}
              >
                Folytatás
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={deleteProgress}
              >
                Törlés
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default WorkoutListComponent;