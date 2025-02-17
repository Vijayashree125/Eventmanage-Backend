const express = require("express");
const router = express.Router();
const adminRoute = require("../controller/adminController");

//Define API  routes
router.post("/adminRegister", adminRoute.adminRegister)
router.post("/adminLogin", adminRoute.adminLogin)
router.post("/adminLogHis/:adminId", adminRoute.adminLogHis)

//Events API routes
router.post("/addEvent", adminRoute.addEvent)
router.post("/updateEvent", adminRoute.updateEvent)
router.post("/deleteEvent", adminRoute.deleteEvent)
router.get("/getAllEvent", adminRoute.getAllEvent)
router.post("/adminLogout", adminRoute.adminLogout)
router.get("/getUserdetails",adminRoute.getUserdetails)

module.exports = router;
