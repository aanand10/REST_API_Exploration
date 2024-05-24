const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const users = require("./Data/MOCK_DATA.json");

const app = express();
const PORT = 1010;
//connecting mongo

// Connection string with optional Mongoose options
const connectionString = "mongodb://localhost:27017/rest-app-test";

mongoose
  .connect(connectionString)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

//MiddleWare : here are a functions which
app.use(express.urlencoded({ extended: false }));

// middleware have access of request object , res object , next middleware function
app.use((req, res, next) => {
  console.log("Hello from the middleware 1");
  //   return res.end("Hello from middleware 2"); // this reurns and ends the req cycle before forwarding it to next middleware or next avaliable functions
  next(); // this sends to the next middleware or next fucntion in the stack , if we dont use this the request won't be forwarded it will hang up in between
});

app.use((req, res, next) => {
  req.name = "Anand"; // as using middleware we can manupulate the req data , that data will get avaliable to the next middlewares and the functions
  //like we can first authenticate the user and then we can forward it or the important data of its get sent to the next of the functions if that user is not valid we can end that request
  next();
});

app.use((req, res, next) => {
  fs.appendFile(
    "./Data/log.txt",
    `${Date.now()} : ${req.method} : ${req.path} \n`,
    (err, data) => {}
  );
  next();
});
// routes

app.get("/users", async (req, res) => {
  /**
   * we will return HTML so the structure will be like
   * <ul> <li> ${username} </li></ul>
   */
  const allDBUsers = await User.find({});
  const HTML = `
  <ul>  
${allDBUsers
  .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
  .join("")}
  </ul>
  `;
  return res.send(HTML);
});

app.get("/api/users", async (req, res) => {
  const allDBuders = await User.find({});
  return res.json(allDBuders);
});

// grouping the same route requests
app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (req.params.id > User.length) {
      res.status(404).send({ msg: "Please enter valid user id" });
    }

    return res.json(user);
  })
  .patch(async (req, res) => {
    //TODO : edit the user with id
    const body = req.body;
    console.log(body, "body in patch");
    await User.findByIdAndUpdate(req.params.id, {
      lastName: body.last_name,
    });
    return res.status(202).json({ msg: "Success" });
  })
  .delete(async (req, res) => {
    //TODO : delete the user with id

    await User.findByIdAndDelete(req.params.id);
    return res.status(202).json({ msg: "Success" });
  });

app.post("/api/users", async (req, res) => {
  //TODO : create new user
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.job_title ||
    !body.email ||
    !body.gender
  ) {
    res.status(400).send({ msg: "please enter full data" });
  }
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });
  console.log(result, "result");
  return res.status(201).json({
    msg: "success",
  });
  // console.log("REQ Body", body);

  // users.push({
  //   id: users.length + 1,
  //   ...body,
  // });

  // fs.writeFile("./Data/MOCK_DATA.json", JSON.stringify(users), (err, data) => {
  //   return res.status(201).json({ status: "Success", id: users.length });
  // });
});

app.listen(PORT, () => {
  console.log(`Server started and running on PORT : ${PORT}`);
});
