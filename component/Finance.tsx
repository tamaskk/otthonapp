import { showNotification } from '@/lib/showNotification';
import React, { useState } from 'react';

enum FinanceType {
  INCOME = 'income',
  EXPENSE = 'expense',
  SUBSCRIPTION = 'subscription',
  LOAN = 'loan',
  INVESTMENT = 'investment',
  SAVINGS = 'savings',
  OTHER = 'other',
}

interface FinanceItem {
  id: number;
  amount: number;
  type: FinanceType;
  date: string;
  description: string;
}

const Finance: React.FC = () => {
  const [state, setState] = useState<'add' | 'search'>('add');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<FinanceType | ''>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<FinanceType | ''>('');
  const [finances, setFinances] = useState<FinanceItem[]>([]);

  const transactionTypeHungarian = {
    [FinanceType.INCOME]: 'Bevétel',
    [FinanceType.EXPENSE]: 'Kiadás',
    [FinanceType.SUBSCRIPTION]: 'Előfizetés',
    [FinanceType.LOAN]: 'Kölcsön',
    [FinanceType.INVESTMENT]: 'Befektetés',
    [FinanceType.SAVINGS]: 'Megtakarítás',
    [FinanceType.OTHER]: 'Egyéb',
  };

  const filteredFinances = finances.filter((finance) => {
    const matchesQuery = searchQuery
      ? finance.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesType = searchType ? finance.type === searchType : true;
    return matchesQuery && matchesType;
  });

  const saveFinance = async () => {
    const response = await fetch('/api/finance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finances),
    });

    if (!response.ok) {
        showNotification('Hiba történt a mentés során', 'error');
    } else {
        const data = await response.json();

        showNotification('Sikeresen mentve', 'success');
        setAmount(0);
        setType('');
        setDescription('');
        setDate('');
        setFinances(...finances, data.newItem);
    }
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center bg-gray-50">
      {/* Header and Controls */}
      <div className="w-full max-w-2xl pt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Pénzügyek
        </h1>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setState('add')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              state === 'add'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Hozzáadás
          </button>
          <button
            onClick={() => setState('search')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              state === 'search'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Keresés
          </button>
        </div>

        {/* Form or Search */}
        <div className="bg-gray-100 p-6 rounded-md shadow-md text-black space-y-4 sticky top-0 z-10">
          {state === 'add' ? (
            <form onSubmit={handleAddFinance} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Új tranzakció</h2>
              <input
                type="number"
                placeholder="Összeg (Ft)"
                value={amount || ''}
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
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Tranzakció dátuma"
              />
              <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Hozzáadás
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Keresés</h2>
              <input
                type="text"
                placeholder="Keresés leírás alapján"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Keresés leírás alapján"
              />
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as FinanceType)}
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

      {/* Finances List */}
      <div className="flex-1 overflow-y-auto w-full px-4">
        <div className="max-w-2xl mx-auto py-6 space-y-4">
          {filteredFinances.length === 0 ? (
            <p className="text-gray-500 text-center">Nincs találat</p>
          ) : (
            filteredFinances.map((finance) => (
              <div
                key={finance.id}
                className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {finance.description}
                  </h3>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      finance.type === FinanceType.INCOME
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {finance.type.charAt(0).toUpperCase() + finance.type.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600">
                  Összeg: {finance.amount} Ft
                </p>
                <p className="text-gray-500 text-sm">
                  Dátum: {new Date(finance.date).toLocaleDateString('hu-HU')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Finance;