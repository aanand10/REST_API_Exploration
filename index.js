const express = require("express");
const { connectMongoDb } = require("./connection");
const userRouter = require("./routes/user");
const { logReqRes } = require("./middlewares/index");

const app = express();
const PORT = 1010;

//connecting mongo
connectMongoDb("mongodb://localhost:27017/rest-app-test");

//MiddleWare : here are a functions which
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));

// routes
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server started and running on PORT : ${PORT}`);
});
