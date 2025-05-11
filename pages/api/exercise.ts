import { connectToDatabase } from "@/db/mongo";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const session = await getSession({ req });
  // if (!session) {
  //     return res.status(401).json({ message: 'Unauthorized' });
  // }
  
  const { method } = req;

  const client = await connectToDatabase();
  const db = client.db();
  const collection = db.collection("exercise");

  if (method === "POST") {
    const exercise = req.body;

    if (!exercise) {
      return res.status(422).json({ message: "Exercise is required" });
    }

    const newExercise = {
      ...exercise,
      date: new Date(),
    };

    const result = await collection.insertOne(newExercise);
    await client.close();

    return res.status(200).json({ message: "Exercise saved successfully" });
  } else if (method === "GET") {
    const exercises = await collection.find({}).toArray();
    await client.close();

    return res.status(200).json(exercises);
  } else if (method === "DELETE") {
    const id = req.query.id;

    if (!id || typeof id !== "string") {
      return res.status(422).json({ message: "ID is required" });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    await client.close();

    return res
      .status(200)
      .json(
        result.acknowledged
          ? { message: "Deleted successfully" }
          : { message: "Failed to delete item" }
      );
  } else if (method === "PATCH") {
    const id = req.query.id;
    const { exercise } = req.body;

    if (!id || typeof id !== "string") {
      return res.status(422).json({ message: "ID is required" });
    }

    if (!exercise) {
      return res.status(422).json({ message: "Exercise is required" });
    }

    const { _id, ...exerciseWithoutId } = exercise;
    const updatedItem = {
      ...exerciseWithoutId,
      date: new Date(),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedItem }
    );

    await client.close();

    return res
      .status(200)
      .json(
        result.acknowledged
          ? { message: "Updated successfully" }
          : { message: "Failed to update item" }
      );
  } else if (method === "PUT") {
    const id = req.query.id;
    const workoutId = req.query.workoutId;
    const { exercise } = req.body;

    if (!id || typeof id !== "string") {
      return res.status(422).json({ message: "ID is required" });
    }

    if (!workoutId || typeof workoutId !== "string") {
      return res.status(422).json({ message: "Workout ID is required" });
    }

    if (!exercise) {
      return res.status(422).json({ message: "Exercise is required" });
    }

    try {
      // Update exercise in exercises collection
      const { _id, ...exerciseWithoutId } = exercise;
      const updatedItem = {
        ...exerciseWithoutId,
        date: new Date(),
      };

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedItem }
      );

      if (!result.acknowledged) {
        throw new Error("Failed to update exercise");
      }

      // Update exercise in workout collection
      const workoutCollection = db.collection("workout");
      const workout = await workoutCollection.findOne({ _id: new ObjectId(workoutId) });

      if (!workout) {
        throw new Error("Workout not found");
      }

      const exercises = workout.exercises;
      const exerciseIndex = exercises.findIndex((e: any) => e._id === id);

      if (exerciseIndex === -1) {
        throw new Error("Exercise not found in workout");
      }

      exercises[exerciseIndex] = {
        ...updatedItem,
        _id: id // Preserve the string ID in the workout's exercise array
      };

      const workoutResult = await workoutCollection.updateOne(
        { _id: new ObjectId(workoutId) },
        { $set: { exercises } }
      );

      if (!workoutResult.acknowledged) {
        throw new Error("Failed to update workout");
      }

      await client.close();
      return res.status(200).json({ message: "Updated successfully" });

    } catch (error: any) {
      await client.close();
      return res.status(422).json({ message: error.message || "Update failed" });
    }
  }

  await client.close();
};

export default handler;
