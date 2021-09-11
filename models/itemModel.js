const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    categoryName: {
        type:String
    },
    itemName: {
      type:String
    },
    locations:[{type: String}]
  },
);
module.exports = Item = mongoose.model("Item", itemSchema);