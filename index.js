const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // collections 
        const problemCollection = client.db('cardioCare').collection('cardioProblems');
        const appointmentCollection = client.db('cardioCare').collection('appointments');
        const doctorCollection = client.db('cardioCare').collection('doctors');
        const userCollection = client.db('cardioCare').collection('users');
        // users api secret and admin only
        app.post('/users', async(req, res)=>{
            const user = req.body;
            const query = {email: user.email};
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({message: 'user already exists!'})
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })
        // doctors api
        app.post('/doctors', async(req, res)=>{
            const doctor = req.body;
            console.log(doctor);
            const result = await doctorCollection.insertOne(doctor);
            res.send(result);
        })
        app.get('/doctors', async(req, res)=>{
            const cursor = doctorCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.delete('/doctors/delete/:id', async(req, res)=>{
            const result = await doctorCollection.deleteOne({_id : new ObjectId (req.params.id)});
            res.send(result);
        })
        app.get('/doctors/:id', async(req, res)=>{
            const result = await doctorCollection.findOne({_id: new ObjectId(req.params.id)})
            res.send(result);
        })
        app.put('/doctors/update-doctor/:id', async(req, res)=>{
            const id = req.params.id;
            const body = req.body;
            const option = {
                upsert: true,
            }
            const query = {_id : new ObjectId(id)};
            const doctorData = {
                $set: {
                    name: body.name,
                    email: body.email,
                    phone: body.phone,
                    docId: body.docId,
                    photoUrl: body.photoUrl,
                    speciality: body.speciality,
                    location: body.location,
                    linkedIn: body.linkedIn,
                }
            }
            const result = await doctorCollection.updateOne(
                query, 
                doctorData, 
                option
                )
            res.send(result);


        })

        // problems data
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

        app.get('/appointments', async(req, res) =>{
            const cursor = appointmentCollection.find();
            const result = await cursor.toArray();
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

