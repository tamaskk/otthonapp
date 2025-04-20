import { connectToDatabase } from "@/db/mongo";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  const client = await connectToDatabase();
  const db = client.db();
  const collection = db.collection("done-workouts");

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

    const updatedItem = {
      ...exercise,
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
  }

  await client.close();
};

export default handler;
