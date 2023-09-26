const express = require("express")
const router = express.Router()
const {getAllUsers,
getSingleUser,
showCurrentUser,
updateUser,
updateUserPassword}= require("../controllers/userController")

const{auth, authorizePermissions}= require("../middleware/auth")

router.route("/").get(auth, authorizePermissions("admin"), getAllUsers)
router.route("/showMe").get(auth, showCurrentUser)
router.route("/updateUser").patch(auth, updateUser)
router.route("/updateUserPass").patch(auth, updateUserPassword)
router.route("/:id").get(auth, getSingleUser)

module.exports = router