const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { login, signup } = require("./routes/userRoutes");
const { addToCart, updateQuantity, placeOrder } = require("./routes/orderRoutes");
const { getOrders, assignDeliveryPerson, getAllDeliveryPerson } = require("./routes/adminRoute")
const { assignOrderStatus, getOrderStatus } = require("./routes/deliveryPersonRoute")
const authRoute = require("./util/authRoute");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.post("/api/signup", signup);
app.post("/api/login", login);
//creating order
app.post("/api/cart",authRoute, addToCart);
app.put("/api/quantity",authRoute, updateQuantity);
app.put("/api/placeOrder",authRoute, placeOrder);
//admin handle
app.get("/api/status/:statusFilter", authRoute, getOrders);
app.get("/api/getDeliveryPerson", authRoute, getAllDeliveryPerson);
app.put("/api/assignOrder", authRoute, assignDeliveryPerson);
//delivery person handle
app.get("/api/orderStatus", authRoute, getOrderStatus);
app.put("/api/updateStatus",authRoute, assignOrderStatus);


const PORT = process.env.PORT || 8000;
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is connect at port ${PORT}`);
      console.log("Connected to the database");
    });
  })
  .catch((e) => console.log(e));