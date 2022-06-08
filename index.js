const express = require("express");
const userRouter = require("./Routes/userRoutes");
const contactRouter = require("./Routes/contactRoutes");
const createError = require('http-errors');
require("dotenv").config();

const app = express();

//middleware
app.use(express.static("public"));
app.use(express.json());

//Routes
app.use("/users", userRouter);
app.use("/api/contacts", contactRouter);

//Errors Handling
app.use((req,res,next) => {
    next(createError(404,"Not Found"))
});

app.use((err,req,res,next) => {
    res.status(err.status || 500);
    res.send({
        error : {
            status: err.status || 500,
            message : err.message
        }
    })
})

// Initialize DB
require('./db')();

//listen server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("server running at", PORT);
});
