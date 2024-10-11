const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const connectDB = require('../db');

app.use(bodyParser.json());


router.route("/").get(function(req,res){
    res.sendFile(path.join(__dirname,'../html/form.html'));
});

router.route('/').post(async function(req,res){
    const formData = req.body; 

    console.log("Received data: ", formData);

    const currentTime = new Date().toISOString(); 
    formData.creationTime = currentTime;          
    formData.lastUpdatedOn = currentTime;    

    let client; 
    try {
        const { client: mongoClient, db } = await connectDB(); 
        client = mongoClient; 
        
        const collection = db.collection('yourCollectionName'); 

        const result = await collection.insertOne(formData);

        console.log(`Data inserted with ID: ${result.insertedId}`);
        res.status(200).json({ message: 'Data saved successfully to MongoDB!' });
    } catch (err) {
        console.error('Error saving data to MongoDB:', err);
        res.status(500).json({ message: 'Failed to save data to MongoDB.' });
    } finally {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed.');
        }
    }
});

router.route('/fetch').get(async (req, res) => {
    let client;
    try {
        const connection = await connectDB(); 
        const db = connection.db; 
        client = connection.client; 

        const collection = db.collection('yourCollectionName'); 
        const documents = await collection.find({}).toArray(); 

        res.status(200).json(documents); 
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        res.status(500).json({ message: 'Failed to fetch data from MongoDB.' });
    } finally {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed.');
        }
    }
});

module.exports = router;