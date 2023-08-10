const express = require("express");
const teacherRouter = express.Router();

const teacherController = require("../../controller/staffs/teacherController");
const isTeacher = require("../../middlewares/isTeacher");
const advancedResults = require("../../middlewares/advancedResults");
const Teacher = require("../../model/Staff/Teacher");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");
const Admin = require("../../model/Staff/Admin");

teacherRouter.get(
    "/profile",
    isAuthenticated(Teacher),
    roleRestriction("teacher"),
    teacherController.getTeacherProfile
);

teacherRouter.post(
    "/admin/register",
    isAuthenticated(Admin),
    roleRestriction("admin"),
    teacherController.adminRegisterTeacher
);

teacherRouter.post("/login", teacherController.login);

teacherRouter.get(
    "/admin/teachers",
    isAuthenticated(Admin),
    roleRestriction("admin"),
    advancedResults(Teacher, {
        path: "examsCreated",
        populate: {
            path: "questions",
        },
    }), // add middlewares to pagination and filtering
    teacherController.getAllTeachers
);

teacherRouter.get(
    "/:teacherId/admin",
    isAuthenticated(Admin),
    roleRestriction("admin"),
    teacherController.getOneTeacher
);

// teacher update myself
teacherRouter.put(
    "/update",
    isAuthenticated(Teacher),
    isTeacher,
    teacherController.update
);

// admin assign teacher
teacherRouter.put(
    "/:teacherId/update/admin",
    isAuthenticated(Admin),
    roleRestriction("admin"),
    teacherController.adminUpdateTeacher
);

module.exports = teacherRouter;
