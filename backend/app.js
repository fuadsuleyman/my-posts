const express = require('express');
const mongoose = require('mongoose');

// this below we need for post requests
const bodyParser = require('body-parser');

const app = express();

const postsRoutes = require('./routes/posts');

mongoose.connect('mongodb+srv://fuads:BPW0e9uiXGyybg4J@cluster0.3poas.mongodb.net/mean-posts?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
  console.log('Connected to database!');
})
.catch(()=>{
  console.log('Connection failed!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
  next();
})

app.use("/api/posts", postsRoutes);

module.exports = app;
