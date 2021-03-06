const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const routes = require('./routes');
const mongoose = require("mongoose")

// Database setup
mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost:mjNicasource/mjNicasource', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });

// Middlewares setup
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes setup
app.use(routes);

const PORT = process.env.PORT || 3001;

//starting server
app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
