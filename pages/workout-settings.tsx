import WorkoutSettingsComponent from "@/component/WorkoutSettingsComponent";
import Sidebar from "@/component/sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";

const WorkoutSettings = () => {
  return (
        <div className="bg-white max-h-[100dvh] flex-1 h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <WorkoutSettingsComponent />
    </div>
  );
};

export default WorkoutSettings;
