const express = require("express")
const router = express.Router()
const {
    createReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview,
    getProductReview
}= require("../controllers/reviewController")


const{auth, authorizePermissions}= require("../middleware/auth")



router.route("/").post(auth, createReview).get(getAllReviews)
router
.route("/:id")
.get(getReview)
.patch(auth,  updateReview)
.delete(auth, deleteReview)

router.route("/product/:id").get(auth, getProductReview)




module.exports = router