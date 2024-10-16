module.exports = (io, db) => {
    const express = require('express');
    const router = express.Router();
    const path = require('path');

    // Serve the form.html file
    router.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, '../html/form.html'));
    });

    // Serve the userlist.html file
    router.get("/html/userlist", (req, res) => {
        res.sendFile(path.join(__dirname, '../html/userlist.html'));
    });

    // Handle form submission and data insertion
    router.post("/", async (req, res) => {
        const formData = {
            ...req.body,
            creationTime: new Date().toISOString(),
            lastUpdatedOn: new Date().toISOString(),
        };

        try {
            const result = await db.collection('yourCollectionName').insertOne(formData);
            io.emit('userAdded', { id: result.insertedId, ...formData });
            res.status(200).json({ message: 'Data saved successfully to MongoDB!' });
        } catch (err) {
            console.error('Error saving data to MongoDB:', err);
            res.status(500).json({ message: 'Failed to save data to MongoDB.' });
        }
    });

    // API to fetch all documents from the collection
    router.get('/fetch', async (req, res) => {
        try {
            const documents = await db.collection('yourCollectionName').find({}).toArray();
            res.status(200).json(documents);
        } catch (error) {
            console.error('Error fetching data from MongoDB:', error);
            res.status(500).json({ message: 'Failed to fetch data from MongoDB.' });
        }
    });

    // Define the fetchUsers function
    const fetchUsers = async () => {
        try {
            const users = await db.collection('yourCollectionName').find({}).toArray();
            return users;
        } catch (error) {
            throw new Error('Failed to fetch users from the database');
        }
    };

    router.get('/fetchUsers', async (req, res) => {
        try {
            const users = await fetchUsers(); // Now this will work correctly
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    return router;
};
