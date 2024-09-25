const express = require("express");
const userRouter = require("./user")
const satRouter = require("./satLocation")
const router = express.Router();

router.use("/satLocation",satRouter)
router.use("/user", userRouter)

module.exports = router;