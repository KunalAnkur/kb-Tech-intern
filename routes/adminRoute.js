const Order = require("../models/orderModel");
const User = require("../models/userModel");
exports.getOrders = (req, res) => {
    if(req.user.userType === "owner"){
      
    Order.find({ orderStages: req.params.statusFilter })
      .populate("customerID", "phone userType")
      .populate("deliveryPersonID", "phone userType")
      .then((orders) => {
        return res.status(200).json(orders);
      })
      .catch((e) => {
        return res.status(422).json(e);
      });  
    }else{
        return res.status(422).json({message: "You are not owner"});
    }
};
exports.assignDeliveryPerson = (req, res) => {
     if (req.user.userType === "owner") {
       Order.findByIdAndUpdate(
         req.body.orderId,
         {
           deliveryPersonID: req.body.deliveryPersonID,
         },
         { new: true }
       )
         .populate("customerID", "phone userType")
         .populate("deliveryPersonID", "phone userType")
         .then((updatedOrder) => {
           return res.status(200).json(updatedOrder);
         })
         .catch((e) => {
           return res.status(422).json(e);
         });;
     } else {
       return res.status(422).json({ message: "You are not owner" });
     }
};
exports.getAllDeliveryPerson = (req,res) => {
  if(req.user.userType === "owner"){
    User.find({ userType: "deliveryPerson" }).select("-password").then(delivery => {
    return res.status(200).json(delivery);
  }).catch(e => {
    return res.status(422).json(e);
  });
  }else{
    return res.status(422).json({ message: "You are not owner" });
  }
  
}