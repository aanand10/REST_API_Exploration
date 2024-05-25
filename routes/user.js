const express = require("express");
const {
  handleGetAllUsers,
  handleGetUsersById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateUser,
} = require("../controllers/user");

const router = express.Router();

router.route("/").get(handleGetAllUsers).post(handleCreateUser);

// grouping the same route requests
router
  .route("/:id")
  .get(handleGetUsersById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
