const Student = require("../model/Staff/Student");

const isStudent = async (req, res, next) => {
    // find user
    const stu_id = req?.userAuth?._id;
    // console.log(stu_id);
    const studentFound = await Student.findById(stu_id);
    if (studentFound?.role === "student") {
        next();
    } else {
        next(new Error("Access denied, student only !"));
    }
};

module.exports = isStudent;
