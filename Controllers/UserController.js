const Users = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require('http-errors')
const { authUserSchema } = require("../Middleware/validator");

const userController = {
  registerUser: async (req, res,next) => {
    try {
      const { email, password } = req.body;
      const result = await authUserSchema.validateAsync(req.body)
      const user = await Users.findOne({ email: email });
      if (user)
        return res.status(400).json({ msg: "The email is already registered" });

      //const passHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        email: email,
        password: password,
      });
      await newUser.save();

      //creating token
      const payload = { id: newUser._id };
      const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.json(token)
      res.json({ msg: "signup successfull , login now" });
    } catch (err) {
        if(err.isJoi === true) err.status = 422
       next(err)
      //return res.status(500).json({ msg: err.message });
    }
  },

  loginUser: async (req, res,next) => {
    try {
      const { email, password } = req.body;
      const result = await authUserSchema.validateAsync(req.body)
      const user = await Users.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw createError.Unauthorized('Username/password not valid')

      //create token if isMatch
      const payload = { id: user._id };
      const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.json({ token });
      res.status(200).json({msg: "Login successful"})
    } catch (err) {
      if(err.isJoi === true)
         return next(createError.BadRequest('Invalid Username/Password'))
      next(err)
      //return res.status(500).json({ msg: err.message });
    }
  },

  // verifyToken 
  verifyToken: async (req,res) => {
    try {
      const token = req.header("Authorization");
      if (!token) return res.status(400).json({ msg: "token does not exist." });;

      jwt.verify(token, process.env.TOKEN_SECRET, async (err, verified) => {
        if (err) return res.send(false);

        const user = await Users.findById(verified.id);
        if (!user) return res.send("No user");

        return res.json(token);
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

};

module.exports = userController;
