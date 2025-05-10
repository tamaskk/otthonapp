import { useRouter } from 'next/router';
import { useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HomeIcon from '@mui/icons-material/Home';
import TvIcon from '@mui/icons-material/Tv';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import MovieIcon from '@mui/icons-material/Movie';
import NoteIcon from '@mui/icons-material/Note';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const MainPage = () => {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const menuItems = [
    { name: 'Bevásárló lista', icon: <ShoppingCartIcon />, path: '/shopping-list' },
    { 
      name: 'Receptek', 
      icon: <RestaurantIcon />, 
      path: '/all-recipes',
      subItems: [
        { name: 'Összes recept', path: '/all-recipes' },
        { name: 'Receptek hozzáadása', path: '/add-recipes' },
        { name: 'Receptek szerkeztése', path: '/edit-recipes' },
        { name: 'Receptek beállítások', path: '/recipes-settings' }
      ]
    },
    { 
      name: 'Edzés', 
      icon: <FitnessCenterIcon />, 
      path: '/add-exercise',
      subItems: [
        { name: 'Edzés hozzáadása', path: '/add-exercise' },
        { name: 'Edzés api', path: '/api-exercises'},
        { name: 'Edzésterv szerkesztése', path: '/edit-workout' },
        { name: 'Edzésterv létrehozása', path: '/add-workout' },
        { name: 'Edzésterv elkezdése', path: '/start-workout' },
        { name: 'Edzésterv elkezdése', path: '/start-workout' },
        { name: 'Edzésnapló', path: '/exercise-log' },
        { name: 'Edzés beállítások', path: '/workout-settings' }
      ]
    },
    { name: 'Pénzügyek', icon: <AccountBalanceWalletIcon />, path: '/finance' },
    { name: 'Otthon', icon: <HomeIcon />, path: '/home' },
    { name: 'TV Lista', icon: <TvIcon />, path: '/tv-list' },
    { name: 'Sport', icon: <SportsBaseballIcon />, path: '/sports' },
    { name: 'Filmek / Sorozatok', icon: <MovieIcon />, path: '/movies' },
    { name: 'Jegyzetek', icon: <NoteIcon />, path: '/notes' },
    { name: 'Jelszavak', icon: <VpnKeyIcon />, path: '/passwords' },
    { name: 'Beállítások', icon: <SettingsIcon />, path: '/settings' }
  ];

  const handleItemClick = (item: any) => {
    if (item.subItems) {
      setOpenDropdown(openDropdown === item.name ? null : item.name);
    } else {
      router.push(item.path);
    }
  };

  return (
    <div className="max-h-[100dvh] h-screen overflow-y-auto overflow-x-hidden flex flex-col bg-gray-100 text-gray-900 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Otthon App</h1>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => handleItemClick(item)}
                className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    {item.icon}
                  </div>
                  <span className="ml-4 text-md font-semibold text-gray-700">{item.name}</span>
                </div>
                {item.subItems && (
                  <KeyboardArrowDownIcon 
                    className={`transform transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`}
                  />
                )}
              </button>
              {item.subItems && openDropdown === item.name && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg">
                  {item.subItems.map((subItem, subIndex) => (
                    <button
                      key={subIndex}
                      onClick={() => router.push(subItem.path)}
                      className="w-full text-left px-6 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {subItem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
