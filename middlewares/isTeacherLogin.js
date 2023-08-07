const Teacher = require("../model/Staff/Teacher");
const verifyToken = require("../utils/verifyToken");

const isTeacherLogin = async (req, res, next) => {
    // get token from header
    const header = req?.headers;
    // console.log(header.authorization);
    // const token = header.authorization.split(" ")[1];
    const token =
        header && header?.authorization && header?.authorization.split(" ")[1];
    // console.log(token);
    // verify token
    const verify = verifyToken(token);
    // console.log(verify);
    // save the user into req.obj
    if (verify) {
        // console.log(verify.id);
        const teacher = await Teacher.findById(verify.id).select(
            "name email role"
        );
        // save to the req.user
        req.userAuth = teacher;
        next();
    } else {
        const err = new Error("Token expired or invalid");
        next(err);
    }
};

module.exports = isTeacherLogin;
