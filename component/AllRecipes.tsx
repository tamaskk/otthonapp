import { showNotification } from '@/lib/showNotification';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';

interface Recipe {
  id: number;
  name: string;
  types: string[];
  difficulties: string[];
  url: string;
  ingredients: { id: string; name: string; amount: string; unit: string }[];
  steps: { id: string; description: string }[];
  notes: string;
}

const AllRecipes: React.FC = () => {
  const recipeTypes = ['Reggeli', 'Ebéd', 'Vacsora', 'Snack', 'Desszert', 'Ital', 'Egyéb'];

  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [portion, setPortion] = useState<number>(1);

  useEffect(() => {
    let filteredList = [...allRecipes];

    if (selectedType) {
      filteredList = filteredList.filter((recipe) =>
        recipe.types.includes(selectedType)
      );
    }

    if (searchName.trim()) {
      filteredList = filteredList.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setRecipes(filteredList);
  }, [selectedType, searchName, allRecipes]);

  const addToShoppingList = async (recipe: Recipe) => {
    if (!recipe) return;

    showNotification('Hozzáadás folyamatban...', 'info');

    const portionedIngredients = {
      ingredients: recipe.ingredients.map((ingredient: { id: string; name: string; amount: string; unit: string }) => ({
        name: ingredient.name,
        quantity: String(Number(ingredient.amount) * portion),
        quantityUnit: ingredient.unit,
        shop: '',
        price: 0,
        note: `Hozzávaló a ${recipe.name} recepthez`,
        done: false,
      })),
    };

    const response = await fetch('/api/shopping-list', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(portionedIngredients),
    });

    if (response.ok) {
      showNotification('Hozzáadva a bevásárlólistához', 'success');
    } else {
      showNotification('Hiba történt a hozzáadás során', 'error');
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch('/api/recipes');
      const data = await response.json();
      setAllRecipes(data);
      setRecipes(data);
    };

    fetchRecipes();
  }, []);

  return (
<div className="bg-white max-h-[100dvh] flex-1 h-full overflow-hidden p-6 flex flex-col items-center justify-start">      {/* Fixed Header and Filters */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">          Receptek
        </h1>

        <div className="bg-gray-100 p-6 w-[90%] rounded-md shadow-md text-black space-y-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300"
          >
            <option value="">Összes típus</option>
            {recipeTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="w-full p-2 rounded-md border border-gray-300"
            placeholder="Add meg a recept nevét"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

      {/* Scrollable Recipes Grid */}
      <div className="flex-1 w-screen overflow-y-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto py-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={
                  recipe.url
                    ? recipe.url
                    : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
                alt={recipe.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {recipe.name}
                </h2>

                <div className="flex flex-wrap gap-2 mb-2">
                  {recipe.types.map((type, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                  {recipe.difficulties.map((diff, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full"
                    >
                      {diff}
                    </span>
                  ))}
                  <span className="bg-yellow-100 text-yellow-700 text-sm px-2 py-1 rounded-full">
                    {recipe.ingredients.length} hozzávaló
                  </span>
                </div>
              </div>
            </div>
          ))}

          {recipes.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">
              Nincs találat a megadott feltételekre.
            </p>
          )}
        </div>
      </div>

      <Modal
        handlerFunction={() => setSelectedRecipe(null)}
        state={Boolean(selectedRecipe)}
      >
            <img
              src={
                selectedRecipe?.url
                  ? selectedRecipe.url
                  : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdl(postId)fHx8fGVufDB8fHx8fA%3D%3D'
              }
              alt={selectedRecipe?.name}
              className="w-full h-60 object-cover rounded-t-xl"
            />
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold mb-4 text-black">{selectedRecipe?.name}</h2>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1 text-black">Típusok:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe?.types.map((type, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1 text-black">Nehézség:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe?.difficulties.map((diff, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full"
                    >
                      {diff}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1 text-black">Hozzávalók:</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {selectedRecipe?.ingredients.map((ing) => (
                    <li key={ing.id}>
                      {ing.name} – {ing.amount} {ing.unit}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedRecipe!?.steps.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-1 text-black">Lépések:</h3>
                  <ol className="list-decimal list-inside text-sm text-gray-700">
                    {selectedRecipe?.steps.map((step) => (
                      <li key={step.id}>{step.description}</li>
                    ))}
                  </ol>
                </div>
              )}

              {selectedRecipe?.notes && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-1 text-black">Megjegyzés:</h3>
                  <p className="text-sm text-gray-700">{selectedRecipe.notes}</p>
                </div>
              )}

              <div className="mb-4">
                <select
                  value={portion}
                  onChange={(e) => setPortion(Number(e.target.value))}
                  className="w-full p-2 rounded-md border border-gray-300 text-sm text-gray-700"
                >
                  <option disabled>Válassz adagot</option>
                  <option value="1">1 adag</option>
                  <option value="2">2 adag</option>
                  <option value="3">3 adag</option>
                  <option value="4">4 adag</option>
                  <option value="5">5 adag</option>
                </select>
              </div>

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full"
                onClick={() => addToShoppingList(selectedRecipe!)}
              >
                Hozzáadás bevásárlólistához
              </button>
        </div>
      </Modal>

      {/* Recipe Modal
      {selectedRecipe && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-[90%] md:w-[600px] rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
            <img
              src={
                selectedRecipe.url
                  ? selectedRecipe.url
                  : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdl(postId)fHx8fGVufDB8fHx8fA%3D%3D'
              }
              alt={selectedRecipe.name}
              className="w-full h-60 object-cover rounded-t-xl"
            />
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold mb-4 text-black">{selectedRecipe.name}</h2>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1 text-black">Típusok:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.types.map((type, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1 text-black">Nehézség:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.difficulties.map((diff, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full"
                    >
                      {diff}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1 text-black">Hozzávalók:</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {selectedRecipe.ingredients.map((ing) => (
                    <li key={ing.id}>
                      {ing.name} – {ing.amount} {ing.unit}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedRecipe.steps.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-1 text-black">Lépések:</h3>
                  <ol className="list-decimal list-inside text-sm text-gray-700">
                    {selectedRecipe.steps.map((step) => (
                      <li key={step.id}>{step.description}</li>
                    ))}
                  </ol>
                </div>
              )}

              {selectedRecipe.notes && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-1 text-black">Megjegyzés:</h3>
                  <p className="text-sm text-gray-700">{selectedRecipe.notes}</p>
                </div>
              )}

              <div className="mb-4">
                <select
                  value={portion}
                  onChange={(e) => setPortion(Number(e.target.value))}
                  className="w-full p-2 rounded-md border border-gray-300 text-sm text-gray-700"
                >
                  <option disabled>Válassz adagot</option>
                  <option value="1">1 adag</option>
                  <option value="2">2 adag</option>
                  <option value="3">3 adag</option>
                  <option value="4">4 adag</option>
                  <option value="5">5 adag</option>
                </select>
              </div>

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full"
                onClick={() => addToShoppingList(selectedRecipe)}
              >
                Hozzáadás bevásárlólistához
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AllRecipes;