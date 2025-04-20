import { showNotification } from "@/lib/showNotification";
import React, { useEffect, useState } from "react";

enum FinanceType {
  INCOME = "income",
  EXPENSE = "expense",
  SUBSCRIPTION = "subscription",
  LOAN = "loan",
  INVESTMENT = "investment",
  SAVINGS = "savings",
  OTHER = "other",
}

interface FinanceItem {
  _id: string;
  name: string;
  amount: number;
  type: FinanceType;
  date: string;
  description: string;
}

const Finance: React.FC = () => {
  const [state, setState] = useState<"add" | "search">("add");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<FinanceType | "">("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchType, setSearchType] = useState<FinanceType | "">("");
  const [finances, setFinances] = useState<FinanceItem[]>([]);
  const [name, setName] = useState<string>("");
  const [isBlockOpen, setIsBlockOpen] = useState<boolean>(false);

  const transactionTypeHungarian = {
    [FinanceType.INCOME]: "Bevétel",
    [FinanceType.EXPENSE]: "Kiadás",
    [FinanceType.SUBSCRIPTION]: "Előfizetés",
    [FinanceType.LOAN]: "Kölcsön",
    [FinanceType.INVESTMENT]: "Befektetés",
    [FinanceType.SAVINGS]: "Megtakarítás",
    [FinanceType.OTHER]: "Egyéb",
  };

  const filteredFinances = finances.filter((finance) => {
    const matchesQuery = searchQuery
      ? finance.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        finance.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesType = searchType ? finance.type === searchType : true;
    return matchesQuery && matchesType;
  });

  const saveFinance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !amount ||
      !type ||
      (!date && type !== FinanceType.SUBSCRIPTION)
    ) {
      showNotification("Kérlek, töltsd ki az összes kötelező mezőt", "error");
      return;
    }

    const response = await fetch("/api/finance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        amount,
        type,
        date: type === FinanceType.SUBSCRIPTION ? date : date,
        description,
      }),
    });

    if (!response.ok) {
      showNotification("Hiba történt a mentés során", "error");
      return;
    }

    const data = await response.json();
    if (!data?.newItem) {
      showNotification("Hiba történt a mentés során", "error");
      return;
    }

    showNotification("Sikeresen mentve", "success");
    setFinances([...finances, data.newItem]);
    setAmount(0);
    setType("");
    setDescription("");
    setDate("");
    setName("");
  };

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const response = await fetch("/api/finance");
        if (!response.ok) {
          showNotification("Hiba történt az adatok betöltése során", "error");
          return;
        }
        const data = await response.json();
        setFinances(data);
      } catch (error) {
        showNotification("Hiba történt az adatok betöltése során", "error");
      }
    };

    fetchFinances();
  }, []);

  const deleteFinance = async (id: string) => {
    try {
      const response = await fetch(`/api/finance?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        showNotification("Hiba történt a törlés során", "error");
        return;
      }

      setFinances(finances.filter((finance) => finance._id !== id));
      showNotification("Sikeresen törölve", "success");
    } catch (error) {
      showNotification("Hiba történt a törlés során", "error");
    }
  };

  const styleOfBubble = (type: FinanceType) => {
    switch (type) {
      case FinanceType.INCOME:
        return "bg-green-100 text-green-700";
      case FinanceType.EXPENSE:
        return "bg-red-100 text-red-700";
      case FinanceType.SUBSCRIPTION:
        return "bg-yellow-100 text-yellow-700";
      case FinanceType.LOAN:
        return "bg-blue-100 text-blue-700";
      case FinanceType.INVESTMENT:
        return "bg-purple-100 text-purple-700";
      case FinanceType.SAVINGS:
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center bg-gray-50">
      {/* Header and Controls */}
      <div className="w-full max-w-2xl pt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Pénzügyek
        </h1>
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setState("add")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              state === "add"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Hozzáadás
          </button>
          <button
            onClick={() => setState("search")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              state === "search"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Keresés
          </button>
          {!isBlockOpen && (
            <button
              onClick={() => setIsBlockOpen(!isBlockOpen)}
              className="p-2 rounded-md font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
            >
              {isBlockOpen ? "Bezárás" : "Nyitás"}
            </button>
          )}
        </div>
        {/* Add/Search Block (Collapsible) */}
        {isBlockOpen && (
          <div>
            {/* Toggle Buttons */}

            {/* Form or Search */}
            <div className="bg-gray-100 p-6 rounded-md shadow-md text-black space-y-4 sticky top-0 z-10">
              {state === "add" ? (
                <div onSubmit={saveFinance} className="space-y-4">
                  <div className="flex flex-row items-center justify-between w-full">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Új tranzakció
                    </h2>
                    <button
                      onClick={() => setIsBlockOpen(!isBlockOpen)}
                      className="p-2 rounded-md font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {isBlockOpen ? "Bezárás" : "Nyitás"}
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Név"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Tranzakció neve"
                  />
                  <input
                    type="number"
                    placeholder="Összeg (Ft)"
                    value={amount || ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    aria-label="Tranzakció összege"
                  />
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as FinanceType)}
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Tranzakció típusa"
                  >
                    <option value="" disabled>
                      Válassz típust
                    </option>
                    {Object.values(FinanceType).map((type) => (
                      <option key={type} value={type}>
                        {transactionTypeHungarian[type]}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Leírás"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Tranzakció leírása"
                  />
                  {type !== FinanceType.SUBSCRIPTION ? (
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Tranzakció dátuma"
                    />
                  ) : (
                    <select
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Előfizetés napja"
                    >
                      <option value="" disabled>
                        Válassz napot
                      </option>
                      {[...Array(31).keys()].map((day) => (
                        <option key={day} value={day + 1}>
                          {day + 1}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={saveFinance}
                    className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Hozzáadás
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-row items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Keresés
                    </h2>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setIsBlockOpen(!isBlockOpen)}
                        className="p-2 rounded-md font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {isBlockOpen ? "Bezárás" : "Nyitás"}
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Keresés név vagy leírás alapján"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Keresés név vagy leírás alapján"
                  />
                  <select
                    value={searchType}
                    onChange={(e) =>
                      setSearchType(e.target.value as FinanceType)
                    }
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Keresés típus alapján"
                  >
                    <option value="">Összes típus</option>
                    {Object.values(FinanceType).map((type) => (
                      <option key={type} value={type}>
                        {transactionTypeHungarian[type]}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Finances List */}
      <div className="flex-1 overflow-y-auto w-full px-4">
        <div className="max-w-2xl mx-auto py-6 space-y-4">
          {filteredFinances.length === 0 ? (
            <p className="text-gray-500 text-center">Nincs találat</p>
          ) : (
            filteredFinances.map((finance) => (
              <div
                key={finance._id}
                className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {finance.name}
                    </h3>
                    <p className="text-gray-600">{finance.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${styleOfBubble(
                        finance.type
                      )}`}
                    >
                      {transactionTypeHungarian[finance.type]}
                    </span>
                    <button
                      onClick={() => deleteFinance(finance._id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      aria-label="Tranzakció törlése"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">Összeg: {finance.amount} Ft</p>
                {finance.date && (
                  <p className="text-gray-500 text-sm">
                    Dátum:{" "}
                    {finance.type === FinanceType.SUBSCRIPTION
                      ? `Minden hónap ${finance.date}. napján`
                      : new Date(finance.date).toLocaleDateString("hu-HU")}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Finance;
