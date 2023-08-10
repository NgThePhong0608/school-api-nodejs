const verifyToken = require("../utils/verifyToken");
const isAuthenticated = (model) => {
    return async (req, res, next) => {
        // get token from header
        const header = req.headers;
        // console.log(header.authorization);
        // const token = header.authorization.split(" ")[1];
        const token =
            header &&
            header.authorization &&
            header.authorization.split(" ")[1];
        // console.log(token);
        // verify token
        const verify = verifyToken(token);
        // save the user into req.obj
        if (verify) {
            const admin = await model
                .findById(verify.id)
                .select("name email role");
            // save to the req.user
            req.userAuth = admin;
            next();
        } else {
            const err = new Error("Token expired or invalid");
            next(err);
        }
    };
};

module.exports = isAuthenticated;
