const express = require("express");
const cors = require("cors");
const startNotificationEngine=require('./scripts/notification_engine')
const app = express();
app.use(cors());
app.use(express.json());

const mainRouter = require("./routes/index");
startNotificationEngine
app.use("/api/v1",mainRouter);

app.listen(3456);