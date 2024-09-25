const express = require("express");
const zod = require("zod");
const {User} = require("../root/db");
const JWT_SECRET = require('../config');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { authMiddleware } = require ("../middleware/middleware");

const signupSchema = zod.object({
    username : zod.string(),
    password : zod.string(),
    firstName : zod.string(),
    lastName : zod.string()
});

router.post("/signup", async (req, res) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(req.body);
  
    if (!success) {
      return res.json({
        message: "Invalid input provided.",
      });
    }
  
    try {

      const user = await User.findOne({
        username: body.username,
      });
  
      if (user) {
        return res.json({
          message: "Username already taken.",
        });
      }
  
     
      const dbUser = await User.create(body);
      const userId = dbUser._id;
  
      const token = jwt.sign(
        {
          userId: dbUser._id,
        },
        JWT_SECRET
      );
  
      res.json({
        message: "User created successfully.",
        token: token,
      });
    } catch (error) {
      console.error(error); 
      res.status(500).json({
        message: "Internal server error.",
      });
    }
  });
  

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
  });
  
  router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
      res.status(411).json({
        message: "Error While Updating Information",
      });
    }
    await User.updateOne(req.body, {
      id: req.userId,
    });
    res.json({
      message: "Updated Successfully",
    });
  });
  
  router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
  
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });
    res.json({
      user: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user.id,
      })),
    });
  });
  
  module.exports = router;