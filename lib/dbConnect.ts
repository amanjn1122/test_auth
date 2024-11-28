import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line
  var mongoose: any; // Declare `mongoose` globally with `any` type
}

const MONGODB_URI = process.env.DB_CONNECTION_STRING!; // Corrected MongoDB URI
const DB_DATABASE = process.env.DB_DATABASE || 'rag';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the DB_CONNECTION_STRING environment variable inside .env.local',
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<MongoClient> {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      authSource: 'admin',
      dbName: DB_DATABASE,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
