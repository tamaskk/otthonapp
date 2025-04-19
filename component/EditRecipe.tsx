import { showNotification } from '@/lib/showNotification';
import React, { useEffect, useState } from 'react';

interface Recipe {
  _id: string;
  name: string;
  types: string[];
  difficulties: string[];
  url: string;
  ingredients: { id: string; name: string; amount: string; unit: string }[];
  steps: { id: string; description: string }[];
  notes: string;
}

const EditRecipe: React.FC = () => {
  const recipeTypes = ["Reggeli", "Ebéd", "Vacsora", "Snack", "Desszert", "Ital", "Egyéb"];
  const recipeDifficulties = ["Könnyű", "Közepes", "Nehéz"];
  const units = ["db", "kg", "g", "l", "ml", "m", "cm", "mm", "inch", "ft", "yd"];

  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [portion, setPortion] = useState<number>(1);

  const moveStep = (fromIndex: number, toIndex: number) => {
    setSelectedRecipe((prev) => {
      if (!prev) return prev;
      const newSteps = [...prev.steps];
      if (toIndex < 0 || toIndex >= newSteps.length) return prev;
      const [movedStep] = newSteps.splice(fromIndex, 1);
      newSteps.splice(toIndex, 0, movedStep);
      return { ...prev, steps: newSteps };
    });
  };
  

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

  const saveRecipe = async () => {

    const response = await fetch(`/api/recipes?id=${selectedRecipe?._id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedRecipe),
        });

    const data = await response.json();

    if (response.ok) {
      showNotification('Recept mentve', 'success');
    } else {
      showNotification('Hiba történt a mentés során', 'error');
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

  const addIngredient = () => {
    if (!selectedRecipe) return;
    const newIngredient = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      amount: '',
      unit: ''
    };
    setSelectedRecipe({
      ...selectedRecipe,
      ingredients: [...selectedRecipe.ingredients, newIngredient]
    });
  };

  const updateIngredient = (index: number, field: keyof Recipe['ingredients'][0], value: string) => {
    if (!selectedRecipe) return;
    const updatedIngredients = [...selectedRecipe.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value
    };
    setSelectedRecipe({
      ...selectedRecipe,
      ingredients: updatedIngredients
    });
  };

  const deleteIngredient = (id: string) => {
    if (!selectedRecipe) return;
    setSelectedRecipe({
      ...selectedRecipe,
      ingredients: selectedRecipe.ingredients.filter(ing => ing.id !== id)
    });
  };

  const addStep = () => {
    if (!selectedRecipe) return;
    const newStep = {
      id: Math.random().toString(36).substr(2, 9),
      description: ''
    };
    setSelectedRecipe({
      ...selectedRecipe,
      steps: [...selectedRecipe.steps, newStep]
    });
  };

  const updateStep = (index: number, value: string) => {
    if (!selectedRecipe) return;
    const updatedSteps = [...selectedRecipe.steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      description: value
    };
    setSelectedRecipe({
      ...selectedRecipe,
      steps: updatedSteps
    });
  };

  const deleteStep = (id: string) => {
    if (!selectedRecipe) return;
    setSelectedRecipe({
      ...selectedRecipe,
      steps: selectedRecipe.steps.filter(step => step.id !== id)
    });
  };

  return (
    <div className="bg-white min-h-screen p-6 flex flex-col items-center justify-start">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Receptek
      </h1>

      <div className="bg-gray-100 p-6 w-4/6 rounded-md shadow-md text-black space-y-4">
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

      <div className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4 md:px-0">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            onClick={() => setSelectedRecipe(recipe)}
            className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={recipe.url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'}
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

      {selectedRecipe && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] md:w-[600px] rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
            <img
              src={selectedRecipe.url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'}
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
                <div className="flex flex-col gap-2">
                  {selectedRecipe.types.map((type, idx) => (
                    <div key={idx} className="flex gap-2">
                      <select
                        className="text-black text-sm px-2 py-1 rounded border"
                        onChange={(e) => {
                          const updatedTypes = [...selectedRecipe.types];
                          updatedTypes[idx] = e.target.value;
                          setSelectedRecipe({ ...selectedRecipe, types: updatedTypes });
                          showNotification('Típus frissítve', 'success');
                        }}
                        value={type}
                      >
                        {recipeTypes.map((t, i) => (
                          <option key={i} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => {
                          const updatedTypes = selectedRecipe.types.filter((t) => t !== type);
                          setSelectedRecipe({ ...selectedRecipe, types: updatedTypes });
                          showNotification('Típus törölve', 'success');
                        }}
                      >
                        Törlés
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
                  onClick={() => {
                    const updatedTypes = [...selectedRecipe.types, recipeTypes[0]];
                    setSelectedRecipe({ ...selectedRecipe, types: updatedTypes });
                    showNotification('Típus hozzáadva', 'success');
                  }}
                >
                  Típus hozzáadása
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1 text-black">Nehézség:</h3>
                <div className="flex flex-col gap-2">
                  {selectedRecipe.difficulties.map((diff, idx) => (
                    <div key={idx} className="flex gap-2">
                      <select
                        className="text-black text-sm px-2 py-1 rounded border"
                        onChange={(e) => {
                          const updatedDiff = [...selectedRecipe.difficulties];
                          updatedDiff[idx] = e.target.value;
                          setSelectedRecipe({ ...selectedRecipe, difficulties: updatedDiff });
                          showNotification('Nehézség frissítve', 'success');
                        }}
                        value={diff}
                      >
                        {recipeDifficulties.map((d, i) => (
                          <option key={i} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => {
                          const updatedDiff = selectedRecipe.difficulties.filter((d) => d !== diff);
                          setSelectedRecipe({ ...selectedRecipe, difficulties: updatedDiff });
                          showNotification('Nehézség törölve', 'success');
                        }}
                      >
                        Törlés
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
                  onClick={() => {
                    const updatedDiff = [...selectedRecipe.difficulties, recipeDifficulties[0]];
                    setSelectedRecipe({ ...selectedRecipe, difficulties: updatedDiff });
                    showNotification('Nehézség hozzáadva', 'success');
                  }}
                >
                  Nehézség hozzáadása
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1 text-black">Hozzávalók:</h3>
                <div className="flex flex-col gap-2">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <div key={ing.id} className="flex gap-2 flex-col items-start text-black">
                      <input
                        type="text"
                        className="text-sm px-2 py-1 rounded border flex-1"
                        placeholder="Hozzávaló neve"
                        value={ing.name}
                        onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        className="text-sm px-2 py-1 rounded border w-24"
                        placeholder="Mennyiség"
                        value={ing.amount}
                        onChange={(e) => updateIngredient(idx, 'amount', e.target.value)}
                      />
                      <div className='flex flex-row w-full justify-between'>
                      {/* <input
                        type="text"
                        className="text-sm px-2 py-1 rounded border w-24"
                        placeholder="Egység"
                        value={ing.unit}
                        onChange={(e) => updateIngredient(idx, 'unit', e.target.value)}
                        /> */}
                        <select
                        className="text-sm px-2 py-1 rounded border w-24 text-black"
                        value={ing.unit}
                        onChange={(e) => updateIngredient(idx, 'unit', e.target.value)}
                        >
                            {units.map((unit, i) => (
                                <option key={i} value={unit}>
                                {unit}
                                </option>
                            ))}
                        </select>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => deleteIngredient(ing.id)}
                        >
                        Törlés
                      </button>
                          </div>
                    </div>
                  ))}
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
                  onClick={addIngredient}
                >
                  Hozzávaló hozzáadása
                </button>
              </div>

              {selectedRecipe.steps.map((step, idx) => (
  <div key={step.id} className="flex gap-2 items-center text-black">
    <input
      type="text"
      className="text-sm px-2 py-1 rounded border flex-1"
      placeholder={`Lépés ${idx + 1}`}
      value={step.description}
      onChange={(e) => updateStep(idx, e.target.value)}
    />
    <div className="flex flex-col gap-1">
      <button
        className="text-xs px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        onClick={() => moveStep(idx, idx - 1)}
        disabled={idx === 0}
      >
        Fel
      </button>
      <button
        className="text-xs px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        onClick={() => moveStep(idx, idx + 1)}
        disabled={idx === selectedRecipe.steps.length - 1}
      >
        Le
      </button>
    </div>
    <button
      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      onClick={() => deleteStep(step.id)}
    >
      Törlés
    </button>
  </div>
))}
<button
    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
    onClick={addStep}
>
    Lépés hozzáadása
</button>


              {selectedRecipe.notes && (
                <div className="mb-2">
                  <h3 className="font-semibold mb-1 text-black">Megjegyzés:</h3>
                  <textarea name="" id="" rows={10}
                  className="text-sm px-2 py-1 rounded border w-full text-black"
                    value={selectedRecipe.notes}
                    onChange={(e) => {
                      if (!selectedRecipe) return;
                      setSelectedRecipe({ ...selectedRecipe, notes: e.target.value });
                    }}
                  >

                  </textarea>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={() => saveRecipe()}
                >
                  Mentés
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditRecipe;