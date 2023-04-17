const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
require("./config/database");

const dogRouter = require("./routes/dogs.tsx");

app.use("/api/dogs", dogRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
