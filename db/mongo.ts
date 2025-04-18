import { MongoClient } from "mongodb";

  export const connectToDatabase = async () => {
    const client = await MongoClient.connect(
      `mongodb+srv://dbUser:t6S7CeQhHQgSg12F@otthonapp.9bwxw8r.mongodb.net/otthonApp?retryWrites=true&w=majority&appName=otthonapp`,
      );
    return client;
  };