const express = require("express");
const studentRouter = express.Router();

const studentController = require("../../controller/staffs/studentController");
const advancedResults = require("../../middlewares/advancedResults");
const Student = require("../../model/Staff/Student");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");
const Admin = require("../../model/Staff/Admin");

studentRouter.get(
    "/profile",
    isAuthenticated(Student),
    roleRestriction("student"),
    studentController.getStudentProfile
);

studentRouter.put(
    "/update",
    isAuthenticated(Student),
    roleRestriction("student"),
    studentController.studentUpdateProfile
);

studentRouter.post(
    "/admin/register",
    isAuthenticated(Admin),
    roleRestriction("admin"),
    studentController.adminRegisterStudent
);
studentRouter.post("/login", studentController.login);
studentRouter.get(
    "/",
    isAuthenticated(Admin),
    roleRestriction("admin"),
    advancedResults(Student, "examResults"),
    studentController.getAllStudents
);
studentRouter.get(
    "/:studentId",
    isAuthenticated(Admin),
    roleRestriction("admin"),
    studentController.getOneStudent
);

studentRouter.put(
    "/:studentId/update/admin",
    isAuthenticated(Admin),
    roleRestriction("admin"),
    studentController.adminUpdateStudent
);

studentRouter.post(
    "/exam/:examId/write",
    isAuthenticated(Student),
    roleRestriction("student"),
    studentController.writeExam
);
module.exports = studentRouter;
