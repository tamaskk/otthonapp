import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { foodName, type } = req.body as any;

    let predefinedPrompt: string = '';

    if (type === 'food') {
      predefinedPrompt = `
      Generate a JSON object representing the ${foodName} recipe with the following fields:
      - name: The name of the recipe / food in Hungarian
      - types: An array of strings, e.g., Reggeli, Ebéd, Vacsora, Snack, Desszert, Ital, Egyéb
      - difficulties: An array of strings, e.g., Könnyű, Közepes, Nehéz
      - url: Picture URL of the recipe
      - ingredients: An array of objects, each containing: id (use Math.random()), name (ingredient name in Hungarian), amount (numeric amount), unit (e.g., db, kg, g, l, ml, m, cm, mm)
      - steps: An array of objects, each containing: id (use Math.random()), description (step description in Hungarian)
      - note: Write here how many calories the recipe has
      The product should be related to "${foodName}".
      Ensure the response is a complete, valid JSON string with no truncation or missing brackets. Do not include markdown or extra text outside the JSON object.
      `;
    } else if (type === 'category') {
      predefinedPrompt = `
      Generate a JSON object representing a recipe from ${foodName} category with the following fields:
      - name: The name of the recipe / food in Hungarian
      - types: An array of strings, e.g., Reggeli, Ebéd, Vacsora, Snack, Desszert, Ital, Egyéb
      - difficulties: An array of strings, e.g., Könnyű, Közepes, Nehéz
      - url: Picture URL of the recipe
      - ingredients: An array of objects, each containing: id (use Math.random()), name (ingredient name in Hungarian), amount (numeric amount), unit (e.g., db, kg, g, l, ml, m, cm, mm)
      - steps: An array of objects, each containing: id (use Math.random()), description (step description in Hungarian)
      - note: Write here how many calories the recipe has
      The product should be related to "${foodName}".
      Ensure the response is a complete, valid JSON string with no truncation or missing brackets. Do not include markdown or extra text outside the JSON object.
      `;
    }

    const maxRetries = 2;
    let attempt = 0;
    let generatedObject: Product | null = null;
    let rawContent = '';

    while (attempt <= maxRetries) {
      try {
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
          max_tokens: 1500,
        });

        rawContent = completion.choices[0].message.content ?? '{}';
        if (!rawContent.trim().endsWith('}')) {
          console.error('Truncated response from OpenAI');
          throw new Error('Incomplete JSON response');
        }

        // Clean up the response content
        rawContent = rawContent
          .replace(/^```json\n?|\n?```$/g, '')
          .replace(/^```|\n?```$/g, '')
          .replace(/\\n/g, ' ')
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\\\/g, '\\')
          .trim();

        console.log('Cleaned OpenAI response:', rawContent);

        try {
          generatedObject = JSON.parse(rawContent) as Product;
        } catch (parseError) {
          console.error('Initial parse error:', parseError);
          rawContent = rawContent
            .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
            .replace(/(:\s*)([^",\{\}\[\]\s][^",\{\}\[\]]*?)([,}])/g, '$1"$2"$3');
          console.log('Attempting to parse cleaned response:', rawContent);
          generatedObject = JSON.parse(rawContent) as Product;
        }

        if (
          typeof generatedObject.name !== 'string' ||
          !Array.isArray(generatedObject.types) ||
          !Array.isArray(generatedObject.difficulties) ||
          typeof generatedObject.url !== 'string' ||
          !Array.isArray(generatedObject.ingredients) ||
          !Array.isArray(generatedObject.steps) ||
          typeof generatedObject.note !== 'string'
        ) {
          console.error('Invalid recipe object structure, returning fallback');
          generatedObject = {
            name: foodName,
            types: ['Egyéb'],
            difficulties: ['Könnyű'],
            url: 'https://example.com/placeholder.jpg',
            ingredients: [],
            steps: [],
            note: '',
          };
        }

        break; // Exit loop if successful
      } catch (error) {
        attempt++;
        if (attempt > maxRetries) {
          console.error('Max retries reached:', error);
          return res.status(500).json({
            error: 'Failed to generate valid JSON after retries',
            message: error instanceof Error ? error.message : 'Unknown error',
            rawContent,
          });
        }
      }
    }

    return res.status(200).json(generatedObject);
  } catch (error) {
    console.error('Error with OpenAI API:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default handler;