import Sidebar from "@/component/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import PasswordsComponent from "@/component/PasswordsComponent";
const Passwords = () => {
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
    <div className="bg-white max-h-[100dvh] flex-1 h-screen overflow-y-auto relative">
      <ToastContainer />
      <Sidebar />
      <PasswordsComponent />
    </div>
  );
};

export default Passwords;
