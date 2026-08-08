import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
    try {
        // Set Node's global DNS resolver to Google DNS to bypass local SRV blocking
        dns.setServers(['8.8.8.8', '8.8.4.4']);

        mongoose.connection.on('connected', () => console.log('Database connected successfully'));
        
        // Connect to MongoDB using MONGODB_URI environment variable
        const dbUri = process.env.MONGODB_URI;
        if (!dbUri) {
            throw new Error("MONGODB_URI is not defined in the environment variables.");
        }
        await mongoose.connect(dbUri);
    } catch (error) {
        console.error("Database connection error:", error.message);
    }
}


export default connectDB;
