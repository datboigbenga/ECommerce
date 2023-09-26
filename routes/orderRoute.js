const express = require("express")
const router = express.Router()
const {
    createOrder,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    updateOrder
}= require("../controllers/orderController")


const{auth, authorizePermissions}= require("../middleware/auth")



router.route("/").post(auth, createOrder).get(auth, authorizePermissions("admin"), getAllOrders)

router.route('/showAllMyOrders').get(auth, getCurrentUserOrders);

router
.route("/:id")
.get(auth,  getSingleOrder)
.patch(auth,  updateOrder)






module.exports = router