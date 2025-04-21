import { showNotification } from "@/lib/showNotification";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";

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
  const recipeTypes = [
    "Reggeli",
    "Ebéd",
    "Vacsora",
    "Snack",
    "Desszert",
    "Ital",
    "Egyéb",
  ];
  const recipeDifficulties = ["Könnyű", "Közepes", "Nehéz"];
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

  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
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
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedRecipe),
    });

    const data = await response.json();

    if (response.ok) {
      showNotification("Recept mentve", "success");
    } else {
      showNotification("Hiba történt a mentés során", "error");
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch("/api/recipes");
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
      name: "",
      amount: "",
      unit: "",
    };
    setSelectedRecipe({
      ...selectedRecipe,
      ingredients: [...selectedRecipe.ingredients, newIngredient],
    });
  };

  const updateIngredient = (
    index: number,
    field: keyof Recipe["ingredients"][0],
    value: string
  ) => {
    if (!selectedRecipe) return;
    const updatedIngredients = [...selectedRecipe.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setSelectedRecipe({
      ...selectedRecipe,
      ingredients: updatedIngredients,
    });
  };

  const deleteIngredient = (id: string) => {
    if (!selectedRecipe) return;
    setSelectedRecipe({
      ...selectedRecipe,
      ingredients: selectedRecipe.ingredients.filter((ing) => ing.id !== id),
    });
  };

  const addStep = () => {
    if (!selectedRecipe) return;
    const newStep = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
    };
    setSelectedRecipe({
      ...selectedRecipe,
      steps: [...selectedRecipe.steps, newStep],
    });
  };

  const updateStep = (index: number, value: string) => {
    if (!selectedRecipe) return;
    const updatedSteps = [...selectedRecipe.steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      description: value,
    };
    setSelectedRecipe({
      ...selectedRecipe,
      steps: updatedSteps,
    });
  };

  const deleteStep = (id: string) => {
    if (!selectedRecipe) return;
    setSelectedRecipe({
      ...selectedRecipe,
      steps: selectedRecipe.steps.filter((step) => step.id !== id),
    });
  };

  return (
    <div className="max-h-[100dvh] h-screen overflow-y-auto overflow-x-hidden flex flex-col bg-gray-100 text-gray-900 p-6 sm:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Receptek szerkesztése
      </h1>

      <div className="bg-white mb-6 p-6 rounded-2xl shadow-sm space-y-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
          className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Add meg a recept nevét"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>

      <div className="flex-1 w-full overflow-y-auto px-4 sm:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              onClick={() => setSelectedRecipe(recipe)}
              className="cursor-pointer bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={
                  recipe.url ||
                  "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                }
                alt={recipe.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {recipe.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {recipe.types.map((type, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                  {recipe.difficulties.map((diff, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                    >
                      {diff}
                    </span>
                  ))}
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                    {recipe.ingredients.length} hozzávaló
                  </span>
                </div>
              </div>
            </div>
          ))}
          {recipes.length === 0 && (
            <p className="text-gray-500 col-span-full text-center py-8">
              Nincs találat a megadott feltételekre.
            </p>
          )}
        </div>
      </div>

      <Modal handlerFunction={() => setSelectedRecipe(null)} state={!!selectedRecipe}>
        <div className="bg-white rounded-2xl overflow-hidden">
          <img
            src={
              selectedRecipe?.url ||
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            }
            alt={selectedRecipe?.name}
            className="w-full h-60 object-cover"
          />
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <input
                type="text"
                value={selectedRecipe?.name || ""}
                onChange={(e) =>
                  setSelectedRecipe({
                    ...selectedRecipe!,
                    name: e.target.value,
                  })
                }
                className="text-2xl font-bold text-gray-800 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Típusok</h3>
              <div className="space-y-2">
                {selectedRecipe?.types.map((type, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <select
                      className="flex-1 p-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                      onChange={(e) => {
                        const updatedTypes = [...selectedRecipe.types];
                        updatedTypes[idx] = e.target.value;
                        setSelectedRecipe({
                          ...selectedRecipe,
                          types: updatedTypes,
                        });
                        showNotification("Típus frissítve", "success");
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
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                      onClick={() => {
                        const updatedTypes = selectedRecipe.types.filter(
                          (t) => t !== type
                        );
                        setSelectedRecipe({
                          ...selectedRecipe,
                          types: updatedTypes,
                        });
                        showNotification("Típus törölve", "success");
                      }}
                    >
                      Törlés
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                onClick={() => {
                  const updatedTypes = [
                    ...selectedRecipe?.types!,
                    recipeTypes[0],
                  ];
                  setSelectedRecipe({
                    ...selectedRecipe!,
                    types: updatedTypes,
                  });
                  showNotification("Típus hozzáadva", "success");
                }}
              >
                Típus hozzáadása
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Nehézség</h3>
              <div className="space-y-2">
                {selectedRecipe?.difficulties.map((diff, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <select
                      className="flex-1 p-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                      onChange={(e) => {
                        const updatedDiff = [...selectedRecipe.difficulties];
                        updatedDiff[idx] = e.target.value;
                        setSelectedRecipe({
                          ...selectedRecipe,
                          difficulties: updatedDiff,
                        });
                        showNotification("Nehézség frissítve", "success");
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
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                      onClick={() => {
                        const updatedDiff = selectedRecipe.difficulties.filter(
                          (d) => d !== diff
                        );
                        setSelectedRecipe({
                          ...selectedRecipe,
                          difficulties: updatedDiff,
                        });
                        showNotification("Nehézség törölve", "success");
                      }}
                    >
                      Törlés
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                onClick={() => {
                  const updatedDiff = [
                    ...selectedRecipe?.difficulties!,
                    recipeDifficulties[0],
                  ];
                  setSelectedRecipe({
                    ...selectedRecipe!,
                    difficulties: updatedDiff,
                  });
                  showNotification("Nehézség hozzáadva", "success");
                }}
              >
                Nehézség hozzáadása
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Hozzávalók</h3>
              <div className="space-y-3">
                {selectedRecipe?.ingredients.map((ing, idx) => (
                  <div key={ing.id} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      className="flex-1 p-2 border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                      placeholder="Hozzávaló neve"
                      value={ing.name}
                      onChange={(e) =>
                        updateIngredient(idx, "name", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="w-full sm:w-24 p-2 border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                      placeholder="Mennyiség"
                      value={ing.amount}
                      onChange={(e) =>
                        updateIngredient(idx, "amount", e.target.value)
                      }
                    />
                    <select
                      className="w-full sm:w-32 p-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                      value={ing.unit}
                      onChange={(e) =>
                        updateIngredient(idx, "unit", e.target.value)
                      }
                    >
                      {units.map((unit, i) => (
                        <option key={i} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                    <button
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                      onClick={() => deleteIngredient(ing.id)}
                    >
                      Törlés
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                onClick={addIngredient}
              >
                Hozzávaló hozzáadása
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Lépések</h3>
              <div className="space-y-3">
                {selectedRecipe?.steps.map((step, idx) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <input
                      type="text"
                      className="flex-1 p-2 border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                      placeholder={`Lépés ${idx + 1}`}
                      value={step.description}
                      onChange={(e) => updateStep(idx, e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-gray-700 transition text-sm"
                        onClick={() => moveStep(idx, idx - 1)}
                        disabled={idx === 0}
                      >
                        ↑
                      </button>
                      <button
                        className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-gray-700 transition text-sm"
                        onClick={() => moveStep(idx, idx + 1)}
                        disabled={idx === selectedRecipe.steps.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                        onClick={() => deleteStep(step.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                onClick={addStep}
              >
                Lépés hozzáadása
              </button>
            </div>

            {selectedRecipe?.notes !== undefined && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Megjegyzés</h3>
                <textarea
                  rows={6}
                  className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y text-sm"
                  value={selectedRecipe.notes}
                  onChange={(e) => {
                    if (!selectedRecipe) return;
                    setSelectedRecipe({
                      ...selectedRecipe,
                      notes: e.target.value,
                    });
                  }}
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => saveRecipe()}
              >
                Mentés
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditRecipe;