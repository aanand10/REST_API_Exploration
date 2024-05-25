const mongoose = require("mongoose");

const connectMongoDb = async (url) =>
  mongoose
    .connect(url)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("Mongo error:", err));

module.exports = {
  connectMongoDb,
};
