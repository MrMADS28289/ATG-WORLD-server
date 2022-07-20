const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const postCollection = client.db("Inventory_management_service").collection("posts");
        const commentCollection = client.db("Inventory_management_service").collection("comments");

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

        // login
        app.get('/users/:userName', async (req, res) => {
            const userName = req.params.userName;
            const filter = { userName: userName };
            const user = await userCollection.findOne(filter);
            res.send(user);
        });

        // Reset password
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const password = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: password,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        // Create post
        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        });

        // Add link
        app.put('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const liked = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: liked,
            };
            const result = await postCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        // Add Comment
        app.post('/comment', async (req, res) => {
            const comment = req.body;
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        });

        // get posts
        app.get('/posts', async (req, res) => {
            const cursor = postCollection.find({});
            const posts = await cursor.toArray();
            res.send(posts);
        })

        // get comments
        app.get('/comments/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { id: id };
            const cursor = commentCollection.find(filter);
            const comments = await cursor.toArray();
            res.send(comments);
        })


    }
    finally {
        // client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('ATG server is running in port', port);
})

app.get('/', (req, res) => {
    res.send('Hello World')
})