const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4500;

//middleware
app.use(cors());
app.use(express.json());

//mongocode
// 
// 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xx7c7ta.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const problemCollection = client.db('cardioCare').collection('cardioProblems');
        const appointmentCollection = client.db('cardioCare').collection('appointments');

        app.get('/problems', async(req, res) =>{
            const cursor = problemCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // appointments data
        app.post('/appointments', async(req, res)=>{
            const appointment = req.body;
            console.log(appointment);
            const result = await appointmentCollection.insertOne(appointment);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


//mongocode

app.get('/', (req, res) => {
    res.send('Heart is beating!')
})

app.listen(port, () => {
    console.log(`Heart is pumping blood on port ${port}`);
})

