const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//  REGISTER

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(200).json({
        message: "User Already Exists",
        success: false,
      });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new User(req.body);
    await newuser.save();

    res.status(200).json({
      message: "User creates successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating",
      success: false,
      error,
    });
  }
});

// LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(203).json({
        message: "user does not exist",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(203).json({
        message: "Password is incorrect",
        success: false,
      });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      const options = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.status(200).cookie("token", token, options).json({
        success: true,
        message: "Login Successfully",
        user,
        token,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
