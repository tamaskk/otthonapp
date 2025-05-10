import { connectToDatabase } from "@/db/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import OpenAI from "openai";

enum ExerciseType {
  CHEST = "chest",
  BACK = "back",
  LEG = "leg",
  BICEPS = "biceps",
  TRICEPS = "triceps",
  SHOULDER = "shoulder",
  ABS = "abs",
  FUNCTIONAL = "functional",
  CARDIO = "cardio",
  GLUTES = "glutes",
  MOBILITY = "mobility",
  STRETCHING = "stretching",
  OTHER = "other",
}

interface Product {
  name: string;
  description: string;
  types: ExerciseType[];
  repetitions: number;
  sets: number;
  weight: number;
  restTime: number;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const session = await getSession({ req });
  // if (!session) {
  //     return res.status(401).json({ message: 'Unauthorized' });
  // }
  
  try {
    const { type } = req.body as { type: ExerciseType };

    const client = await connectToDatabase();
    const db = client.db();
    const collection = db.collection("exercise");

    const allExercisesName = await collection
        .find({ types: type })
        .toArray()
        .then((data) => data.map((exercise) => exercise.name));

    

      let predefinedPrompt = `
      Generate a JSON object representing the an exercise from the muscle group of the ${type} with the following fields but not the same as the previous ones (${allExercisesName.join(", ")}) :
      - name: The name of the exercise in hungarian and then in parentheses the english name like "Fekvenyomás (Bench Press)"
      - description: The description of the exercise in hungarian
      - types: Its an array of string which can be in like CHEST, BACK, LEG, BICEPS, TRICEPS, SHOULDER, ABS, FUNCTIONAL, CARDIO, GLUTES, MOBILITY, STRETCHING, OTHER,
        - repetitions: The number of repetitions
        - sets: The number of sets
        - weight: The weight of the exercise in number of kg
        - restTime: The rest time between sets in number of seconds only
      - note: its an empty string
      The product should be related to "${type}".
      Return the response as a valid JSON string.
      `;
    

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates structured JSON objects.",
        },
        {
          role: "user",
          content: predefinedPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Parse and validate the response
    let generatedObject: Product;
    try {
      let rawContent = completion.choices[0].message.content ?? "{}";
      rawContent = rawContent
        .replace(/^```json\n?|\n?```$/g, "") // Remove ```json and ```
        .trim(); // Remove leading/trailing whitespace

      rawContent = rawContent.replace(/^```|\n?```$/g, "").trim(); // Remove ``` and trim whitespace

      rawContent = rawContent.replace("`", ""); // Replace escaped newlines with actual newlines

      console.log("OpenAI response:", rawContent);
      generatedObject = JSON.parse(rawContent) as Product;
        // Validate the generated object
        if (
            !generatedObject ||
            typeof generatedObject.name !== "string" ||
            typeof generatedObject.description !== "string" ||
            !Array.isArray(generatedObject.types) ||
            typeof generatedObject.repetitions !== "number" ||
            typeof generatedObject.sets !== "number" ||
            typeof generatedObject.weight !== "number" ||
            typeof generatedObject.restTime !== "number"
            ) {
            throw new Error("Invalid JSON structure");
            }

    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      throw new Error(
        `Invalid JSON response from OpenAI: ${
          parseError instanceof Error ? parseError.message : "Unknown error"
        }`
      );
    }

    // Return the generated object
    return res.status(200).json(generatedObject);
  } catch (error) {
    console.error(
      "Error with OpenAI API:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return res
      .status(500)
      .json({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
  }
};

export default handler;
