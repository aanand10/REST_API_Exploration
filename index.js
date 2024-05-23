const express = require("express");
const fs = require("fs");
const users = require("./Data/MOCK_DATA.json");

const app = express();
const PORT = 1010;
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

app.get("/users", (req, res) => {
  /**
   * we will return HTML so the structure will be like
   * <ul> <li> ${username} </li></ul>
   */
  const HTML = `
  <ul>  
${users.map((user) => `<li>${user.first_name}</li>`).join("")}
  </ul>
  `;
  return res.send(HTML);
});

app.get("/api/users", (req, res) => {
  return res.json(users);
});

// grouping the same route requests
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    console.log(id);
    const userWithId = users.find((user) => user.id === id);
    return res.json(userWithId);
  })
  .patch((req, res) => {
    //TODO : edit the user with id
    const id = Number(req.params.id);
    const getUserData = users.find((user) => user.id === id);
    console.log(getUserData);
    const getUserIndex = users.findIndex((user) => user.id === id);
    console.log(getUserIndex);
    const body = req.body;
    users.splice(getUserIndex, 1, { id: id, ...body });
    fs.writeFile("/Data/MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({
        status: "Success",
        id: id,
      });
    });
  })
  .delete((req, res) => {
    //TODO : delete the user with id
    const id = Number(req.params.id);
    const getUserIndex = users.findIndex((user) => user.id === id);
    console.log(getUserIndex);
    users.splice(getUserIndex, 1);
    fs.writeFile("/Data/MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({
        status: "Success!",
        id: id,
      });
    });
  });

app.post("/api/users", (req, res) => {
  //TODO : create new user
  const body = req.body;
  console.log("REQ Body", body);

  users.push({
    id: users.length + 1,
    ...body,
  });

  fs.writeFile("./Data/MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "Success", id: users.length });
  });
});

app.listen(PORT, () => {
  console.log(`Server started and running on PORT : ${PORT}`);
});
