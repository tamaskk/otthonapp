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

    const collection = db.collection('shopping-list');
    if (req.method === 'GET') {

        const shoppingList = await collection.find({}).toArray();
        await client.close();

        res.status(200).json(shoppingList);
        
    } else if (req.method === 'POST') {
        const body = req.body;
        const { name, quantity, quantityUnit, shop, price, note } = body;
        if (!name || !shop) {
            return res.status(422).json({ message: 'Name and shop are required' });
        }
        const newItem = {
            name,
            quantity: quantity || 1,
            quantityUnit: quantityUnit || 'db',
            shop,
            price: price || 0,
            note: note || ''
        };
        const result = await collection.insertOne(newItem);
    await client.close();

        res.status(201).json(result.acknowledged ? newItem : { message: 'Failed to add item' });
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        if (!id || typeof id !== 'string') {
            // Delete all items which has done true
            const result = await collection.deleteMany({ done: true });
            if (result.deletedCount > 0) {
                res.status(200).json({ message: 'All done items deleted successfully' });
            } else {
                res.status(404).json({ message: 'Nincs kész termék amit törölni lehet' });
            }
        } else {

            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 1) {
    await client.close();

                res.status(200).json({ message: 'Item deleted successfully' });
            } else {
    await client.close();

                res.status(404).json({ message: 'Item not found' });
            }
        }
    } else if (req.method === 'PATCH') {

        const { id } = req.query;
      
        if (!id || typeof id !== 'string') {
          return res.status(422).json({ message: 'ID is required' });
        }
      
        // Find the existing item first
        const existingItem = await collection.findOne({ _id: new ObjectId(id) });
      
        if (!existingItem) {
          return res.status(404).json({ message: 'Item not found' });
        }
      
        const newDoneValue = !existingItem.done;
      
        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { done: newDoneValue } }
        );
      
        if (result.modifiedCount === 1) {
          res.status(200).json({ message: 'Item updated successfully', done: newDoneValue });
        } else {
          res.status(500).json({ message: 'Failed to update item' });
        }
    
    await client.close();

    
    } else if (req.method === 'PUT') {
        const items = req.body;

        if (!Array.isArray(items.ingredients) || items.ingredients.length === 0) {
            return res.status(422).json({ message: 'Items array is required' });
        }

        const insertManyItems = await collection.insertMany(items.ingredients);

        if (insertManyItems.acknowledged) {
            res.status(201).json({ message: 'Items added successfully', items });
        } else {
            res.status(500).json({ message: 'Failed to add items' });
        }
    await client.close();

    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PATCH', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
    await client.close();
}

export default handler;
