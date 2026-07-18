import mongoose from "mongoose";

// Cache the connection promise across invocations so repeated cold starts
// (serverless) reuse the same connection instead of opening a new one each
// time and exhausting the database's connection limit.
let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    mongoose.connection.on("connected", () =>
      console.log("Database connected"),
    );
    connectionPromise = mongoose
      .connect(`${process.env.MONGODB_URI}/AIblog`, { maxPoolSize: 10 })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

export default connectDB;
