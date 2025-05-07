import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../db/mongo';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../lib/jwt';

type ResponseData = {
  message?: string;
  token?: string;
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email és jelszó megadása kötelező' });
    }

    const client = await connectToDatabase();
    const db = client.db('otthonApp');
    const collection = db.collection('users');

    const user = await collection.findOne({ email });

    if (!user) {
      await client.close();
      return res.status(401).json({ message: 'Érvénytelen Email vagy jelszó' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      await client.close();
      return res.status(401).json({ message: 'Érvénytelen email vagy jelszó' });
    }

    const token = generateToken({ userId: user._id.toString() });

    await client.close();

    return res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Belső szerver hiba' });
  }
} 