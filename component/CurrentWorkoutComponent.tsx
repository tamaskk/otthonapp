import React, { useEffect, useState } from "react";
import { FolderIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { showNotification } from "@/lib/showNotification";

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
  note: string | null;
  video: string | null;
}

interface Workout {
  _id: string;
  name: string;
  description: string;
  types: ExerciseType[];
  exercises: Exercise[];
}

interface WorkoutProgress {
  _id: string;
  startTime: string;
  currentExerciseIndex: number;
  exerciseProgress: {
    [exerciseId: string]: {
      sets: {
        completed: boolean;
        reps: number | null;
        weight: number | null;
      }[];
    };
  };
}

const WorkoutStartComponent = () => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [progress, setProgress] = useState<WorkoutProgress | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [editedExercise, setEditedExercise] = useState<Exercise | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const router = useRouter();
  const { workoutId } = router.query;

  useEffect(() => {
    if (!workoutId || typeof workoutId !== "string") {
      showNotification("Nincs edzés azonosító megadva", "error");
      router.push("/start-workout");
      return;
    }

    const fetchWorkout = async () => {
      try {
        const response = await fetch(`/api/workout?id=${workoutId}`);
        const data = await response.json();
        if (!data || !data._id) {
          showNotification("Nem található az edzés", "error");
          router.push("/start-workout");
          return;
        }
        setWorkout(data);
        console.log("Fetched workout:", data);

        const savedProgress = localStorage.getItem("workoutProgress");
        if (savedProgress) {
          const parsedProgress: WorkoutProgress = JSON.parse(savedProgress);
          if (parsedProgress._id === workoutId) {
            setProgress(parsedProgress);
            setStartTime(new Date(parsedProgress.startTime));
            setCurrentExerciseIndex(parsedProgress.currentExerciseIndex);
            console.log("Loaded progress from localStorage:", parsedProgress);
          } else {
            initializeProgress(data);
          }
        } else {
          initializeProgress(data);
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
        showNotification("Hiba történt az edzés betöltésekor", "error");
        router.push("/start-workout");
      }
    };

    fetchWorkout();
  }, [workoutId, router]);

  const initializeProgress = (workout: Workout) => {
    console.log("Initializing progress for workout:", workout);
    if (!workout?.exercises) {
      console.error("Workout or exercises missing:", workout);
      showNotification("Érvénytelen edzésadatok", "error");
      return;
    }
    const initialProgress: WorkoutProgress = {
      _id: workout._id,
      startTime: new Date().toISOString(),
      currentExerciseIndex: 0,
      exerciseProgress: workout.exercises.reduce((acc, exercise) => {
        console.log("Processing exercise:", exercise);
        return {
          ...acc,
          [exercise._id]: {
            sets: Array(exercise.sets || 1)
              .fill(null)
              .map(() => ({
                completed: false,
                reps: exercise.repetitions || 0,
                weight: exercise.weight || 0,
              })),
          },
        };
      }, {}),
    };
    setProgress(initialProgress);
    setStartTime(new Date());
    setCurrentExerciseIndex(0);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    if (progress) {
      localStorage.setItem("workoutProgress", JSON.stringify(progress));
    }
  }, [progress]);

  const updateSetProgress = (
    exerciseId: string,
    setIndex: number,
    field: "completed" | "reps" | "weight",
    value: boolean | number | string
  ) => {
    setProgress((prev) => {
      if (!prev) return prev;
      const updatedProgress = { ...prev };
      const set = updatedProgress.exerciseProgress[exerciseId].sets[setIndex];

      if (field === "completed" && typeof value === "boolean") {
        set.completed = value;
      } else if (field === "reps" && typeof value === "number") {
        set.reps = value;
      } else if (field === "weight" && typeof value === "number") {
        set.weight = value;
      }

      console.log("Updated progress:", updatedProgress);
      return updatedProgress;
    });
  };

  const addSet = (exerciseId: string) => {
    setProgress((prev) => {
      if (!prev) return prev;
      const updatedProgress = { ...prev };
      updatedProgress.exerciseProgress[exerciseId].sets.push({
        completed: false,
        reps: updatedProgress.exerciseProgress[exerciseId].sets[0]?.reps || 0,
        weight:
          updatedProgress.exerciseProgress[exerciseId].sets[0]?.weight || 0,
      });
      console.log("Added set, new progress:", updatedProgress);
      return updatedProgress;
    });
  };

  const nextExercise = () => {
    setEditedExercise(null);
    if (!workout || !progress) return;
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setProgress((prev) =>
        prev
          ? { ...prev, currentExerciseIndex: currentExerciseIndex + 1 }
          : prev
      );
    }
  };

  const prevExercise = () => {
    setEditedExercise(null);
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setProgress((prev) =>
        prev
          ? { ...prev, currentExerciseIndex: currentExerciseIndex - 1 }
          : prev
      );
    }
  };

  const finishWorkout = async () => {
    if (!workout || !progress) return;
    try {
      const response = await fetch("/api/workout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workoutId: workout._id,
          progress: progress.exerciseProgress,
          dayOfExercise: new Date().toISOString(),
          startTime: progress.startTime,
          endTime: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        showNotification("Hiba történt az edzés mentésekor", "error");
        return;
      }
      showNotification("Edzés sikeresen elmentve", "success");
      localStorage.removeItem("workoutProgress");
      setProgress(null);
      router.push("/start-workout");
    } catch (error) {
      console.error("Error saving workout:", error);
      showNotification("Hiba történt az edzés mentésekor", "error");
    }
  };

  const updateExercise = async (exerciseId: string) => {
    if (!workout || !editedExercise) return;

    const updatedExercise: Exercise = {
      _id: exerciseId,
      name: editedExercise.name,
      description: editedExercise.description,
      types: editedExercise.types,
      repetitions: editedExercise.repetitions,
      sets: editedExercise.sets,
      weight: editedExercise.weight,
      restTime: editedExercise.restTime,
      note: editedExercise.note,
      video: editedExercise.video
    };

    try {
      const response = await fetch(`/api/exercise?id=${exerciseId}&workoutId=${workoutId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exercise: updatedExercise }),
      });

      if (!response.ok) {
        throw new Error("Failed to update exercise");
      }

      const data = await response.json();
      if (!data) {
        throw new Error("No data returned");
      }

      setEditedExercise(null);
      showNotification("Gyakorlat frissítve", "success");

      // Update workout state with new exercise data
      const updatedWorkout: Workout = {
        ...workout,
        exercises: workout.exercises.map((exercise) =>
          exercise._id === exerciseId ? updatedExercise : exercise
        )
      };
      setWorkout(updatedWorkout);

      // Update progress state with new exercise parameters
      setProgress((prev) => {
        if (!prev) return prev;
        const updatedProgress = { ...prev };
        updatedProgress.exerciseProgress[exerciseId] = {
          sets: Array(updatedExercise.sets || 1).fill(null).map(() => ({
            completed: false,
            reps: updatedExercise.repetitions || 0,
            weight: updatedExercise.weight || 0
          }))
        };
        localStorage.setItem("workoutProgress", JSON.stringify(updatedProgress));
        return updatedProgress;
      });

    } catch (error) {
      console.error("Error updating exercise:", error);
      showNotification("Hiba történt a gyakorlat frissítésekor", "error");
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!workout || !progress) {
    return <div className="p-4 text-center">Betöltés...</div>;
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const exerciseProgress = progress.exerciseProgress[currentExercise._id];

  return (
    <div className="p-4 max-w-4xl mx-auto text-black">
      <h2 className="text-2xl font-semibold mb-4">{workout.name}</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            onClick={prevExercise}
            disabled={currentExerciseIndex === 0}
          >
            Előző
          </button>
          <span>
            {currentExerciseIndex + 1} / {workout.exercises.length}
          </span>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            onClick={nextExercise}
            disabled={currentExerciseIndex === workout.exercises.length - 1}
          >
            Következő
          </button>
        </div>

        <div className="space-y-4 rounded-lg bg-white p-4 shadow-sm overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentExercise.name || "Névtelen gyakorlat"}
          </h3>
          {currentExercise.video ? (
            <div className="flex justify-center relative">
              {isVideoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              )}
              <video
                src={currentExercise.video}
                playsInline
                autoPlay
                muted
                loop
                className="max-w-full"
                onLoadStart={() => setIsVideoLoading(true)}
                onLoadedData={() => setIsVideoLoading(false)}
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentExercise.name + ' exercise')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Keresés YouTube-on
              </a>
            </div>
          )}
          {currentExercise.note && (
            <p className="text-sm text-gray-500 break-words">
              {currentExercise.note}
            </p>
          )}
          <div className="space-y-5 flex flex-col ">
            {exerciseProgress?.sets?.length > 0 ? (
              exerciseProgress.sets.map((set, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-center gap-1 text-sm text-gray-700"
                >
                  <span className="w-14 font-medium">{index + 1}. Szett</span>
                  <input
                    type="checkbox"
                    checked={set.completed}
                    onChange={(e) =>
                      updateSetProgress(
                        currentExercise._id,
                        index,
                        "completed",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 mr-7 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label={`Szett ${index + 1} befejezése`}
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={set.reps || ""}
                      onChange={(e) =>
                        updateSetProgress(
                          currentExercise._id,
                          index,
                          "reps",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-16 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                      aria-label={`Ismétlések a ${index + 1}. szetthez`}
                    />
                    <span>ism.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={set.weight || ""}
                      onChange={(e) =>
                        updateSetProgress(
                          currentExercise._id,
                          index,
                          "weight",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-16 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                      aria-label={`Súly a ${index + 1}. szetthez`}
                    />
                    <span>kg</span>
                  </div>
                  <span className="text-gray-500 text-xs">
                    ({currentExercise.restTime || 0} mp pihenő)
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">
                Nincsenek szettek definiálva. (Debug: exerciseId=
                {currentExercise._id}, progress=
                {JSON.stringify(exerciseProgress)})
              </div>
            )}
            {!editedExercise && (
              <button
                onClick={() => setEditedExercise(currentExercise)}
                className="bg-blue-500 self-end text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Frissítés
              </button>
            )}
            {editedExercise && (
              <div>
                <div className="flex flex-row gap-2">
                  <div className="flex flex-col gap-2 w-[23%]">
                    <span>Sorozat</span>
                    <input
                      type="number"
                      value={editedExercise.sets || ""}
                      onChange={(e) =>
                        setEditedExercise({
                          ...editedExercise,
                          sets: parseInt(e.target.value),
                        })
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-[23%]">
                    <span>Ismétlések</span>
                    <input
                      type="number"
                      value={editedExercise.repetitions || ""}
                      onChange={(e) =>
                        setEditedExercise({
                          ...editedExercise,
                          repetitions: parseInt(e.target.value),
                        })
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-[23%]">
                    <span>Súly</span>
                    <input
                      type="number"
                      value={editedExercise.weight || ""}
                      onChange={(e) =>
                        setEditedExercise({
                          ...editedExercise,
                          weight: parseInt(e.target.value),
                        })
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-[23%]">
                    <span>Pihenő idő</span>
                    <input
                      type="number"
                      value={editedExercise.restTime || ""}
                      onChange={(e) =>
                        setEditedExercise({
                          ...editedExercise,
                          restTime: parseInt(e.target.value),
                        })
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-between gap-2">
                  <button
                    onClick={() => setEditedExercise(null)}
                    className="bg-red-500 mt-2 self-end text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Mégsem
                  </button>
                  <button
                    onClick={() => updateExercise(currentExercise._id)}
                    className="bg-blue-500 mt-2 self-end text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Feladat frissítése
                </button>
                  </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span>Idő: {formatTime(elapsedTime)}</span>
          {currentExerciseIndex === workout.exercises.length - 1 && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={finishWorkout}
            >
              <FolderIcon className="w-4 h-4" />
              Befejezés és mentés
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutStartComponent;
