import { connectToDatabase } from '@/db/mongo';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
// import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    // const session = await getSession({ req });
    // if (!session) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }
    
    const client = await connectToDatabase();
    const db = client.db();

    const collection = db.collection('recipes');
    if (req.method === 'GET') {

        const shoppingList = await collection.find({}).toArray();

        res.status(200).json(shoppingList);
        
    } else if (req.method === 'POST') {
        const body = req.body;
        const { name, types, difficulties, url, ingredients, steps, notes } = body;
        if (!name) {
            return res.status(422).json({ message: 'Name and shop are required' });
        }
        const newItem = {
            name,
            types: types || [],
            difficulties: difficulties || [],
            url: url || '',
            ingredients: ingredients || [],
            steps: steps || [],
            notes: notes || [],
        };
        const result = await collection.insertOne(newItem);
        res.status(201).json(result.acknowledged ? newItem : { message: 'Failed to add item' });
    } else if (req.method === 'DELETE') {

    } else if (req.method === 'PATCH') {
        try {

            const id = req.query.id;
            const body = req.body;
            
            const { name, types, difficulties, url, ingredients, steps, notes } = body;
            
            if (!name) {
                return res.status(422).json({ message: 'Name and shop are required' });
            }
            
            const updatedItem = {
                name,
                types: types || [],
                difficulties: difficulties || [],
                url: url || '',
                ingredients: ingredients || [],
                steps: steps || [],
                notes: notes || [],
            };
            
            const result = await collection.updateOne(
                { _id: new ObjectId(id as string) },
                { $set: updatedItem }
                );
                
                if (!result.acknowledged) {
                    return res.status(422).json({ message: result});
                }
                
                return res.status(200).json({ message: 'Item updated successfully' });
            } catch (error) {
                console.error('Error updating item:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }

    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PATCH']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
    await client.close();
}

export default handler;
