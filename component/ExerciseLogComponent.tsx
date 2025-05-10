import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface SetProgress {
  completed: boolean;
  reps: number;
  weight: number;
}

interface ExerciseProgress {
  sets: SetProgress[];
}

interface ExerciseLog {
  _id: string;
  workoutId: string;
  progress: {
    [exerciseId: string]: ExerciseProgress;
  };
  dayOfExercise: string;
  startTime: string;
  endTime: string;
}

interface Workout {
  _id: string;
  name: string;
}

const ExerciseLogComponent = () => {
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [workouts, setWorkouts] = useState<{ [key: string]: string }>({});
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExerciseLogs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/exercise-log');
      if (!response.ok) throw new Error('Failed to fetch exercise logs');
      const data = await response.json();
      setExerciseLogs(data);
      console.log('Fetched exercise logs:', data);
    } catch (error) {
      console.error('Error fetching exercise logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkouts = async (workoutIds: string[]) => {
    try {
      const uniqueIds = [...new Set(workoutIds)];
      const promises = uniqueIds.map(async (id) => {
        const response = await fetch(`/api/workout?id=${id}`);
        if (!response.ok) throw new Error(`Failed to fetch workout ${id}`);
        const data = await response.json();
        return { id, name: data.name };
      });
      const results = await Promise.all(promises);
      const workoutMap = results.reduce(
        (acc, { id, name }) => ({ ...acc, [id]: name }),
        {}
      );
      setWorkouts(workoutMap);
      console.log('Fetched workouts:', workoutMap);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  useEffect(() => {
    fetchExerciseLogs();
  }, []);

  useEffect(() => {
    if (exerciseLogs.length > 0) {
      const workoutIds = exerciseLogs.map((log) => log.workoutId);
      fetchWorkouts(workoutIds);
    }
  }, [exerciseLogs]);

  const formatDateTime = (day: string, start: string, end: string) => {
    const dayDate = new Date(day);
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const dayFormatted = dayDate.toLocaleString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const startTime = startDate.toLocaleString('hu-HU', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const endTime = endDate.toLocaleString('hu-HU', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${dayFormatted} ${startTime} - ${endTime}`;
  };

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const seconds = Math.floor((endTime - startTime) / 1000);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculateCompletion = (progress: ExerciseLog['progress']) => {
    let completed = 0;
    let total = 0;
    Object.values(progress).forEach((exercise) => {
      exercise.sets.forEach((set) => {
        total += 1;
        if (set.completed) completed += 1;
      });
    });
    return { completed, total };
  };

  const toggleLog = (logId: string) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Edzésnapló
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
      ) : exerciseLogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nincsenek edzésnaplók</h3>
            <p className="mt-1 text-sm text-gray-500">
              Még nem rögzítettél edzést. Kezdj el edzeni és itt láthatod majd az előrehaladásodat.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {exerciseLogs.map((log) => {
            const { completed, total } = calculateCompletion(log.progress);
            const isExpanded = expandedLog === log._id;
            return (
              <div
                key={log._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div
                  className="p-6 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleLog(log._id)}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {workouts[log.workoutId] || `Edzés (${log.workoutId})`}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDateTime(log.dayOfExercise, log.startTime, log.endTime)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Időtartam:</span>{' '}
                      {calculateDuration(log.startTime, log.endTime)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Teljesítve:</span>{' '}
                      {completed} / {total} szett
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUpIcon className="w-6 h-6 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6">
                    <h4 className="text-lg font-medium text-gray-700 mb-3">
                      Gyakorlatok előrehaladása
                    </h4>
                    {Object.entries(log.progress).map(([exerciseId, progress]) => (
                      <div
                        key={exerciseId}
                        className="mb-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <h5 className="text-base font-medium text-gray-800">
                          Gyakorlat ID: {exerciseId}
                        </h5>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {progress.sets.map((set, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded-md text-sm ${
                                set.completed
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              <p>
                                <span className="font-medium">
                                  Szett {index + 1}:
                                </span>
                              </p>
                              <p>Ismétlések: {set.reps}</p>
                              <p>Súly: {set.weight} kg</p>
                              <p>
                                {set.completed ? 'Befejezve' : 'Nem befejezve'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExerciseLogComponent;