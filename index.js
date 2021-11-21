const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
var cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jy11d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        
        
    const database = client.db("tourism_services");
    const servicesCollection = database.collection("services");
    const ordersCollection = database.collection("all_orders");
    
    // get api 
    app.get('/services',async(req,res)=>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services)

    });
    //  get single service api 
    app.get('/services/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id:ObjectId(id) };
        const service = await servicesCollection.findOne(query);
        res.json(service);

    })

    // post api 
    app.post('/services',async(req,res)=>{
        const service = req.body;
        const result =await servicesCollection.insertOne(service);
        res.json(result)
    })
    
    // manage all oreder api  

    app.post('/orders', async (req, res) => {
        const order = req.body;
        const result = await ordersCollection.insertOne(order);
        res.send(result);

    })
    //Get Orders API
    app.get('/orders', async (req, res) => {
        const cursor = ordersCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
    })
    
    // get my order 
   app.get('/myOrder/:email',async(req,res)=>{
       const email = req.params.email;
       const result = await ordersCollection.find({email}).toArray();
      res.send(result)
   })
//    delete api 
    app.delete('/deleteOrder/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id:ObjectId(id) };
        const result = await ordersCollection.deleteOne(query);
        res.json(result)
    })

    }
    finally{
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Tourisom related server is running')
})

app.listen(port, () => {
  console.log('Running tourism related server',port)
})