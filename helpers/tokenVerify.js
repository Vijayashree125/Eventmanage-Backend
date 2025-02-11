const jwt = require("jsonwebtoken")
const details=require('../common')

module.exports.verifyAuthToken = (req, res, next) => {
    const authHeader = req.headers['x-access-token']
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.json({
            status: 401,
            message: "Token required"
        })
    } else {
        jwt.verify(token, details.data.JWT_SECRET,(err,user) => {
            if (err) {
                return res.json({
                    status: 403,
                    message: "Invalid Token"
                })
            }
            req.user = user;
            next();
        })
    }
}