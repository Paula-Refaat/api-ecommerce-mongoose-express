const router = require("express").Router();
const {
  addAddress,
  getLoggedUserAddresses,
  deleteAddress,
  updateAddress,
} = require("../services/addressService ");
const authService = require("../services/authService");

router.post("/", authService.protect, authService.allowTo("user"), addAddress);

router.get(
  "/",
  authService.protect,
  authService.allowTo("user"),
  getLoggedUserAddresses
);

router.delete(
  "/:addressId",
  authService.protect,
  authService.allowTo("user"),
  deleteAddress
);

router.put(
  "/:addressId",
  authService.protect,
  authService.allowTo("user"),
  updateAddress
);

module.exports = router;
