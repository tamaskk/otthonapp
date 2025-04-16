import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);

  return (
    <div className="relative z-50">
      <MenuIcon
        className="fixed top-5 right-5 text-white cursor-pointer z-50"
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
            <li className="cursor-pointer">Bevásárló lista</li>

            {/* Finance with Dropdown */}
            <li>
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setFinanceOpen(!financeOpen)}
              >
                <span>Finance</span>
                {financeOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              {financeOpen && (
                <ul className="ml-4 mt-2 space-y-2 text-sm text-gray-700">
                  <li className="cursor-pointer">Expenses</li>
                  <li className="cursor-pointer">Income</li>
                  <li className="cursor-pointer">Budget</li>
                </ul>
              )}
            </li>

            {/* Training with Dropdown */}
            <li>
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setTrainingOpen(!trainingOpen)}
              >
                <span>Training</span>
                <ExpandLessIcon
                  className={`transform transition-transform duration-1000 ${
                    !trainingOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
              <ul
                className={`ml-4 mt-2 space-y-2 text-sm ${
                  !trainingOpen ? "h-0" : "h-20"
                } text-gray-700 overflow-hidden transition-all duration-300`}
              >
                <li className="cursor-pointer">Workout Plans</li>
                <li className="cursor-pointer">Progress</li>
                <li className="cursor-pointer">Goals</li>
              </ul>
            </li>

            <li className="cursor-pointer">Contact</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
