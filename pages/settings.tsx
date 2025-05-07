import Sidebar from "@/component/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";

const Settings = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

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
      <div className="p-8 text-black">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
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
              {notificationPermission === "granted"
                ? "Notifications Enabled"
                : "Enable Notifications"}
            </button>
            <span className="text-gray-600">
              {notificationPermission === "granted"
                ? "You will receive notifications for new shopping list items"
                : "Enable notifications to get alerts for new shopping list items"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
