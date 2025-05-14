import React, { createContext, useState, useContext, useEffect } from "react";
export const WorkoutTrainContext = createContext();

export const WorkoutTrainProvider = ({ children }) => {
  const [volume, setVolume] = useState(0);
  const [sets, setSets] = useState(0);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [exerciseProgress, setExerciseProgress] = useState({});

  const resetWorkout = () => {
    setVolume(0);
    setSets(0);
    setSelectedExercises([]);
    setExercises([]);
    setExerciseProgress({});
  };

  return (
    <WorkoutTrainContext.Provider
      value={{
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
    </WorkoutTrainContext.Provider>
  );
};
