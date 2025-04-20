import AddRecipe from "@/component/AddRecipe";
import Sidebar from "@/component/sidebar";
import React from "react";
import { ToastContainer } from "react-toastify";

const AddRecipes = () => {
  return (
    <div className="bg-white relative">
      <ToastContainer />
      <Sidebar />
      <AddRecipe />
    </div>
  );
};

export default AddRecipes;
