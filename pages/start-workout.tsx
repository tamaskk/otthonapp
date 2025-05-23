import StartWorkoutComponent from "@/component/StartWorkoutComponent";
import Sidebar from "@/component/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

const StartWorkout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="bmg-white max-h-[100dvh] flex-1 h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <StartWorkoutComponent />
    </div>
  );
};

export default StartWorkout;
