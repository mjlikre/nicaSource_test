const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema({
  continent: {
    type: String,
  },
  country: {
    type: String,
  },
  population: {
    type: Number,
  },
  cases: {
    type: Object,
  },
  deaths: {
    type: Object,
  },
  tests: {
    type: Object,
  },
  day: {
    type: String,
  },
  time: {
    type: String,
  },
});



const Data = mongoose.model("Data", DataSchema);

module.exports = Data;
