//controllers have fucntion which we associates with  routes
const User = require("../models/user");
async function handleGetAllUsers(req, res) {
  const allDBuders = await User.find({});
  return res.json(allDBuders);
}

async function handleGetUsersById(req, res) {
  const user = await User.findById(req.params.id);
  if (req.params.id > User.length) {
    res.status(404).send({ msg: "Please enter valid user id" });
  }

  return res.json(user);
}

async function handleUpdateUserById(req, res) {
  const body = req.body;
  console.log(body, "body in patch");
  await User.findByIdAndUpdate(req.params.id, {
    lastName: body.last_name,
  });
  return res.status(202).json({ msg: "Success" });
}
async function handleDeleteUserById(req, res) {
  await User.findByIdAndDelete(req.params.id);
  return res.status(202).json({ msg: "Success" });
}

async function handleCreateUser(req, res) {
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
    id: result._id,
  });
}

module.exports = {
  handleGetAllUsers,
  handleGetUsersById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateUser,
};
