const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());


app.use("/api/v1/", require("./backend/routes/OrderRoute"));
app.use("/api/v1/token/", require("./backend/routes/TokenRoute"));
app.use("/api/v1/user/", require("./backend/routes/UserRoute"));

mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.log("Error connecting to MongoDB", error);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});