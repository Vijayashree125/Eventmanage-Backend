const adminModel = require("../models/admin")
const adminActivityModel = require("../models/adminactivity")
const eventModel = require("../models/events")
const userModel=require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const moment = require("moment")
const details = require("../common");

//create Admin account
module.exports.adminRegister = async (req, res) => {
    var adminInfo = req.body
    var insertData = {}
    insertData.name = "Admin"
    insertData.email = adminInfo.email
    insertData.password = await bcrypt.hash(adminInfo.password, 10)
    await adminModel.findOne({ email: adminInfo.email }).then(async (finddata) => {
        if (finddata != undefined || finddata != null) {
            res.json({
                status: false,
                message: "Admin Account Already Exits"
            })
        }
        else if (finddata == undefined || finddata == null) {
            await adminModel.create(insertData).then(async (createAdmin) => {
                if (createAdmin) {
                    res.json({
                        status: true,
                        message: "Admin Account Created Successfully"
                    })
                }
                else {
                    res.json({
                        status: false,
                        message: "Admin Account Created Error"
                    })
                }
            })
        }
        else {
            res.json({
                status: false,
                message: "Something went wrong!!"
            })
        }
    })
}

//admin login 
module.exports.adminLogin = async (req, res) => {
    const { email, password } = req.body
    await adminModel.findOne({ email: email }).then(async (admindata) => {
        if (admindata != null) {
            var comparePassword = await bcrypt.compare(password, admindata.password);
            var jwtToken = jwt.sign({ email }, details.data.JWT_SECRET, { expiresIn: "1h" })
            if (comparePassword) {
                await adminActivityModel.create({
                    adminId: admindata._id,
                    type: "adminLogin",
                    ip: req.ip
                })
                await adminModel.updateOne({ _id: req.body.adminid }, { $set: { loginStatus: "Inactive" } })
                res.json({
                    status: true,
                    message: "Login Successfully",
                    data: { authToken: jwtToken, adminId: admindata._id }
                })
            }
            else {
                res.json({
                    status: false,
                    message: "Invalid Credentials",
                    data: null
                })
            }
        }
        else {
            res.json({
                status: false,
                message: "Invalid Email Address"
            })
        }
    })
}

//Get Admin Login History
module.exports.adminLogHis = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalUsers = await adminActivityModel.countDocuments();

    await adminActivityModel.find({ adminId: req.params.adminId }).sort({ dateTime: -1 }).skip(skip).limit(limit).then((logdata) => {
        if (logdata.length > 0) {
            res.json({
                status: true,
                message: "Get Login History",
                data: logdata,
                totalCount: totalUsers,

            })
        }
        else {
            res.json({
                status: false,
                message: "No data found",
                data: [],
                totalCount: 0,

            })
        }
    })
}

//create new events

module.exports.addEvent = async (req, res) => {
    var eventDetails = req.body
    var saveEvent = {
        title: eventDetails.title,
        description: eventDetails.description,
        date: new Date(eventDetails.date),
        location: eventDetails.location
    }
    const existEvent = await eventModel.findOne({ title: eventDetails.title })
    if (!existEvent) {
        eventModel.create(saveEvent).then(async (createEvent) => {
            if (createEvent) {
                res.json({
                    status: true,
                    message: "Event Created Successfully"
                })
            }
            else {
                res.json({
                    status: false,
                    message: "Event Creation Failed"
                })
            }
        })
    } else {
        res.json({
            status: false,
            message: "Event is already exists"
        })
    }
}

//Edit events

module.exports.updateEvent = async (req, res) => {
    var eventDetails = req.body
    var updateEvent = {
        description: eventDetails.description,
        date: new Date(eventDetails.date),
        location: eventDetails.location,
    }
    console.log(updateEvent,'===================================');
    
    await eventModel.updateOne({ title: req.body.title }, { $set: updateEvent }).then(async (updatedata) => {
        console.log(updatedata,'Updatedataaaa')
        if (updatedata.modifiedCount == 1) {
            res.json({
                status: true,
                message: "Event Details Updated Successfully"
            })
        }
        else {
            res.json({
                status: false,
                message: "Event Details Not Updated"
            })
        }
    })
}

//delete events

module.exports.deleteEvent = async (req, res) => {
    var eventDetails = req.body
    await eventModel.deleteOne({ title: eventDetails.title }).then(async (deleteEvent) => {
        if (deleteEvent.deletedCount == 1) {
            res.json({
                status: true,
                message: "Event deleted Successfully"
            })
        }
        else {
            res.json({
                status: false,
                message: "Event deleted Failed"
            })
        }
    })
}

//get all events

module.exports.getAllEvent = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    console.log('page', page)
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalUsers = await eventModel.countDocuments();
    await eventModel.find({}).sort({ _id: -1 }).skip(skip).limit(limit).then(async (getEvents) => {
        if (getEvents.length > 0) {
            res.json({
                status: true,
                message: "Get Event Details",
                data: getEvents,
                totalCount: totalUsers
            })
        }
        else {
            res.json({
                status: false,
                message: "No Data Found",
                data: [],
                totalCount: 0
            })
        }
    })
}

//get user details
module.exports.getUserdetails = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    console.log('page', page)
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalUsers = await eventModel.countDocuments();
    await userModel.find({ }).sort({ _id: -1 }).skip(skip).limit(limit).then(async (userdata) => {
        if (userdata.length > 0) {
            res.json({
                status: true,
                message: "Get user details",
                data: userdata,
                totalCount: totalUsers
            })
        } else {
            res.json({
                status: false,
                message: "Data not found",
                data: [],
                totalCount: 0
            })
        }
    })
}

//logout

module.exports.adminLogout = async (req, res) => {
    const isStatus = await adminModel.updateOne({ _id: req.body.userId }, { $set: { loginStatus: "Inactive" } })
    if (isStatus.modifiedCount == 1) {
        res.json({
            status: true,
            message: "Logout Successfully"
        })
    }
    else {
        res.json({
            status: false,
            message: "No change occurs"
        })
    }
}
