import AddWorkoutComponent from "@/component/AddWorkout";
import Sidebar from "@/component/sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";

const AddWorkout = () => {
  return (
    <div className="bg-white max-h-screen h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <AddWorkoutComponent />
    </div>
  );
};

export default AddWorkout;
