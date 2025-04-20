import WorkoutSettingsComponent from "@/component/WorkoutSettingsComponent";
import Sidebar from "@/component/sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";

const WorkoutSettings = () => {
  return (
    <div className="bg-white max-h-screen h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <WorkoutSettingsComponent />
    </div>
  );
};

export default WorkoutSettings;
