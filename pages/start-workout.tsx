import StartWorkoutComponent from "@/component/StartWorkoutComponent";
import Sidebar from "@/component/sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";

const StartWorkout = () => {
  return (
    <div className="bg-white max-h-screen h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <StartWorkoutComponent />
    </div>
  );
};

export default StartWorkout;
