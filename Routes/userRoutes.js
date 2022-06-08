const { registerUser, loginUser, verifyToken } = require("../Controllers/userController");
const router = require("express").Router();

//Register User
router.post("/register", registerUser);

//Login User
router.post("/login", loginUser);

//verify token
router.get("/verifytoken",verifyToken)

module.exports = router;
