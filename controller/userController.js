const userModel = require("../models/user")
const userActivityModel = require("../models/useractivity")
const eventModel = require("../models/events")
const Registration = require('../models/eventRegister');
const bcrypt = require("bcrypt")
const mailModel = require("../helpers/mail")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

//create user account
module.exports.userRegister = async (req, res) => {
    var userInfo = req.body
    var insertData = {}
    const generateOTP = Math.floor(1000 + Math.random() * 9000).toString();
    insertData.username = userInfo.username
    insertData.email = userInfo.email
    insertData.password = await bcrypt.hash(userInfo.password, 10)
    insertData.mobileNumber = userInfo.mobileNumber
    insertData.otpCode = generateOTP

    await userModel.findOne({ email: userInfo.email }).then(async (finddata) => {
        if (finddata != undefined || finddata != null) {
            res.json({
                status: false,
                message: "User Account Already Exits"
            })
        }
        else if (finddata == undefined || finddata == null) {
            await userModel.create(insertData).then(async (createUser) => {
                if (createUser) {
                    await userModel.updateOne({ email: userInfo.email }, { $set: { emailVerified: true } })
                    // const verificationLink = `http://localhost:5000/verify-acoount?token=${generateOTP}`;
                    // mailModel.sendmail(userInfo.email, generateOTP).then((response) => {
                    res.json({
                        status: true,
                        message: "User Account Registered Successfully"
                    })
                    // })
                }
                else {
                    res.json({
                        status: false,
                        message: "User Account Created Error"
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

// //verify account
// module.exports.verifyToken = async (req, res) => {
//     var otp = req.params.otp
//     await userModel.findOne({ otpCode: otp }).then(async (userOtp) => {
//         if (userOtp != null) {
//             await userModel.updateOne({ otpCode: "", emailVerified: true }).then(updatedata => { })
//             res.json({
//                 status: true,
//                 message: "OTP Verified Successfully"
//             })
//         }
//         else {
//             res.json({
//                 status: false,
//                 message: "Invalid Otp"
//             })
//         }
//     })
// }

//user login 
module.exports.userLogin = async (req, res) => {
    const { email, password } = req.body
    await userModel.findOne({ email: email }).then(async (userdata) => {
        if (userdata != null) {
            var comparePassword = await bcrypt.compare(password, userdata.password);
            var jwtToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" })
            if (comparePassword) {
                //save user login activity
                await userActivityModel.create({
                    userId: userdata._id,
                    type: "userLogin",
                    ip: req.ip,
                    userAgent: req.headers["user-agent"]
                })
                await userModel.updateOne({ _id: userdata._id }, { $set: { loginStatus: "Active", } })
                res.json({
                    status: true,
                    message: "Login Successfully",
                    data: { authToken: jwtToken, userId: userdata._id }
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


//Get User Login History
module.exports.userLogHis = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalUsers = await userActivityModel.countDocuments();

    await userActivityModel.find({ userId: req.params.userId }).sort({ dateTime: -1 }).skip(skip).limit(limit).then((logdata) => {
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

//Upcoming events
module.exports.upcomingEvent = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    console.log('page', page)
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalUsers = await eventModel.countDocuments();
    var currentDate = new Date()
    await eventModel.find({ date: { $gt: currentDate } }).sort({ date: -1 }).sort({ dateTime: -1 }).skip(skip).limit(limit).then((response) => {
        if (response.length > 0) {
            res.json({
                status: true,
                message: "Get Upcoming Event Details",
                data: response,
                totalCount: totalUsers,
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

//check event
module.exports.eventRegister = async (req, res) => {
    const eventId = req.body.event_id
    const event = await eventModel.findById(eventId)
    if (!event) {
        res.json({
            status: false,
            message: "Event Not Found"
        })
    } else {
        const existingRegistration = await Registration.findOne({ userId: req.body.user_id, eventId });
        if (existingRegistration) {
            res.json({ status: false, message: 'User already registered' });
        } else {
            // Register user for event
            const registration = new Registration({ userId: req.body.user_id, eventId });
            await registration.save();
            event.registeredUsers.push(req.body.user_id);
            await event.save();
            res.json({ message: `${event.title} Event Registration successful`, registration });
        }
    }
}


//get user registration

module.exports.getRegisterUser = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    console.log('page', page)
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalUsers = await Registration.countDocuments();
    const eventRegs = await Registration.find({ userId: req.params.userId }).sort({ registrationDate: -1 }).skip(skip).limit(limit).populate('eventId', 'title date location description');
    res.json({
        status: true,
        data: eventRegs,
        totalCount: totalUsers
    })
}

//get user registration

module.exports.getDisplayRegister = async (req, res) => {
    const eventlist = await eventModel.findOne({ title: (req.params.title).trim() })
    res.json({
        status: true,
        data: eventlist
    })
}


//logout

module.exports.userLogout = async (req, res) => {
    const isStatus = await userModel.updateOne({ _id: req.body.userId }, { $set: { loginStatus: "Inactive" } })
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

//forgot Password

// module.exports.forgotPassword = async (req, res) => {
//     const { email } = req.body
//     await userModel.findOne({ email: email }).then(async (forgotdata) => {
//         if (forgotdata != null) {
//             res.json({
//                 status: true,
//                 message: "Reset Password Link sent your email id",
//             })
//         } else {
//             res.json({
//                 status: false,
//                 message: "Email not found",
//             })
//         }
//     })
// }