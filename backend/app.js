

const express = require("express");

// Initialize the express app
const app = express();

// Recognize the incoming Request Object as a JSON Object
app.use(express.json());

// method inbuilt in express to recognize the incoming Request Object as strings or arrays
app.use(express.urlencoded({ extended: true }));


app.use(require("cors")());

app.use("/user", require("./routes"));



