const Teacher = require("../model/Staff/Teacher");

const isTeacher = async (req, res, next) => {
    // find user
    const user_id = req?.userAuth?._id;
    // console.log(user_id);
    const teacherFound = await Teacher.findById(user_id);
    if (teacherFound?.role === "teacher") {
        next();
    } else {
        next(new Error("Access denied, teacher only !"));
    }
};

module.exports = isTeacher;
