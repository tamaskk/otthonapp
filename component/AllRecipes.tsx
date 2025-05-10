import { showNotification } from '@/lib/showNotification';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import ViewModeSwitch from './ViewModeSwitch';

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
  const [isGridView, setIsGridView] = useState<'grid' | 'table'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load view preference from localStorage
    const savedView = localStorage.getItem('recipeViewPreference');
    if (savedView) {
      setIsGridView(savedView as 'grid' | 'table');
    }
  }, []);

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
      setIsLoading(true);
      try {
        const response = await fetch('/api/recipes');
        const data = await response.json();
        setAllRecipes(data);
        setRecipes(data);
      } catch (error) {
        showNotification('Hiba történt a receptek betöltése során', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="bg-white max-h-[100dvh] flex-1 h-full overflow-hidden p-6 flex flex-col items-center justify-start">
      <div className="absolute top-6 left-6 flex items-center space-x-2">
        {/* <span className={`text-sm ${isGridView ? 'text-blue-600' : 'text-gray-500'}`}>Rács</span>
        <button
          onClick={toggleView}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isGridView ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isGridView ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm ${!isGridView ? 'text-blue-600' : 'text-gray-500'}`}>Lista</span> */}
        <ViewModeSwitch
          storageKey="recipeViewPreference"
          onViewChange={(mode) => setIsGridView(mode as 'grid' | 'table')}
          defaultView={isGridView}
        />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Receptek</h1>

      <div className="bg-gray-100 mb-2 p-6 w-[90%] rounded-md shadow-md text-black space-y-4">
        <div className="flex justify-between items-center">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 rounded-md border border-gray-300"
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
            className="p-2 rounded-md border border-gray-300"
            placeholder="Add meg a recept nevét"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Recipes Container */}
      <div className="flex-1 w-screen overflow-y-auto px-4 md:px-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Receptek betöltése...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nincsenek receptek</h3>
            <p className="text-gray-500">
              {searchName || selectedType
                ? 'Nincs találat a megadott feltételekre.'
                : 'Még nincs egyetlen recept sem hozzáadva.'}
            </p>
          </div>
        ) : isGridView === 'grid' ? (
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
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto py-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="cursor-pointer bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{recipe.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {recipe.types.map((type, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                      {recipe.difficulties.map((diff, idx) => (
                        <span
                        key={idx}
                        className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full"
                        >
                          {diff}
                        </span>
                      ))}
                      </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-yellow-100 text-yellow-700 text-sm px-2 py-1 rounded-full">
                      {recipe.ingredients.length} hozzávaló
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
    </div>
  );
};

export default AllRecipes;