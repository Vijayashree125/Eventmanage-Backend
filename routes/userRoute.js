const express = require("express");
const router = express.Router();
const userRoute = require("../controller/userController");
const JwtToken = require("../helpers/tokenVerify")

//Define API  routes
router.post("/createAccount", userRoute.userRegister)
router.post("/verifyToken/:otp", userRoute.verifyToken)
router.post("/userLogin", userRoute.userLogin)
router.post("/userLogHis", userRoute.userLogHis)
// router.get("/dashboard", JwtToken.verifyAuthToken, userRoute.dashboard)
router.get("/upcomingEvent", userRoute.upcomingEvent)
router.post("/eventRegister", userRoute.eventRegister)
router.post("/getRegisterUser", userRoute.getRegisterUser)
router.post("/userLogout", userRoute.userLogout)

module.exports = router;
