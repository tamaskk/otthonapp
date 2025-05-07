import { connectToDatabase } from "@/db/mongo";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { method } = req;

    const client = await connectToDatabase();
    const db = client.db();
    const collection = db.collection("workout");
    
    if (method === "POST") {
        const workout = req.body;

        if (!workout) {
            await client.close();
            return res.status(422).json({ message: "Workout is required" });
        }

        const newWorkout = {
            ...workout,
            date: new Date(),
        };

        const result = await collection.insertOne(newWorkout);
        await client.close();

        return res.status(200).json({ message: "Workout saved successfully" });
    } else if (method === "GET") {

        if (req.query.id) {

            const id = req.query.id;

            if (!id || typeof id !== "string") {
                await client.close();
                return res.status(422).json({ message: "ID is required" });
            }

            const workout = await collection.findOne({ _id: new ObjectId(id) });

            if (!workout) {
                await client.close();
                return res.status(404).json({ message: "Workout not found" });
            }

            await client.close();
            return res.status(200).json(workout);
        }

        const workouts = await collection.find({}).toArray();
        await client.close();
        return res.status(200).json(workouts);
    } else if (method === "DELETE") {
        const id = req.query.id;

        if (!id || typeof id !== "string") {
            await client.close();
            return res.status(422).json({ message: "ID is required" });
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        await client.close();

        return res.status(200).json(result.acknowledged ? { message: "Deleted successfully" } : { message: "Failed to delete item" });
    } else if (method === "PATCH") {
        const id = req.query.id;
        const { workout } = req.body;

        if (!id || typeof id !== "string") {
            await client.close();
            return res.status(422).json({ message: "ID is required" });
        }

        if (!workout) {
            await client.close();
            return res.status(422).json({ message: "Workout is required" });
        }

        const updatedItem = {
            ...workout,
            date: new Date(),
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedItem }
        );
        await client.close();

        return res.status(200).json(result.acknowledged ? { message: "Updated successfully" } : { message: "Failed to update item" });
    } else if (method === "PUT") {
        const workout = req.body;

        if (!workout) {
            await client.close();
            return res.status(422).json({ message: "Workout is required" });
        }

        if (!workout) {
            await client.close();
            return res.status(422).json({ message: "Workout is required" });
        }

        const collection = db.collection("done-workouts");

        const insertedWorkout = {
            ...workout,
            workOutId: new ObjectId(workout.workOutId as string),
        };

        const insert = await collection.insertOne(insertedWorkout)
        
        await client.close();

        return res.status(200).json(insert.acknowledged ? { message: "Saved" } : { message: "Failed to update item" });
    }

    await client.close();

}

export default handler;