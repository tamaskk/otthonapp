import AddExerciseComponent from "@/component/AddExerciseComponent";
import Sidebar from "@/component/sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";

const AddExercise = () => {
  return (
    <div className="bg-white max-h-screen h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <AddExerciseComponent />
    </div>
  );
};

export default AddExercise;
