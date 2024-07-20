const mongoose = require("mongoose");

require("dotenv").config();

const conndb = () => {
  const url =process.env.MONGO_URI;
  if (mongoose.connections[0].readyState) {
    return;
  } else {
    mongoose
      .connect(url)
      .then(() => {
        console.log("connected to db");
      })
      .catch((e) => {
        console.log("error connecting to db");
      });
  }
};
module.exports = conndb;
