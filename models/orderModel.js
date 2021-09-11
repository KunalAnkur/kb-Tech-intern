const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new Schema(
  {
    customerID: {
        type:ObjectId,
        ref: "User"
    },
    items: [{type:Object}],
    deliveryPersonID: {
        type:ObjectId,
        ref: "User"
    },
    orderStages: {
        type: String,
    },
    pickupLocation: {
        type: String
    },
  },
  { timestamps: true }
);
module.exports = Order = mongoose.model("Order", orderSchema);
