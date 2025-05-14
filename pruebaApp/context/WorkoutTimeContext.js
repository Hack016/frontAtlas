import React, { createContext, useState, useContext, useEffect } from "react";
export const WorkoutTimeContext = createContext();

export const WorkoutTimeProvider = ({ children }) => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  const resetWorkoutTime = () => {
    setIsWorkoutActive(false);
    setSeconds(0);
  };

  return (
    <WorkoutTimeContext.Provider
      value={{
        isWorkoutActive,
        setIsWorkoutActive,
        seconds,
        resetWorkoutTime,
      }}
    >
      {children}
    </WorkoutTimeContext.Provider>
  );
};
