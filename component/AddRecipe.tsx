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

  const [newIngredient, setNewIngredient] = useState<{
    name: string | null,
    unit: string | null,
    amount: string | null
  }>({
    name: null,
    unit: units[0], // Set default unit to first unit
    amount: null
  });

  const [newStep, setNewStep] = useState<{
    description: string | null
  }>({
    description: null
  });

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getAIRecipe = async () => {
    try {
      showNotification('AI recept generálása folyamatban...', 'info');
      const response = await fetch('/api/ai-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foodName: name ?? selectedTypes[0] , type: 'food' }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('AI Recipe:', data);
        setName(data.name);
        setUrl(data.url);
        setSelectedTypes([...data.types]);
        setSelectedDifficulties([...data.difficulties]);
        setIngredients(data.ingredients);
        setSteps(data.steps);
        setNotes(data.note);
        showNotification('AI recept sikeresen generálva!', 'success');
      } else {
        console.error('Error fetching AI recipe:', data.error);
      }
    } catch (error) { 
      console.error('Error:', error);
    }
  }

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const addIngredient = () => {
    if (!newIngredient.name || !newIngredient.amount) {
      showNotification('Kérlek töltsd ki a hozzávaló nevét és mennyiségét!', 'error');
      return;
    }

    const newIngredientItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: newIngredient.name,
      amount: newIngredient.amount,
      unit: newIngredient.unit || units[0]
    };

    setIngredients(prevIngredients => [...prevIngredients, newIngredientItem]);
    
    // Reset form
    setNewIngredient({
      name: '',
      amount: '',
      unit: units[0]
    });
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
    if (!newStep.description) {
      showNotification('Kérlek töltsd ki a lépés leírását!', 'error');
      return;
    }

    const newStepItem = {
      id: Math.random().toString(36).substring(2, 9),
      description: newStep.description
    };

    setSteps(prevSteps => [...prevSteps, newStepItem]);
    
    // Reset form
    setNewStep({
      description: ''
    });
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
<div className="max-h-[100dvh] h-screen overflow-y-auto overflow-x-hidden flex flex-col bg-gray-100 text-gray-900 p-6 sm:p-8">
<h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Recept hozzáadása</h1>

  <div className="space-y-8 bg-white rounded-2xl shadow-sm p-6 sm:p-8">
    {/* Name Input */}
    <div>
      <label className="block text-gray-700 font-semibold mb-2">Recept neve</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Pl. Házi pizza"
      />
    </div>

    {/* Recipe Type Buttons */}
    <div>
      <label className="block text-gray-700 font-semibold mb-3">Típus</label>
      <div className="flex flex-wrap gap-3">
        {recipeTypes.map(type => (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedTypes.includes(type)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>

    {/* Difficulty Buttons */}
    <div>
      <label className="block text-gray-700 font-semibold mb-3">Nehézség</label>
      <div className="flex flex-wrap gap-3">
        {recipeDifficulties.map(difficulty => (
          <button
            key={difficulty}
            onClick={() => toggleDifficulty(difficulty)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedDifficulties.includes(difficulty)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {difficulty}
          </button>
        ))}
      </div>
    </div>

    {/* URL Input */}
    <div>
      <label className="block text-gray-700 font-semibold mb-2">Kép URL</label>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="https://example.com"
      />
    </div>

    {/* Ingredients Section */}
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <label className="text-gray-700 font-semibold mb-2 sm:mb-0">Hozzávalók</label>
        <button
          onClick={addIngredient}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          + Hozzávaló hozzáadása
        </button>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <input
            type="text"
            value={newIngredient.name || ''}
            onChange={(e) => setNewIngredient({
              ...newIngredient,
              name: e.target.value
            })}
            className="flex-1 p-3 border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            placeholder="Hozzávaló neve"
          />
          <input
            type="text"
            value={newIngredient.amount || ''}
            onChange={(e) => setNewIngredient({
              ...newIngredient,
              amount: e.target.value
            })}
            className="w-full sm:w-24 p-3 border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            placeholder="Mennyiség"
          />
          <select
            value={newIngredient.unit || units[0]}
            onChange={(e) => setNewIngredient({
              ...newIngredient,
              unit: e.target.value
            })}
            className="w-full sm:w-32 p-3 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          >
            <option value="">Válassz mértékegységet</option>
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
      </div>

      {ingredients.map((ingredient, index) => (
        <div key={ingredient.id} className="flex flex-row justify-between sm:flex-row sm:items-center gap-3 mb-4">
          <div className='flex flex-row gap-4'>
          <p>
            {ingredient.name}
          </p>
          <p>
            {ingredient.amount}
          </p>
          <p>
            {ingredient.unit}
          </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => moveIngredient(ingredient.id, 'up')}
              disabled={index === 0}
              className="p-2 w-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-black font-black transition text-sm"
            >
              ↑
            </button>
            <button
              onClick={() => moveIngredient(ingredient.id, 'down')}
              disabled={index === ingredients.length - 1}
              className="p-2 w-10 text-black font-black bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition text-sm"
            >
              ↓
            </button>
            <button
              onClick={() => deleteIngredient(ingredient.id)}
              className="p-2 w-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Steps Section */}
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <label className="text-gray-700 font-semibold mb-2 sm:mb-0">Lépések</label>
        <button
          onClick={addStep}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          + Lépés hozzáadása
        </button>
      </div>
      <div className='mb-5'>
        <input 
          onChange={(value) => setNewStep({
            description: value.target.value
          })}
          value={newStep.description || ''}
          placeholder='Lépés'
          className="flex-1 p-3 border w-full border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
        />
      </div>
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-row justify-between sm:flex-row sm:items-center gap-3 mb-4">
          <p>
            {step.description}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => moveStep(step.id, 'up')}
              disabled={index === 0}
              className="p-2 w-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-gray-700 transition text-sm"
            >
              ↑
            </button>
            <button
              onClick={() => moveStep(step.id, 'down')}
              disabled={index === steps.length - 1}
              className="p-2 w-10 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-gray-700 transition text-sm"
            >
              ↓
            </button>
            <button
              onClick={() => deleteStep(step.id)}
              className="p-2 w-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Notes Section */}
    <div>
      <label className="block text-gray-700 font-semibold mb-2">Egyéb megjegyzések</label>
      <textarea
        className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y text-sm"
        placeholder="Egyéb megjegyzések"
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>

    {/* Save and AI Buttons */}
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        Recept mentése
      </button>
      <button
        onClick={getAIRecipe}
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
      >
        AI Recept generálása
      </button>
    </div>
  </div>
</div>
  );
};

export default AddRecipe;