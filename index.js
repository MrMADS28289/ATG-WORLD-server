const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// Middleware
const corsConfig = {
    origin: true,
    credentials: true,
}

app.use(express.json());
app.use(cors(corsConfig))
app.options('*', cors(corsConfig))

// MongoDB Connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5kp3s.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();

        const userCollection = client.db("Inventory_management_service").collection("users");

        // User info save to DB
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // get user info from DB
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const user = await userCollection.findOne(filter);
            res.send(user);
        });

        // update user info
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const profile = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: profile,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

    }
    finally {
        // client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('Inventory management system server is running in port', port);
})

app.get('/', (req, res) => {
    res.send('Hello World')
})