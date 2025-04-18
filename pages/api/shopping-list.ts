import { connectToDatabase } from '@/db/mongo';
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
        res.status(201).json(result.acknowledged ? newItem : { message: 'Failed to add item' });
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
    client.close();
}

export default handler;
