import mongoose from "mongoose";
import dns from "dns";

// Fix querySrv ECONNREFUSED issues on Windows/ISP DNS resolvers
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch {
  // Ignore if custom DNS is not supported in current environment
}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is missing in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: "multi-shop",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;