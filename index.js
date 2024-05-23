const express = require("express");
const fs = require("fs");
const users = require("./Data/MOCK_DATA.json");

const app = express();
const PORT = 1010;
//MiddleWare : plugin
app.use(express.urlencoded({ extended: false }));
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
