import AddExerciseComponent from "@/component/AddExerciseComponent";
import Sidebar from "@/component/sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";

const AddExercise = () => {
  return (
        <div className="bg-white max-h-[100dvh] flex-1 h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <AddExerciseComponent />
    </div>
  );
};

export default AddExercise;
