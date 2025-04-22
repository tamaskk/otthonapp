import EditRecipe from "@/component/EditRecipe";
import Sidebar from "@/component/sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";

const Home = () => {

  const handleTurn = async () => {
    const response = await fetch("https://localhost:8581/api/accessories/XboxOne/on");

    if (response.ok) {
      console.log("Plug turned on successfully");
    } else {
      console.error("Failed to turn on plug");
    }
  }

  return (
        <div className="bg-white max-h-[100dvh] flex-1 h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded absolute top-4 right-4"
        onClick={handleTurn}
      >
        Turn on
      </button>
    </div>
  );
};

export default Home;
