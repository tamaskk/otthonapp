import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../db/mongo';
import bcrypt from 'bcryptjs';

type ResponseData = {
  exists: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ exists: false, message: 'Method not allowed' });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ exists: false, message: 'Password is required' });
    }

    const client = await connectToDatabase();
    const db = client.db('otthonApp');
    const collection = db.collection('users');

    // Get all users
    const users = await collection.find({}).toArray();

    // Check if any user has matching password
    for (const user of users) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        await client.close();
        return res.status(200).json({ exists: true });
      }
    }

    await client.close();
    return res.status(200).json({ exists: false });

  } catch (error) {
    console.error('Password verification error:', error);
    return res.status(500).json({ exists: false, message: 'Internal server error' });
  }
}