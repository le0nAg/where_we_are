import mongoose from "mongoose";

// URI di connessione da variabile d'ambiente
const URI: string = process.env.ATLAS_URI || "";
console.log("URI:", URI);

async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 5000, 
    });

    console.log("Successfully connected to MongoDB using Mongoose!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

connectToDatabase();

export default mongoose;
