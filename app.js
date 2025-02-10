const express = require("express");
const nodemon = require("nodemon");
const createError = require("http-errors");
const connectDB = require("./dbconnection/db");
const cors=require("cors")

require('dotenv').config(); // Load .env file

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Connect to MongoDB
connectDB();

// Use Routes
app.use("/user",require('./routes/userRoute'))
app.use("/admin",require('./routes/adminRoute'))

//testing nodejs http method
app.get("/", (req, res) => {
    res.send("Welcome To Cogniwide Solutions!");
});

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            status: err.status || 500,
            message: err.message || "Internal Server Error",
        },
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});