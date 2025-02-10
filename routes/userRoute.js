const express = require("express");
const router = express.Router();
const userRoute = require("../controller/userController");
const JwtToken = require("../helpers/tokenVerify")

//Define API  routes
router.post("/createAccount", userRoute.userRegister)
// router.post("/verifyToken/:otp",JwtToken.verifyAuthToken,  userRoute.verifyToken)
router.post("/userLogin", userRoute.userLogin)
router.post("/userLogHis/:userId", userRoute.userLogHis)
router.get("/getUserdetails/:id",userRoute.getUserdetails)
router.get("/getDisplayRegister/:title",userRoute.getDisplayRegister)
router.get("/upcomingEvent",userRoute.upcomingEvent)
router.post("/eventRegister",userRoute.eventRegister)
router.post("/getRegisterUser/:userId", userRoute.getRegisterUser)
router.post("/userLogout", userRoute.userLogout)

module.exports = router;
