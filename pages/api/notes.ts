import { connectToDatabase } from "@/db/mongo";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

interface Comment {
  text: string;
  author: string;
  createdAt: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const session = await getSession({ req });
  // if (!session) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  
  const { method } = req;

  const client = await connectToDatabase();
  const db = client.db();
  const collection = db.collection("notes");

  if (method === "GET") {
    const notes = await collection.find({}).toArray();
    await client.close();
    res.status(200).json(notes);
  } else if (method === "POST") {
    const body = req.body;
    const { content, author } = body;

    if (!content) {
      return res.status(422).json({ message: "Note content is required" });
    }

    const newNote = {
      content,
      comments: [],
      author,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newNote);
    await client.close();

    res.status(201).json(result.acknowledged ? newNote : { message: "Failed to add note" });
  } else if (method === "DELETE") {
    const id = req.query.id;

    if (!id || typeof id !== "string") {
      return res.status(422).json({ message: "ID is required" });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    await client.close();

    res.status(200).json(
      result.acknowledged
        ? { message: "Deleted successfully" }
        : { message: "Failed to delete note" }
    );
  } else if (method === "PATCH") {
    const id = req.query.id;
    const body = req.body;
    const { content, comment } = body;

    if (!id || typeof id !== "string") {
      return res.status(422).json({ message: "ID is required" });
    }

    if (!content && !comment) {
      return res.status(422).json({ message: "Content or comment is required" });
    }

    let updateOperation: any = {};
    
    if (content) {
      updateOperation.$set = { content };
    }
    
    if (comment) {
      updateOperation.$push = {
        comments: {
          $each: [comment],
          $sort: { createdAt: -1 }
        }
      };
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      updateOperation
    );
    await client.close();

    res.status(200).json(
      result.acknowledged ? { message: "Updated successfully" } : { message: "Failed to update note" }
    );
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE", "PATCH"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  await client.close();
};

export default handler; 