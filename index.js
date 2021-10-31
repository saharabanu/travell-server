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
    const ordersCollection = database.collection("my_orders");
    
    // get api 
    app.get('/services',async(req,res)=>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services)

    });
    //  get single service api 
    app.get('/services/:id',async(req,res)=>{
        const id = req.params.id;
        console.log('single service data ',id);
        const query = { _id:ObjectId(id) };
        const service = await servicesCollection.findOne(query);
        res.json(service);

    })

    // post api 
    app.post('/services',async(req,res)=>{
        const service = req.body;
        console.log('hit the post api',service)
       
        const result =await servicesCollection.insertOne(service);
        // console.log(result)
        res.json(result)
    })
    // add orders api 
    app.post('/addOrder',async(req,res)=>{
        const order = req.body;
        
        const result = await ordersCollection.insertOne(order)
       
        res.send(result)
        
        
    })
    // manage all oreder api  
    
    // get my order 
   app.get('/myOrder/:email',async(req,res)=>{
       const email = req.params.email;
       
       const result = await ordersCollection.find({email}).toArray();
      res.send(result)
   })
//    delete api 
    app.delete('/myOrder/:id',async(req,res)=>{
        const id = req.params.id;
        console.log('hittinf',id)
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