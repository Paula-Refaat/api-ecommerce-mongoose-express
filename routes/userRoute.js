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

const authService = require("../services/authService");

const router = require("express").Router();

router.put("/changePassword/:id", changeUserPasswordValidator, changePassword);

router.get("/", authService.protect, authService.allowTo("admin"), getUsers);
router.post(
  "/",
  authService.protect,
  authService.allowTo("admin"),
  uploadUserImage,
  resizeImage,
  createUserValidator,
  createUser
);
router.get(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  getUserValidator,
  getUser
);
router.put(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  uploadUserImage,
  resizeImage,
  updateUserValidator,
  updateUser
);
router.delete(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  deleteUserValidator,
  deleteUser
);

module.exports = router;
