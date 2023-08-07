const express = require("express");
const teacherRouter = express.Router();

const teacherController = require("../../controller/staffs/teacherController");
const isLogIn = require("../../middlewares/isLogIn");
const isAdmin = require("../../middlewares/isAdmin");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");

teacherRouter.get(
    "/profile",
    isTeacherLogin,
    isTeacher,
    teacherController.getTeacherProfile
);

teacherRouter.post(
    "/admin/register",
    isLogIn,
    isAdmin,
    teacherController.adminRegisterTeacher
);

teacherRouter.post("/login", teacherController.login);

teacherRouter.get(
    "/admin/teachers",
    isLogIn,
    isAdmin,
    teacherController.getAllTeachers
);

teacherRouter.get(
    "/:teacherId/admin",
    isLogIn,
    isAdmin,
    teacherController.getOneTeacher
);

// teacher update myself
teacherRouter.put(
    "/update",
    isTeacherLogin,
    isTeacher,
    teacherController.update
);

// admin assign teacher
teacherRouter.put(
    "/:teacherId/update/admin",
    isLogIn,
    isAdmin,
    teacherController.adminUpdateTeacher
);

module.exports = teacherRouter;
