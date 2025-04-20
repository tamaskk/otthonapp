import EditWorkoutComponent from "@/component/EditWorkoutComponent";
import Sidebar from "@/component/sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";

const EditWorkout = () => {
  return (
    <div className="bg-white max-h-screen h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <EditWorkoutComponent />
    </div>
  );
};

export default EditWorkout;
