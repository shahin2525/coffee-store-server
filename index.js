// const express = require('express')
//var cors = require('cors')
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  res.send("hello world");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
