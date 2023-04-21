const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
require("dotenv").config();
require("./config/database");

const dogRouter = require("./routes/dogs");
const userRouter = require("./routes/users");
const adoptRouter = require("./routes/adoption");
const fosterRouter = require("./routes/foster");

app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

app.use("/api/dogs", dogRouter);
app.use("/api/users", userRouter);
app.use("/api/adoption", adoptRouter);
app.use("/api/foster", fosterRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
