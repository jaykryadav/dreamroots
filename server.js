const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

const port = process.env.PORT || 8000;

app.use(express.json());

app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.listen(port, () => {
  console.log("Server is running on PORT:", port);
});
