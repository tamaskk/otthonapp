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
  const collection = db.collection("finance");

  if (method === "GET") {
    const finance = await collection.find({}).toArray();
    await client.close();

    res.status(200).json(finance);
  } else if (method === "POST") {
    const body = req.body;
    const { name, amount, date, type } = body;

    if (!name || !amount) {
      return res.status(422).json({ message: "All fields are required" });
    }

    const newItem = {
      name,
      amount,
      date,
      type,
    };

    const result = await collection.insertOne(newItem);
    await client.close();

    res
      .status(201)
      .json(result.acknowledged ? newItem : { message: "Failed to add item" });
  } else if (method === "DELETE") {
    const id = req.query.id;

    if (!id || typeof id !== "string") {
      return res.status(422).json({ message: "ID is required" });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    await client.close();

    res
      .status(200)
      .json(
        result.acknowledged
          ? { message: "Deleted successfully" }
          : { message: "Failed to delete item" }
      );
  } else if (method === "PATCH") {
    const id = req.query.id;
    const body = req.body;
    const { name, amount, date, type } = body;

    if (!id || typeof id !== "string") {
      return res.status(422).json({ message: "ID is required" });
    }

    if (!name || !amount) {
      return res.status(422).json({ message: "All fields are required" });
    }

    const updatedItem = {
      name,
      amount,
      date,
      type,
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedItem }
    );
    await client.close();

    res
      .status(200)
      .json(
        result.acknowledged ? updatedItem : { message: "Failed to update item" }
      );
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE", "PATCH"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  await client.close();
};

export default handler;
