const Order = require("../models/orderModel");
const Item = require("../models/itemModel");
exports.addToCart = (req, res) => {

    if (req.user.userType === "customer") {
      Item.findById(req.body.itemId)
        .then((foundItem) => {
          Order.findOne({ customerID: req.user._id })
            .then((order) => {
              if (order) {
                const index = order.items.findIndex(
                  (i) =>
                    i.itemName === foundItem.itemName &&
                    i.categoryName === foundItem.categoryName
                );
                let newOrder = {};
                if (index === -1) {
                  newOrder = {
                    customerID: order.customerID,
                    items: [
                      ...order.items,
                      {
                        _id: foundItem._id,
                        quantity: 1,
                        categoryName: foundItem.categoryName,
                        itemName: foundItem.itemName,
                      },
                    ],
                    deliveryPersonID: order.deliveryPersonID,
                    orderStages: order.orderStages,
                    pickupLocation: order.pickupLocation,
                  };
                } else {
                  order.items[index].quantity++;
                  newOrder = {
                    customerID: order.customerID,
                    items: order.items,
                    deliveryPersonID: order.deliveryPersonID,
                    orderStages: order.orderStages,
                    pickupLocation: order.pickupLocation,
                  };
                }
                Order.findByIdAndUpdate(order._id, newOrder, { new: true })
                  .populate("customerID", "phone userType")
                  .populate("deliveryPersonID", "phone userType")
                  .then((updatedOrder) => {
                    return res.status(201).json(updatedOrder);
                  })
                  .catch((e) => {
                    console.log(e, 1);
                    return res.status(422).json(e);
                  });
              } else {
                const randomIndex = Math.floor(
                  Math.random() * foundItem.locations.length
                );
                const newOrder = {
                  customerID: req.user._id,
                  items: [
                    {
                      _id: foundItem._id,
                      quantity: 1,
                      categoryName: foundItem.categoryName,
                      itemName: foundItem.itemName,
                    },
                  ],
                  orderStages: "In Cart",
                  pickupLocation: foundItem.locations[randomIndex],
                };
                Order.create(newOrder)
                  .then((newOrderCreated) => {
                    Order.findById(newOrderCreated._id)
                      .populate("customerID", "phone userType")
                      .populate("deliveryPersonID", "phone userType")
                      .then((foundnewOrder) => {
                        return res.status(201).json(foundnewOrder);
                      })
                      .catch((e) => {
                        console.log(e, 2);
                        return res.status(422).json(e);
                      });
                  })
                  .catch((e) => {
                    console.log(e, 3);
                    return res.status(422).json(e);
                  });
              }
            })
            .catch((e) => {
              console.log(e, 4);
              return res.status(422).json(e);
            });
        })
        .catch((e) => {
          console.log("Can't find the items");
          return res.status(422).json(e);
        });
    } else {
      return res.status(422).json({ message: "Sorry, You are not a customer" });
    }

}
exports.updateQuantity = (req, res) => {

    if (req.user.userType === "customer") {
      Item.findById(req.body.itemId)
        .then((foundItem) => {
          Order.findOne({ customerID: req.user._id })
            .then((order) => {
              const index = order.items.findIndex(
                (i) =>
                  i.itemName === foundItem.itemName &&
                  i.categoryName === foundItem.categoryName
              );
              if (index == -1)
                return res.status(422).json({ message: "item not found" });
              order.items[index].quantity += req.body.quantity;
              if (order.items[index].quantity < 1) {
                order.items.splice(index, 1);
              }
              const updateOrder = {
                customerID: order.customerID,
                items: order.items,
                deliveryPersonID: order.deliveryPersonID,
                orderStages: order.orderStages,
                pickupLocation: order.pickupLocation,
              };

              Order.findByIdAndUpdate(order._id, updateOrder, { new: true })
                .populate("customerID", "phone userType")
                .populate("deliveryPersonID", "phone userType")
                .then((updatedOrder) => {
                  return res.status(201).json(updatedOrder);
                })
                .catch((e) => {
                  console.log(e, 1);
                  return res.status(422).json(e);
                });
            })
            .catch((e) => {
              console.log(e, 4);
              return res.status(422).json(e);
            });
        })
        .catch((e) => {
          console.log("Can't find the items");
          return res.status(422).json(e);
        });
    } else {
      return res.status(422).json({ message: "Sorry, You are not a customer" });
    }
};
exports.placeOrder = (req, res) => {
    if(req.user.userType === "customer"){
        Order.findOneAndUpdate(
      { customerID: req.user._id },
      { orderStages: "Task Created" },
      { new: true }
    )
      .populate("customerID", "phone userType")
      .populate("deliveryPersonID", "phone userType")
      .then((placedOrder) => {
        return res.status(201).json(placedOrder);
      })
      .catch((e) => {
        return res.status(422).json(e);
      });
    }else{
        return res.status(422).json({message: "Sorry, You are not a customer"});
    }
    
};