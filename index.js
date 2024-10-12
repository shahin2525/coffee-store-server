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
    const coffeeDB = client.db("coffeeDB").collection("coffee");
    const userDB = client.db("coffeeDB").collection("users");
    //

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userDB.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const users = await userDB.find().toArray();
      res.send(users);
    });
    app.patch("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          lastLoggedAt: user.lastLoggedAt,
        },
      };
      const result = await userDB.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userDB.deleteOne(query);
      res.send(result);
    });

    //
    app.get("/coffees", async (req, res) => {
      const result = await coffeeDB.find().toArray();
      res.send(result);
    });
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeDB.deleteOne(query);
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
      const result = await coffeeDB.updateOne(query, updateDoc, options);
      res.send(result);
    });
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeDB.findOne(query);
      res.send(result);
    });

    // create coffee data
    app.post("/create-coffee", async (req, res) => {
      const data = req.body;
      const result = await coffeeDB.insertOne(data);
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
