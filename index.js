const express = require("express");
const users = require("./Data/MOCK_DATA.json");

const app = express();
const PORT = 1010;

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

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(id);
  const userWithId = users.find((user) => user.id === id);
  return res.json(userWithId);
});

app.post("/api/users", (req, res) => {
  //TODO : create new user
  return res.json({ status: "Pending" });
});

app.patch("/api/users/:id", (req, res) => {
  //TODO : edit the user with id
  return res.json({ status: "Pending" });
});

app.delete("/api/users/:id", (req, res) => {
  //TODO : delete the user with id
  return res.json({ status: "Pending" });
});

app.listen(PORT, () => {
  console.log(`Server started and running on PORT : ${PORT}`);
});
