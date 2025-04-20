import Sidebar from "@/component/sidebar";
import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { useNotification } from "@rc-component/notification";
import motion from "@/lib/notion";
import { Bounce, ToastContainer, toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingList from "@/component/ShoppingList";

const index = () => {
  return (
    <div className="bg-white max-h-[100dvh] flex-1 h-full overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <ShoppingList />
    </div>
  );
};

export default index;
