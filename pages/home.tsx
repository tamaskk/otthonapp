import EditRecipe from "@/component/EditRecipe";
import Sidebar from "@/component/sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";

const Home = () => {
  return (
        <div className="bg-white max-h-[100dvh] flex-1 h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
    </div>
  );
};

export default Home;
