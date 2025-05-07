import AddRecipe from "@/component/AddRecipe";
import Sidebar from "@/component/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

const AddRecipes = () => {
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
    <div className="bg-white relative">
      <ToastContainer />
      <Sidebar />
      <AddRecipe />
    </div>
  );
};

export default AddRecipes;
