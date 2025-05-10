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
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Hamarosan</h1>
        <p className="text-lg text-gray-600 text-center">Keményen dolgozok, hogy valami csodálatosat hozzak létre!</p>
      </div>
    </div>
  );
};

export default Home;
