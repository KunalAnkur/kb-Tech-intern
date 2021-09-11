

const Order = require("../models/orderModel");
exports.getOrderStatus = (req, res) => {
    if(req.user.userType === "deliveryPerson"){
        Order.find({ deliveryPersonID: req.user._id })
          .populate("customerID", "phone userType")
          .populate("deliveryPersonID", "phone userType")
          .then((orders) => {
            return res.status(200).json(orders);
          }).catch(e => {
              return res.status(422).json(e);
          });
    }else {
        return res.status(422).json({message: "You are not delivery person"})
    }
};
exports.assignOrderStatus = (req, res) => {
    if (req.user.userType === "deliveryPerson") {
      Order.findByIdAndUpdate(req.body.orderId, {orderStages: req.body.status},{new:true})
        .populate("customerID", "phone userType")
        .populate("deliveryPersonID", "phone userType")
        .then((order) => {
          return res.status(200).json(order);
        })
        .catch((e) => {
          return res.status(422).json(e);
        });
    } else {
      return res.status(422).json({ message: "You are not delivery person" });
    }
};