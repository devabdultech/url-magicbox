import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI as string);

    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`🚀 MongoDB connected on ${url}`);
  } catch (error: any) {
    console.log(`error: ${error.message}`);
    process.exit(1);
  }
};
