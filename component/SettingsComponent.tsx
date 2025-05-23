import Sidebar from "@/component/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import ViewModeSwitch from "./ViewModeSwitch";

const SettingsComponent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [viewModes, setViewModes] = useState<{
    name: string;
    mode: "table" | "grid";
    label: string;
  }[]>([]);

  useEffect(() => {
    // Initialize viewModes with values from localStorage or defaults
    const shoppingListViewMode = localStorage.getItem("shopping-list-view-mode") || "grid";
    const moviesViewMode = localStorage.getItem("movies-view-mode") || "table";

    setViewModes([
      {
        name: "Bevásárló lista",
        mode: shoppingListViewMode as "table" | "grid",
        label: "Bevásárló lista",
      },
      {
        name: "Filmek és sorozatok",
        mode: moviesViewMode as "table" | "grid",
        label: "Filmek és sorozatok",
      },
    ]);
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []); // Empty dependency array to run only once on mount

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Ez a böngésző nem támogatja az értesítéseket");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } catch (error) {
      console.error("Hiba az értesítési engedély kérésekor:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return <div>Redirecting to login...</div>;
  }

  const handleViewModeChange = (storageKey: string, mode: "table" | "grid") => {
    localStorage.setItem(storageKey, mode);
    setViewModes((prev) =>
      prev.map((item) =>
        item.name === (storageKey === "shopping-list-view-mode" ? "Bevásárló lista" : "Filmek és sorozatok")
          ? { ...item, mode }
          : item
      )
    );
  };

  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Beállítások</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Értesítések</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={requestNotificationPermission}
            disabled={notificationPermission === "granted"}
            className={`px-4 py-2 rounded-md ${
              notificationPermission === "granted"
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {notificationPermission === "granted" ? "Értesítések engedélyezve" : "Értesítések engedélyezése"}
          </button>
          <span className="text-gray-600">
            {notificationPermission === "granted"
              ? "Értesítéseket fogsz kapni az új bevásárlólista elemekről"
              : "Engedélyezd az értesítéseket, hogy értesülj az új bevásárlólista elemekről"}
          </span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-start justify-between mt-5">
        <h1 className="text-xl font-semibold mb-4">Nézetek</h1>
        {viewModes.length > 0 ? (
          viewModes.map((viewMode) => (
            <div key={viewMode.name} className="flex flex-row items-center justify-between w-full mb-4">
              <h2 className="text-lg">{viewMode.label}</h2>
              <ViewModeSwitch
                onViewChange={(mode) => handleViewModeChange(viewMode.name === "Bevásárló lista" ? "shopping-list-view-mode" : "movies-view-mode", mode)}
                storageKey={viewMode.name === "Bevásárló lista" ? "shopping-list-view-mode" : "movies-view-mode"}
                defaultView={viewMode.mode}
              />
            </div>
          ))
        ) : (
          <div>Nézetek betöltése...</div>
        )}
      </div>
    </div>
  );
};

export default SettingsComponent;