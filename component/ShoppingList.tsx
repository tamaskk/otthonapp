import motion from '@/lib/notion';
import { useNotification } from '@rc-component/notification';
import React, { useEffect, useRef, useState } from 'react';
import { toast, Bounce } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewModeSwitch from './ViewModeSwitch';
import Modal from './Modal';

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
  const [shippingList, setShippingList] = useState<ShoppingListItem[]>([]);
  const [originalList, setOriginalList] = useState<
    { _id: string; name: string; quantity: number; shop: string; price: number; note: string }[]
  >([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const shops = [
    'Tesco',
    'Spar',
    'Lidl',
    'Aldi',
    'Penny',
    'Metro',
    'Auchan',
    'CBA',
    'DM',
    'Rossmann',
    'Pepco',
    'IKEA',
    'JYSK',
    'Kika',
    'Praktiker',
    'Bauhaus',
    'OBI',
    'Leroy Merlin',
    'Decathlon',
    'Sportisimo',
    'Intersport',
    'Media Markt',
    'Euronics',
    'Alza',
    'Extreme Digital',
    'eMAG',
    'Mall.hu',
    'Bookline',
    'Libri',
    'Lira Könyv',
    'Libri-Bookline',
  ];
  const units = ['db', 'kg', 'g', 'l', 'ml', 'm', 'cm', 'mm', 'inch', 'ft', 'yd'];
  const [addItemModal, setAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState<ShoppingListItem>({
    name: '',
    quantity: 1,
    quantityUnit: 'db',
    shop: '',
    price: 0,
    note: '',
    _id: '',
    done: false,
  });
  const [searchName, setSearchName] = useState('');
  const [selectedShop, setSelectedShop] = useState('');

  const showNotification = (
    content: string,
    type: 'success' | 'error' | 'info' | 'warning'
  ) => {
    const toastOptions = {
      position: 'bottom-left' as const,
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light' as const,
      transition: Bounce,
    };

    if (type === 'error') toast.error(content, toastOptions);
    else if (type === 'info') toast.info(content, toastOptions);
    else if (type === 'warning') toast.warn(content, toastOptions);
    else if (type === 'success') toast.success(content, toastOptions);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/shopping-list');
        const data = await res.json();
        setShippingList(data);
        setOriginalList(data);
      } catch (error: any) {
        console.error(error);
        showNotification('Hiba történt az adatok betöltése közben', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (ref.current) {
      fetchData();
      ref.current = false;
    }
  }, []);

  useEffect(() => {
    let filteredList: any[] = [...originalList];

    if (selectedShop) {
      filteredList = filteredList.filter(
        (item) => item.shop.toLowerCase() === selectedShop.toLowerCase()
      );
    }

    if (searchName) {
      filteredList = filteredList.filter((item) =>
        item.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setShippingList(filteredList);
  }, [searchName, selectedShop, originalList]);

  const deleteAllDoneItems = async () => {
    const confirmDelete = window.confirm(
      'Biztosan törölni szeretnéd az összes késznek jelölt terméket a bevásárlólistádról?'
    );

    if (!confirmDelete) return;

    setIsActionLoading(true);
    showNotification('Törlés folyamatban...', 'info');

    try {
      const res = await fetch('/api/shopping-list', {
        method: 'DELETE',
      });

      if (res.ok) {
        const updatedList = shippingList.filter((item) => !item.done);
        setShippingList(updatedList);
        setOriginalList(updatedList);
        showNotification('Sikeresen törölted az elemet!', 'success');
      } else {
        const errorData = await res.json();
        showNotification(errorData.message, 'error');
      }
    } catch (error) {
      showNotification('Hiba történt a törlés közben', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const setDone = async (id: string) => {
    setIsActionLoading(true);
    showNotification('Késznek jelölés folyamatban...', 'info');

    try {
      const res = await fetch(`/api/shopping-list?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const findItem = shippingList.find((item) => item._id === id);
        const updatedList = shippingList.map((item) =>
          item._id === id ? { ...item, done: !findItem?.done } : item
        );
        setShippingList(updatedList);
        setOriginalList(updatedList);
        showNotification('Sikeresen késznek jelölted az elemet!', 'success');
      } else {
        showNotification('Hiba történt a művelet közben', 'error');
      }
    } catch (error) {
      showNotification('Hiba történt a művelet közben', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      'Biztosan törölni szeretnéd ezt az elemet a bevásárlólistádról?'
    );

    if (!confirmDelete) return;

    setIsActionLoading(true);
    showNotification('Törlés folyamatban...', 'info');

    try {
      const res = await fetch(`/api/shopping-list?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const updatedList = shippingList.filter((item) => item._id !== id);
        setShippingList(updatedList);
        setOriginalList(updatedList);
        showNotification('Sikeresen törölted az elemet!', 'success');
      } else {
        showNotification('Hiba történt a törlés közben', 'error');
      }
    } catch (error) {
      showNotification('Hiba történt a törlés közben', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const addItem = async () => {
    if (newItem.name === '' || newItem.shop === '') {
      alert('Kérlek töltsd ki az összes mezőt!');
      return;
    }

    setIsActionLoading(true);
    showNotification('Hozzáadás folyamatban...', 'info');

    try {
      const res = await fetch('/api/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      const data = await res.json();
      setShippingList([...shippingList, data]);
      setOriginalList([...originalList, data]);
      showNotification('Sikeresen hozzáadtad az elemet!', 'success');
      setAddItemModal(false);

      // Send push notification if permission is granted
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification("New Shopping List Item", {
          body: `Added ${newItem.name} to your shopping list`,
          icon: "/favicon.ico",
        });
      }
    } catch (error) {
      showNotification('Hiba történt a hozzáadás közben', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const toggleItemExpand = (id: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
    }
    setExpandedItems(newExpandedItems);
  };

  return (
    <>
      <div className="max-h-[100dvh] flex-1 h-screen overflow-hidden flex flex-col relative bg-gray-50">
        <div className="absolute top-5 left-5 flex gap-2">
          <AddIcon
            className="text-black cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out z-10"
            onClick={() => setAddItemModal(!addItemModal)}
          />
          <ViewModeSwitch
            onViewChange={(mode) => setViewMode(mode)}
            storageKey="shopping-list-view-mode"
            defaultView={viewMode}
          />
        </div>
        <div className="flex flex-col items-center pt-5">
          <h1 className="text-3xl font-bold text-gray-800 mb-5">
            Bevásárló lista
          </h1>
          <div className="bg-gray-100 mb-5 p-4 w-4/6 max-w-2xl rounded-md shadow-md text-black sticky top-0 z-10">
            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300"
              disabled={isLoading || isActionLoading}
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
              disabled={isLoading || isActionLoading}
            />
            <div>
              <button
                onClick={deleteAllDoneItems}
                className="w-full mt-5 p-2 bg-gray-300 shadow-md text-black rounded-md hover:bg-gray-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || isActionLoading}
              >
                Késznek jelölt termékek törlése
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto w-full flex flex-col items-center pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : shippingList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ViewListIcon className="w-16 h-16 mb-4" />
              <p className="text-xl">Nincsenek elemek a bevásárlólistában</p>
              <button
                onClick={() => setAddItemModal(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Új elem hozzáadása
              </button>
            </div>
          ) : (
            shippingList.map((item, index) => (
              <div
                key={index}
                className={`relative ${
                  item.done ? 'bg-green-100' : 'bg-white'
                } border border-gray-200 p-5 rounded-xl shadow-sm text-gray-800 mt-4 w-[90%] max-w-xl transition-all duration-300 ease-in-out`}
              >
                {viewMode === 'table' ? (
                  <>
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleItemExpand(item._id)}
                    >
                      <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold">{item.name}</h1>
                        <span className="text-gray-600">
                          {item.quantity} {item.quantityUnit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item._id);
                          }}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          <DeleteIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDone(item._id);
                          }}
                          className="text-green-600 hover:text-green-800 transition-colors duration-200"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div
                      className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                        expandedItems.has(item._id)
                          ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-gray-200'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="min-h-0">
                        <div className="text-sm text-gray-500 mb-3">Bolt: {item.shop}</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
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
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-start">
                      <h1 className="text-2xl font-bold">{item.name}</h1>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          <DeleteIcon className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => setDone(item._id)}
                          className="text-green-600 hover:text-green-800 transition-colors duration-200"
                        >
                          <CheckIcon className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Bolt: {item.shop}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Mennyiség:</span>
                        <p className="text-gray-900">
                          {item.quantity} {item.quantityUnit}
                        </p>
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
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        handlerFunction={() => setAddItemModal(false)}
        state={addItemModal}
      >
        <div
          className={`
            bg-white 
            flex flex-col gap-4 
            z-50 transition-all duration-300 
            rounded-2xl p-6 text-black
          `}
        >
          <h1 className="text-2xl font-semibold text-gray-800 text-center">
            Új termék
          </h1>
          <input
            type="text"
            placeholder="Termék neve"
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            disabled={isActionLoading}
          />
          <div className="flex gap-1">
            <input
              type="number"
              placeholder="Mennyiség"
              className="border border-gray-300 w-[70%] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })
              }
              disabled={isActionLoading}
            />
            <select
              className="border border-gray-300 rounded-lg w-[30%] p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setNewItem({ ...newItem, quantityUnit: e.target.value })
              }
              disabled={isActionLoading}
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
            onChange={(e) => setNewItem({ ...newItem, shop: e.target.value })}
            disabled={isActionLoading}
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
            onChange={(e) =>
              setNewItem({ ...newItem, price: parseInt(e.target.value) || 0 })
            }
            disabled={isActionLoading}
          />
          <input
            type="text"
            placeholder="Megjegyzés"
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setNewItem({ ...newItem, note: e.target.value })}
            disabled={isActionLoading}
          />
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => setAddItemModal(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isActionLoading}
            >
              Mégse
            </button>
            <button
              onClick={addItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Hozzáadás...
                </>
              ) : (
                'Hozzáadás'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ShoppingList;