const express = require("express");
const studentRouter = express.Router();

const studentController = require("../../controller/staffs/studentController");
const isLogIn = require("../../middlewares/isLogIn");
const isAdmin = require("../../middlewares/isAdmin");
const isStudent = require("../../middlewares/isStudent");
const isStudentLogin = require("../../middlewares/isStudentLogin");

studentRouter.get(
    "/profile",
    isStudentLogin,
    isStudent,
    studentController.getStudentProfile
);

studentRouter.put(
    "/update",
    isStudentLogin,
    isStudent,
    studentController.studentUpdateProfile
);

studentRouter.post(
    "/admin/register",
    isLogIn,
    isAdmin,
    studentController.adminRegisterStudent
);
studentRouter.post("/login", studentController.login);
studentRouter.get("/", isLogIn, isAdmin, studentController.getAllStudents);
studentRouter.get(
    "/:studentId",
    isLogIn,
    isAdmin,
    studentController.getOneStudent
);

studentRouter.put(
    "/:studentId/update/admin",
    isLogIn,
    isAdmin,
    studentController.adminUpdateStudent
);

studentRouter.post(
    "/exam/:examId/write",
    isStudentLogin,
    isStudent,
    studentController.writeExam
);
module.exports = studentRouter;
