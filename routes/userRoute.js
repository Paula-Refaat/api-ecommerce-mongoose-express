const {
  getUser,
  createUser,
  uploadUserImage,
  resizeImage,
  getUsers,
  updateUser,
  deleteUser,
  changePassword,
} = require("../services/userService");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");

const router = require("express").Router();

router.put("/changePassword/:id", changeUserPasswordValidator, changePassword);

router.get("/", getUsers);
router.post("/", uploadUserImage, resizeImage, createUserValidator, createUser);
router.get("/:id", getUserValidator, getUser);
router.put(
  "/:id",
  uploadUserImage,
  resizeImage,
  updateUserValidator,
  updateUser
);
router.delete("/:id", deleteUserValidator, deleteUser);

module.exports = router;
