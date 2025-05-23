import React, { createContext, useState, useContext, useEffect } from "react";
export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [volume, setVolume] = useState(0);
  const [sets, setSets] = useState(0);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [exerciseProgress, setExerciseProgress] = useState({});

  useEffect(() => {
    let interval;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  const resetWorkout = () => {
    setIsWorkoutActive(false);
    setSeconds(0);
    setVolume(0);
    setSets(0);
    setSelectedExercises([]);
    setExercises([]);
    setExerciseProgress({});
  };

  return (
    <WorkoutContext.Provider
      value={{
        isWorkoutActive,
        setIsWorkoutActive,
        seconds,
        volume,
        sets,
        setSets,
        setVolume,
        resetWorkout,
        setSelectedExercises,
        selectedExercises,
        setExercises,
        exercises,
        exerciseProgress,
        setExerciseProgress,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
