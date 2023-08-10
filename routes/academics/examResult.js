const express = require("express");
const examResult = require("../../controller/academics/examResult");
const isStudentLogin = require("../../middlewares/isStudentLogin");
const isStudent = require("../../middlewares/isStudent");
const isAdmin = require("../../middlewares/isAdmin");
const isLogIn = require("../../middlewares/isLogIn");
const router = express.Router();

router.get(
    "/:id/checking",
    isStudentLogin,
    isStudent,
    examResult.checkExamResults
);

router.get("/", isStudentLogin, isStudent, examResult.getAllExamResults);

router.put(
    "/:id/admin-publish",
    isLogIn,
    isAdmin,
    examResult.adminToggleExamResults
);

module.exports = router;
