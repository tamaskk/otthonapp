import { showNotification } from "@/lib/showNotification";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";

interface WCCode {
  _id: string;
  place: string;
  code: string;
}

const WCCodesComponent: React.FC = () => {
  const [place, setPlace] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [codes, setCodes] = useState<WCCode[]>([]);
  const [selectedCode, setSelectedCode] = useState<WCCode | null>(null);
  const [editPlace, setEditPlace] = useState("");
  const [editCode, setEditCode] = useState("");

  const saveCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!place || !code) {
      showNotification("Kérlek töltsd ki az összes mezőt!", "error");
      return;
    }

    const response = await fetch("/api/wc-codes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        place,
        code,
      }),
    });

    if (!response.ok) {
      showNotification("Hiba történt a mentés során", "error");
      return;
    }

    const data = await response.json();

    showNotification("Sikeresen elmentve", "success");
    setCodes([...codes, {
        _id: data._id,
        place: data.place,
        code: data.code
    }]);
    setPlace("");
    setCode("");
  };

  const updateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCode) return;

    if (!editPlace || !editCode) {
      showNotification("Kérlek töltsd ki az összes mezőt!", "error");
      return;
    }

    try {
      const response = await fetch(`/api/wc-codes?id=${selectedCode._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          place: editPlace,
          code: editCode,
        }),
      });

      if (!response.ok) {
        showNotification("Hiba történt a módosítás során", "error");
        return;
      }

      const updatedCodes = codes.map(code => 
        code._id === selectedCode._id 
          ? { ...code, place: editPlace, code: editCode }
          : code
      );
      
      setCodes(updatedCodes);
      setSelectedCode(null);
      showNotification("Sikeresen módosítva", "success");
    } catch (error) {
      showNotification("Hiba történt a módosítás során", "error");
    }
  };

  useEffect(() => {
    const fetchCodes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/wc-codes");
        if (!response.ok) {
          showNotification("Hiba történt a kódok betöltése során", "error");
          return;
        }
        const data = await response.json();
        setCodes(data);
      } catch (error) {
        showNotification("Hiba történt a kódok betöltése során", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCodes();
  }, []);

  const deleteCode = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/wc-codes?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        showNotification("Hiba történt a törlés során", "error");
        return;
      }

      setCodes(codes.filter((code) => code._id !== id));
      showNotification("Sikeresen törölve", "success");
    } catch (error) {
      showNotification("Hiba történt a törlés során", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (wcCode: WCCode) => {
    setSelectedCode(wcCode);
    setEditPlace(wcCode.place);
    setEditCode(wcCode.code);
  };

  return (
    <div className="max-h-[100dvh] h-screen overflow-y-auto overflow-x-hidden flex flex-col bg-gray-100 text-gray-900 p-6 sm:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          WC Kódok
        </h1>

        {/* Add Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <form onSubmit={saveCode} className="space-y-4">
            <input
              type="text"
              placeholder="Helyszín"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Kód"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Kód Hozzáadása
            </button>
          </form>
        </div>

        {/* Codes List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Kódok betöltése...</p>
            </div>
          ) : codes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-xl font-semibold text-gray-700 mb-2">Még nincsenek kódok</p>
              <p className="text-gray-500 text-center">Add hozzá az első WC kódot a fenti űrlap segítségével.</p>
            </div>
          ) : (
            codes.map((wcCode) => (
              <div
                key={wcCode._id}
                className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {wcCode.place}
                    </h3>
                    <p className="text-gray-600">Kód: {wcCode.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(wcCode)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      aria-label="Kód szerkesztése"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteCode(wcCode._id)}
                      disabled={isDeleting === wcCode._id}
                      className={`p-1 text-red-600 hover:text-red-800 ${
                        isDeleting === wcCode._id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      aria-label="Kód törlése"
                    >
                      {isDeleting === wcCode._id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        handlerFunction={() => setSelectedCode(null)}
        state={Boolean(selectedCode)}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Kód szerkesztése</h2>
          <form onSubmit={updateCode} className="space-y-4">
            <input
              type="text"
              placeholder="Helyszín"
              value={editPlace}
              onChange={(e) => setEditPlace(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Kód"
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Mentés
              </button>
              <button
                type="button"
                onClick={() => setSelectedCode(null)}
                className="flex-1 p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Mégse
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default WCCodesComponent;
