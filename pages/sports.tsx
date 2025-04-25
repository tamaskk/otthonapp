import SportComponent from "@/component/SportComponent";
import Sidebar from "@/component/sidebar";
import { ToastContainer } from "react-toastify";

const Sports = () => {
  return (
    <div className="bg-white max-h-[100dvh] flex-1 h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <SportComponent />
    </div>
  );
};

export default Sports;
