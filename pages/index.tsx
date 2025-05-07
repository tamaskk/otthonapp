import MainPage from "@/component/Mainpage";
import ShoppingList from "@/component/ShoppingList";
import Sidebar from "@/component/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

const index = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return <div>Redirecting to login...</div>;
  }

  if (status === "authenticated") {
    router.push("/mainpage");
    return <div>Redirecting to main...</div>;
  }

  return (
    <div className="bg-white max-h-[100dvh] flex-1 h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <MainPage />
    </div>
  );
};

export default index;
