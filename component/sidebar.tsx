import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SidebarItems from "./SidebarItems";
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import { signOut } from "next-auth/react";
const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="relative z-[100000000000]">
      <MenuIcon
        className="fixed top-5 right-5 text-black cursor-pointer z-50"
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg transition-transform duration-300 z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col py-10 h-full text-black">
          <h2 className="text-2xl font-bold text-center mb-6">Otthon App</h2>
          <ul className="space-y-4 px-6 flex-grow">
            <SidebarItems items={[]} mainUrl="/mainpage" name="Főoldal" />
            <SidebarItems items={[]} mainUrl="/shopping-list" name="Bevásárló lista" />
            <SidebarItems
              items={[
                { name: "Minden recept", url: "/all-recipes" },
                { name: "Recept hozzáadása", url: "/add-recipes" },
                { name: "Receptek szerkeztése", url: "/edit-recipes" },
                { name: "Recept beállítások", url: "/recipes-settings" },
              ]}
              name="Receptek"
              openHandler={() => setRecipeOpen(!recipeOpen)}
              state={recipeOpen}
            />
            <SidebarItems
              items={[
                { name: "Edzés hozzáadása", url: "/add-exercise" },
                { name: "Edzés API", url: "/api-exercises" },
                { name: "Edzés beállítások", url: "/exercise-settings" },
                { name: "Edzésterv létrehozása", url: "/add-workout" },
                { name: "Edzésterv szerkesztése", url: "/edit-workout" },
                { name: "Edzésterv elkezdése", url: "/start-workout" },
                { name: "Edzésnapló", url: "/exercise-log" },
                { name: "Beállítások", url: "/workout-settings" },
              ]}
              name="Edzés"
              openHandler={() => setTrainingOpen(!trainingOpen)}
              state={trainingOpen}
            />
            <SidebarItems items={[]} mainUrl="/finance" name="Pénzügyek" />
            <SidebarItems items={[]} mainUrl="/home" name="Otthon" />
            <SidebarItems items={[]} mainUrl="/tv-list" name="TV Lista" />
            {/* <SidebarItems items={[]} mainUrl="/sports" name="Sport" /> */}
            <SidebarItems items={[]} mainUrl="/movies" name="Filmek/Sorozatok" />
            <SidebarItems items={[]} mainUrl="/notes" name="Jegyzetek" />
            <SidebarItems items={[]} mainUrl="/passwords" name="Jelszavak" />
            <SidebarItems items={[]} mainUrl="/wc-codes" name="WC kódok" />
            <SidebarItems items={[]} mainUrl="/settings" name="Beállítások" />
          </ul>
          
          {/* Logout Button */}
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogoutIcon />
              <span>Kijelentkezés</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
