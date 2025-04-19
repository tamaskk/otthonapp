import { showNotification } from '@/lib/showNotification';
import React, { useState } from 'react';

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

interface Step {
  id: string;
  description: string;
}

const AddRecipe: React.FC = () => {
  const recipeTypes = ["Reggeli", "Ebéd", "Vacsora", "Snack", "Desszert", "Ital", "Egyéb"];
  const recipeDifficulties = ["Könnyű", "Közepes", "Nehéz"];
  const units = ["db", "kg", "g", "l", "ml", "m", "cm", "mm", "inch", "ft", "yd"];

  const [name, setName] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [url, setUrl] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
    const [notes, setNotes] = useState('');

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const addIngredient = () => {
    setIngredients([...ingredients, {
      id: crypto.randomUUID(),
      name: '',
      amount: '',
      unit: 'db'
    }]);
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map(ing =>
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  const deleteIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const moveIngredient = (id: string, direction: 'up' | 'down') => {
    const index = ingredients.findIndex(ing => ing.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === ingredients.length - 1)) return;

    const newIngredients = [...ingredients];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newIngredients[index], newIngredients[swapIndex]] = [newIngredients[swapIndex], newIngredients[index]];
    setIngredients(newIngredients);
  };

  const addStep = () => {
    setSteps([...steps, {
      id: crypto.randomUUID(),
      description: ''
    }]);
  };

  const updateStep = (id: string, description: string) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, description } : step
    ));
  };

  const deleteStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const moveStep = (id: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(step => step.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) return;

    const newSteps = [...steps];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const handleSave = async () => {

    if (!name || !selectedTypes.length || !selectedDifficulties.length) {
        showNotification('Kérlek töltsd ki a kötelező mezőket!', 'error');
        return;
    }

    showNotification('Recept mentése folyamatban...', 'info');

    const data = {
        name,
        types: selectedTypes,
        difficulties: selectedDifficulties,
        url,
        ingredients,
        steps,
        notes
        };

    const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        });
    
    const result = await response.json();

    if (response.ok) {
      console.log('Recipe saved successfully:', result);
      // Reset form
      setName('');
      setSelectedTypes([]);
      setSelectedDifficulties([]);
      setUrl('');
      setIngredients([]);
      setSteps([]);
      setNotes('');
      showNotification('Recept sikeresen mentve!', 'success');
    } else {
      console.error('Error saving recipe:', result);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg my-6 sm:my-10">
      <h1 className="text-2xl font-bold text-black mb-6 text-center">Recept hozzáadása</h1>

      {/* Name Input */}
      <div className="mb-6">
        <label className="block text-black font-medium mb-2">Recept neve</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="Pl. Házi pizza"
        />
      </div>

      {/* Recipe Type Buttons */}
      <div className="mb-6">
        <label className="block text-black font-medium mb-2">Típus</label>
        <div className="flex flex-wrap gap-2">
          {recipeTypes.map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors text-black text-sm sm:text-base ${
                selectedTypes.includes(type)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Buttons */}
      <div className="mb-6">
        <label className="block text-black font-medium mb-2">Nehézség</label>
        <div className="flex flex-wrap gap-2">
          {recipeDifficulties.map(difficulty => (
            <button
              key={difficulty}
              onClick={() => toggleDifficulty(difficulty)}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors text-black text-sm sm:text-base ${
                selectedDifficulties.includes(difficulty)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* URL Input */}
      <div className="mb-6">
        <label className="block text-black font-medium mb-2">Kép URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="https://example.com"
        />
      </div>

      {/* Ingredients Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
          <label className="text-black font-medium mb-2 sm:mb-0">Hozzávalók</label>
          <button
            onClick={addIngredient}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base"
          >
            + Hozzávaló hozzáadása
          </button>
        </div>
        {ingredients.map((ingredient, index) => (
          <div key={ingredient.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
              placeholder="Hozzávaló neve"
            />
            <input
              type="text"
              value={ingredient.amount}
              onChange={(e) => updateIngredient(ingredient.id, 'amount', e.target.value)}
              className="w-full sm:w-20 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
              placeholder="Mennyiség"
            />
            <select
              value={ingredient.unit}
              onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
              className="w-full sm:w-20 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => moveIngredient(ingredient.id, 'up')}
                disabled={index === 0}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-black text-sm sm:text-base"
              >
                ↑
              </button>
              <button
                onClick={() => moveIngredient(ingredient.id, 'down')}
                disabled={index === ingredients.length - 1}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-black text-sm sm:text-base"
              >
                ↓
              </button>
              <button
                onClick={() => deleteIngredient(ingredient.id)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm sm:text-base"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Steps Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
          <label className="text-black font-medium mb-2 sm:mb-0">Lépések</label>
          <button
            onClick={addStep}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base"
          >
            + Lépés hozzáadása
          </button>
        </div>
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
            <input
              type="text"
              value={step.description}
              onChange={(e) => updateStep(step.id, e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
              placeholder={`Lépés ${index + 1}`}
            />
            <div className="flex gap-2">
              <button
                onClick={() => moveStep(step.id, 'up')}
                disabled={index === 0}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-black text-sm sm:text-base"
              >
                ↑
              </button>
              <button
                onClick={() => moveStep(step.id, 'down')}
                disabled={index === steps.length - 1}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-black text-sm sm:text-base"
              >
                ↓
              </button>
              <button
                onClick={() => deleteStep(step.id)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm sm:text-base"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <textarea 
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-6"
        placeholder="Egyéb megjegyzések"
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {/* Save Button */}
      <div className="text-center">
        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
        >
          Recept mentése
        </button>
      </div>
    </div>
  );
};

export default AddRecipe;