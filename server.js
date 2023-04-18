const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
require("dotenv").config();
require("./config/database");

app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

const dogRouter = require("./routes/dogs");
const userRouter = require("./routes/Users");

app.use("/api/dogs", dogRouter);
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
