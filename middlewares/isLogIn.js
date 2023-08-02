const Admin = require("../model/Staff/Admin");
const verifyToken = require("../utils/verifyToken");

const isLogIn = async (req, res, next) => {
    // get token from header
    const header = req.headers;
    // console.log(header.authorization);
    // const token = header.authorization.split(" ")[1];
    const token =
        header && header.authorization && header.authorization.split(" ")[1];
    // console.log(token);
    // verify token
    const verify = verifyToken(token);
    // save the user into req.obj
    if (verify) {
        const admin = await Admin.findById(verify.id).select("name email role");
        // save to the req.user
        req.userAuth = admin;
        next();
    } else {
        const err = new Error("Token expired or invalid");
        next(err);
    }
};

module.exports = isLogIn;
