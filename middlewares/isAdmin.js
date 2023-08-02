const Admin = require("../model/Staff/Admin");

const isAdmin = async (req, res, next) => {
    // find user
    const user_id = req?.userAuth?._id;
    // console.log(user_id);
    const adminFound = await Admin.findById(user_id);
    if (adminFound?.role === "admin") {
        next();
    } else {
        next(new Error("Access denied, admin only !"));
    }
};

module.exports = isAdmin;
