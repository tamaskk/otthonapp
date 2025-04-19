import Sidebar from "@/component/sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";

const RecipesSettings = () => {
  return (
    <div className="bg-white max-h-screen h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
    </div>
  );
};

export default RecipesSettings;
