import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SidebarItems from "./SidebarItems";

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(false);

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
          <ul className="space-y-4 px-6">
            <SidebarItems items={[]} mainUrl="/" name="Bevásárló lista" />
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
            <SidebarItems items={[]} mainUrl="/movies" name="Filmek/Sorozatok" />
            <SidebarItems items={[]} mainUrl="/notes" name="Jegyzetek" />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
