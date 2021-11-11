const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jo0ws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('theToyShop')
        const productCollection = database.collection("products");
        const usersCollection = database.collection('users')
        console.log('database connected successfully');

        //get all Product
        app.get('/addProduct', async (req, res) => {
            const result = await productCollection.find({}).toArray();
            res.json(result)
        })

        //add Product
        app.post("/addProduct", async (req, res) => {
            // console.log(req.body)
            const result = await productCollection.insertOne(req.body);
            // console.log(result);
            res.send(result)
        })

        /*  app.get('/appointments', async (req, res) => {
             const email = req.query.email;
             const date = req.query.date;
             console.log(date, email)
 
             const query = { email: email, date: date }
 
             const cursor = appointmentCollection.find(query);
             const appointments = await cursor.toArray();
             res.json(appointments);
         })
 
         app.post('/appointments', async (req, res) => {
             const appointment = req.body;
             const result = await appointmentCollection.insertOne(appointment)
             // console.log(appointment)
             res.json(result)
 
         }) */

        //check that if email is admin or not 
        /*  app.get('/users/:email', async (req, res) => {
             const email = req.params.email;
             const query = { email: email };
             const user = await usersCollection.findOne(query);
             let isAdmin = false;
             if (user?.role === 'admin') {
                 isAdmin = true;
             }
             res.json({ admin: isAdmin });
         }) */

        // add users data separately in a new collection
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            console.log(result)
            res.json(result)

        })

        //filtered the data if user exist or not, exist then not added again, not exist then add user to db
        app.put('/users', async (req, res) => {
            const user = req.body;
            console.log("put", user)
            const filter = { email: user.email }
            const options = { upsert: true };
            const updateDoc = { $set: user }
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.json(result)

        })

        // update  the value of make an admin field 
        /*   app.put('/users/admin', verifyToken, async (req, res) => {
              const user = req.body;
              const requester = req.decodedEmail;
              if (requester) {
                  const requesterAccount = await usersCollection.findOne({ email: requester });
                  if (requesterAccount.role === 'admin') {
                      const filter = { email: user.email };
                      const updateDoc = { $set: { role: 'admin' } };
                      const result = await usersCollection.updateOne(filter, updateDoc);
                      res.json(result);
                  }
              }
              else {
                  res.status(403).json({ message: 'you do not have access to make admin' })
              }
          }) */
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Doctors portal!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})


