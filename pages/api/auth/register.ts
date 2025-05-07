import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../db/mongo';
import bcrypt from 'bcryptjs';

type ResponseData = {
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Minden mező kitöltése kötelező' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'A jelszónak legalább 6 karakter hosszúnak kell lennie' });
    }

    const client = await connectToDatabase();
    const db = client.db();
    const collection = db.collection('users');

    // Check if user already exists
    const existingUser = await collection.findOne({ email });

    if (existingUser) {
      await client.close();
      return res.status(400).json({ message: 'Az email már foglalt' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const result = await collection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await client.close();

    return res.status(201).json({
      user: {
        id: result.insertedId.toString(),
        email,
        name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Belső szerver hiba' });
  }
} 