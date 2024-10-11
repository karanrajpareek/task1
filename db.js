const { MongoClient } = require('mongodb');

// MongoDB connection URI and database details
const uri = "mongodb+srv://karan:karan@karanraj.kqx3n.mongodb.net/?retryWrites=true&w=majority&appName=karanraj"; // Replace with your MongoDB Atlas URI

const connectDB = async () => {
    const client = new MongoClient(uri, {
        maxPoolSize: 200 
    });
    try {
        await client.connect();
        console.log('Connected to MongoDB successfully!');
        const db = client.db('karan'); 
        return { client, db };
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
};

module.exports = connectDB;
