import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from 'openai';

// Define the expected structure of the product object
interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
}

interface Step {
  id: number;
  step: string;
}

interface Product {
  name: string;
  types: string[];
  difficulties: string[];
  url: string;
  ingredients: Ingredient[];
  steps: Step[];
  note: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {foodName, type} = req.body as any;

    let predefinedPrompt: string = '';

    if (type === 'food') {
      predefinedPrompt = `
      Generate a JSON object representing the ${foodName} recipe with the following fields:
      - name: The name of the recipe / food in hungarian
      - types: Its an array of string which can be in like Reggeli, Ebéd, Vacsora, Snack, Desszert, Ital, Egyéb
      - difficulties: Its an array of string which can be in like Könnyű, Közepes, Nehéz
      - url: Picture URL of the recipe
      - ingredients: An array of objects, each containing: id which made with Math.random, name: the name of the ingredient in hungarian, amount: the amount of the ingredient, unit: the unit of measurement (e.g., db, kg, g, l, ml, m, cm, mm),
      - steps: An array of objects, each containing: id which made with Math.random, description: the step of the recipe in Hungarian,
      - note: its an empty string
      The product should be related to "${foodName}".
      Return the response as a valid JSON string.
      `;
    } else if (type === 'category') {
      predefinedPrompt = `
      Generate a JSON object representing the a recipe from ${foodName} category with the following fields:
      - name: The name of the recipe / food in hungarian
      - types: Its an array of string which can be in like Reggeli, Ebéd, Vacsora, Snack, Desszert, Ital, Egyéb
      - difficulties: Its an array of string which can be in like Könnyű, Közepes, Nehéz
      - url: Picture URL of the recipe
      - ingredients: An array of objects, each containing: id which made with Math.random, name: the name of the ingredient in hungarian, amount: the amount of the ingredient, unit: the unit of measurement (e.g., db, kg, g, l, ml, m, cm, mm),
      - steps: An array of objects, each containing: id which made with Math.random, description: the step of the recipe in Hungarian,
      - note: its an empty string
      The product should be related to "${foodName}".
      Return the response as a valid JSON string.
      `;
    }
 
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates structured JSON objects.',
        },
        {
          role: 'user',
          content: predefinedPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Parse and validate the response
    let generatedObject: Product;
    try {
      let rawContent = completion.choices[0].message.content ?? '{}';
      rawContent = rawContent
      .replace(/^```json\n?|\n?```$/g, '') // Remove ```json and ```
      .trim(); // Remove leading/trailing whitespace

      rawContent = rawContent.replace(/^```|\n?```$/g, '').trim(); // Remove ``` and trim whitespace  

      rawContent = rawContent.replace('`', ''); // Replace escaped newlines with actual newlines

      console.log('OpenAI response:', rawContent);
      generatedObject = JSON.parse(rawContent) as Product;

      if (
        typeof generatedObject.name !== 'string' ||
        !Array.isArray(generatedObject.types) ||
        !Array.isArray(generatedObject.difficulties) ||
        typeof generatedObject.url !== 'string' ||
        !Array.isArray(generatedObject.ingredients) ||
        !Array.isArray(generatedObject.steps) ||
        typeof generatedObject.note !== 'string'
      ) {
        throw new Error('Invalid recipe object structure');
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error(`Invalid JSON response from OpenAI: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    // Return the generated object
    return res.status(200).json(generatedObject);
  } catch (error) {
    console.error('Error with OpenAI API:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({ error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error' });
  }
}

export default handler;