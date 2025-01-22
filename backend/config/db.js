const mongoose = require("mongoose");

const mongodb = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/NodeTalk", )
    .then(() => {
      console.log("Db connected!");
    })
    .catch((e) => console.log(`error ${e.message}`));
};

module.exports = mongodb;
