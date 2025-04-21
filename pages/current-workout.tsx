import WorkoutStartComponent from "@/component/CurrentWorkoutComponent";
import Sidebar from "@/component/sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";

const CurrentWorkout = () => {
  return (
    <div className="bg-white max-h-[100dvh] flex-1 h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <WorkoutStartComponent />
    </div>
  );
};

export default CurrentWorkout;
