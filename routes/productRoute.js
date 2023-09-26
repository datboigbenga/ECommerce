const express = require("express")
const router = express.Router()
const {
    createProduct,
    getAllProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}= require("../controllers/productController")

const{getProductReview} = require("../controllers/reviewController")



const{auth, authorizePermissions}= require("../middleware/auth")



router.route("/").post(auth, authorizePermissions("admin"), createProduct).get(getAllProduct)

router
.route("/uploadImage").post(auth, authorizePermissions("admin"), uploadImage)

router
.route("/:id")
.get(getProduct)
.patch(auth, authorizePermissions("admin"), updateProduct)
.delete(auth, authorizePermissions("admin"), deleteProduct)

router.route('/:id/reviews').get(getProductReview);


module.exports = router