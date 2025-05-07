import { connectToDatabase } from "@/db/mongo";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const { method } = req;

  const client = await connectToDatabase();
  const db = client.db();

  const collection = db.collection("movies");

  if (method === "GET") {
    const movies = await collection.find({}).toArray();
    await client.close();

    res.status(200).json({ savedItems: movies });
  } else if (method === "POST") {
    const body = req.body;
    const { name, id, whereToWatch, poster } = body;

    if (!name) {
      return res.status(422).json({ message: "Name and shop are required" });
    }

    const findSameName = await collection.findOne({ name });

    if (findSameName) {
      return res.status(422).json({ message: "Name already exists" });
    }

    const newItem = {
      name,
      id,
      whereToWatch: whereToWatch || [],
      poster: poster || "",
      currentEpisode: 1,
      currentSeason: 1,
    };

    const result = await collection.insertOne(newItem);
    await client.close();

    res
      .status(201)
      .json(result.acknowledged ? newItem : { message: "Failed to add item" });
  } else if (method === "DELETE") {
    const{  _id } = req.body;

    if (!_id || typeof _id !== "string") {
      return res.status(422).json({ message: "ID is required" });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    await client.close();

    res
      .status(200)
      .json(
        result.acknowledged
          ? { message: "Deleted successfully" }
          : { message: "Failed to delete item" }
      );
  } else if (method === "PATCH") {
    const { _id, currentEpisode, currentSeason } = req.body;

    if (!_id || typeof _id !== "string") {
      return res.status(422).json({ message: "ID is required" });
    }

    if (!currentEpisode && !currentSeason) {
      return res
        .status(422)
        .json({ message: "Current episode or season is required" });
    }

    const updatedItem = {
      currentEpisode: currentEpisode || 0,
      currentSeason: currentSeason || 0,
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updatedItem }
    );

    if (!result.acknowledged) {
      return res.status(422).json({ message: result });
    }

    const updatedItemFromDb = await collection.findOne({
      _id: new ObjectId(_id),
    });
    if (!updatedItemFromDb) {
      return res.status(422).json({ message: "Failed to update item" });
    }
    await client.close();

    res.status(200).json(updatedItemFromDb);
  }

  await client.close();

};

export default handler;
