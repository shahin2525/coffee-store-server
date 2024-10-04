// const express = require('express')
//var cors = require('cors')
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import "dotenv/config";
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ax6qyiu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("coffeeDB").collection("coffee");

    app.get("/coffees", async (req, res) => {
      const result = await database.find().toArray();
      res.send(result);
    });
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await database.deleteOne(query);
      res.send(result);
    });
    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: data.name,
          quantity: data.quantity,
          supplier: data.supplier,
          taste: data.taste,
          category: data.category,
          details: data.details,
          photo: data.photo,
        },
      };
      const result = await database.updateOne(query, updateDoc, options);
      res.send(result);
    });
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await database.findOne(query);
      res.send(result);
    });

    // create coffee data
    app.post("/create-coffee", async (req, res) => {
      const data = req.body;
      const result = await database.insertOne(data);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", function (req, res) {
  res.send("hello world");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
