import ExerciseLogComponent from "@/component/ExerciseLogComponent";
import Sidebar from "@/component/sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";

const ExerciseLog = () => {
  return (
    <div className="bg-white max-h-screen h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <ExerciseLogComponent />
    </div>
  );
};

export default ExerciseLog;
