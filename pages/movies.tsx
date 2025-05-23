import Movies from "@/component/Movies";
import Sidebar from "@/component/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

const movies = () => {
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
    <div className="max-h-[100dvh] bg-white flex-1 overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <Movies />
    </div>
  );
};

export default movies;
