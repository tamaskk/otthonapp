import motion from '@/lib/notion';
import { useNotification } from '@rc-component/notification';
import React, { useEffect, useRef, useState } from 'react'
import { toast, Bounce } from 'react-toastify';
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';

interface ShoppingListItem {
    _id: string;
    name: string;
    quantity: number;
    quantityUnit: string;
    shop: string;
    price: number;
    note: string;
    done: boolean;
  }

const ShoppingList = () => {
    const ref = useRef(true);
    const [shippingList, setShippingList] = useState<
      ShoppingListItem[]
    >([]);

    const [originalList, setOriginalList] = useState<
      {
        _id: string;
        name: string;
        quantity: number;
        shop: string;
        price: number;
        note: string;
      }[]
    >([]);
    const shops = [
      "Tesco",
      "Spar",
      "Lidl",
      "Aldi",
      "Penny",
      "Metro",
      "Auchan",
      "CBA",
      "DM",
      "Rossmann",
      "Pepco",
      "IKEA",
      "JYSK",
      "Kika",
      "Praktiker",
      "Bauhaus",
      "OBI",
      "Leroy Merlin",
      "Decathlon",
      "Sportisimo",
      "Intersport",
      "Media Markt",
      "Euronics",
      "Alza",
      "Extreme Digital",
      "eMAG",
      "Mall.hu",
      "Bookline",
      "Libri",
      "Lira Könyv",
      "Libri-Bookline",
    ];
    const units = [
      "db",
      "kg",
      "g",
      "l",
      "ml",
      "m",
      "cm",
      "mm",
      "inch",
      "ft",
      "yd",
    ];
    const [addItemModal, setAddItemModal] = useState(false);
    const [newItem, setNewItem] = useState<ShoppingListItem>({
      name: "",
      quantity: 1,
      quantityUnit: "db",
      shop: "",
      price: 0,
      note: "",
      _id: "",
      done: false,
    });
    // Search states
    const [searchName, setSearchName] = useState("");
    const [selectedShop, setSelectedShop] = useState("");
  
    const showNotification = (
      content: string,
      type: "success" | "error" | "info" | "warning"
    ) => {
      if (type === "error") {
        toast.error(content, {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else if (type === "info") {
        toast.info(content, {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else if (type === "warning") {
        toast.warn(content, {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else if (type === "success") {
      toast.success(content, {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
      }
    }
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch("/api/shopping-list");
          const data = await res.json();
          setShippingList(data);
          setOriginalList(data); // Store original list
        } catch (error: any) {
          console.error(error);
        }
      };
  
      if (ref.current) {
        fetchData();
        ref.current = false;
      }
    }, []);
  
    // Filter the list whenever searchName or selectedShop changes
    useEffect(() => {
      let filteredList: any[] = [...originalList];
  
      // Filter by shop
      if (selectedShop) {
        filteredList = filteredList.filter(
          (item) => item.shop.toLowerCase() === selectedShop.toLowerCase()
        );
      }
  
      // Filter by name
      if (searchName) {
        filteredList = filteredList.filter((item) =>
          item.name.toLowerCase().includes(searchName.toLowerCase())
        );
      }
  
      setShippingList(filteredList);
    }, [searchName, selectedShop, originalList]);
  
    const deleteAllDoneItems = async () => {
      const confirmDelete = window.confirm(
        "Biztosan törölni szeretnéd az összes késznek jelölt terméket a bevásárlólistádról?"
      );
  
      if (!confirmDelete) return;
  
      showNotification("Törlés folyamatban...", "info");
  
      const res = await fetch("/api/shopping-list", {
        method: "DELETE",
      });
  
      if (res.ok) {
        const updatedList = shippingList.filter((item) => !item.done);
        setShippingList(updatedList);
        setOriginalList(updatedList); // Update original list too
        showNotification("Sikeresen törölted az elemet!", "success");
      } else {
        const errorData = await res.json();
        showNotification(errorData.message, "error");
      }
    }
  
    const setDone = async (id: string) => {
  
      showNotification("Késznek jelölés folyamatban...", "info");
  
      const res = await fetch(`/api/shopping-list?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (res.ok) {
        const findItem = shippingList.find((item) => item._id === id);
        const updatedList = shippingList.map((item) =>
          item._id === id ? { ...item, done: !findItem?.done } : item
        );
        setShippingList(updatedList);
        setOriginalList(updatedList); // Update original list too
        showNotification("Sikeresen késznek jelölted az elemet!", "success");
      } else {
        console.error("Failed to mark item as done");
      }
    }
  
    const handleDelete = async (id: string) => {
  
      const confirmDelete = window.confirm(
        "Biztosan törölni szeretnéd ezt az elemet a bevásárlólistádról?"
      );
  
      if (!confirmDelete) return;
  
      showNotification("Törlés folyamatban...", "info");
  
      const res = await fetch(`/api/shopping-list?id=${id}`, {
        method: "DELETE",
      });    
  
      if (res.ok) {
        const updatedList = shippingList.filter((item) => item._id !== id);
        setShippingList(updatedList);
        setOriginalList(updatedList); // Update original list too
        showNotification("Sikeresen törölted az elemet!", "success");
      } else {
        console.error("Failed to delete item");
      }
    };
  
    const addItem = async () => {
      if (newItem.name === "" || newItem.shop === "") {
        alert("Kérlek töltsd ki az összes mezőt!");
        return;
      }
  
      showNotification("Hozzáadás folyamatban...", "info");
  
      const res = await fetch("/api/shopping-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
  
      const data = await res.json();
      setShippingList([...shippingList, data]);
      setOriginalList([...originalList, data]); // Update original list
      setAddItemModal(false);
      showNotification("Sikeresen hozzáadtad az elemet!", "success");
    };
  return (
    <>
          <AddIcon
        className="absolute top-5 left-5 text-black cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out"
        onClick={() => {
          setAddItemModal(!addItemModal);
        }}
      />
      <div className="flex flex-col items-center justify-start mt-5">
        <h1 className="text-3xl font-bold text-gray-800 mb-5">
          Bevásárló lista
        </h1>
        <div className="bg-gray-100 p-2 w-4/6 py-10 rounded-md shadow-md text-black">
          <select
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300"
          >
            <option value="">Összes bolt</option>
            {shops.map((shop, index) => (
              <option key={index} value={shop}>
                {shop}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="w-full mt-5 p-2 rounded-md border border-gray-300"
            placeholder="Add meg a termék nevét"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <div>
            <button
              onClick={() => {
                deleteAllDoneItems();
              }}
              className="w-full mt-5 p-2 bg-gray-300 shadow-md text-black rounded-md hover:bg-gray-400 transition duration-200"
            >
              Késznek jelölt termékek törlése
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-start">
          {shippingList.map((item, index) => (
            <div
              key={index}
              className={`relative ${item.done ? "bg-green-100" : "bg-white"} border border-gray-200 p-5 rounded-xl shadow-sm text-gray-800 mt-4 w-[90%] max-w-xl transition hover:shadow-md`}
            >
              <button
                onClick={() => handleDelete(item._id)}
                className="absolute top-3 right-3 text-red-600 hover:text-red-800"
              >
                <DeleteIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => setDone(item._id)}
                className="absolute top-3 right-12 text-green-600 hover:text-green-800"
              >
                <CheckIcon className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold mb-1">{item.name}</h1>
              <div className="text-sm text-gray-500 mb-3">Bolt: {item.shop}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Mennyiség:</span>
                  <p className="text-gray-900">{item.quantity}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Ár:</span>
                  <p className="text-gray-900">{item.price} Ft</p>
                </div>
                {item.note && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Megjegyzés:</span>
                    <p className="text-gray-900">{item.note}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`
          fixed top-1/2 left-1/2 
          ${addItemModal ? "translate-y-[-50%]" : "translate-y-[-200%]"} 
          translate-x-[-50%] 
          w-[90%] max-w-md 
          bg-white 
          flex flex-col gap-4 
          z-50 transition-all duration-300 
          shadow-2xl rounded-2xl p-6 text-black
        `}
      >
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Új termék
        </h1>
        <input
          type="text"
          placeholder="Termék neve"
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setNewItem({ ...newItem, name: e.target.value });
          }}
        />
        <div className="flex gap-1">
          <input
            type="number"
            placeholder="Mennyiség"
            className="border border-gray-300 w-[70%] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setNewItem({ ...newItem, quantity: parseInt(e.target.value) });
            }}
          />
          <select
            className="border border-gray-300 rounded-lg w-[30%] p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setNewItem({ ...newItem, quantityUnit: e.target.value });
            }}
          >
            <option disabled selected>
              Mértékegység
            </option>
            {units.map((unit, index) => (
              <option key={index} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <select
          className="border border-gray-300 rounded-lg p-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setNewItem({ ...newItem, shop: e.target.value });
          }}
        >
          <option disabled selected>
            Válassz boltot
          </option>
          {shops.map((shop, index) => (
            <option key={index} value={shop}>
              {shop}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Ár (Ft)"
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setNewItem({ ...newItem, price: parseInt(e.target.value) });
          }}
        />
        <input
          type="text"
          placeholder="Megjegyzés"
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            setNewItem({ ...newItem, note: e.target.value });
          }}
        />
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={() => setAddItemModal(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700"
          >
            Mégse
          </button>
          <button
            onClick={addItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Hozzáadás
          </button>
        </div>
      </div>
      </>
  )
}

export default ShoppingList