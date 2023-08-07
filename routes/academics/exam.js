const examController = require("../../controller/academics/exam");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const examRouter = require("express").Router();

examRouter.post("/", isTeacherLogin, isTeacher, examController.createExam);
examRouter.route("/", isTeacherLogin, isTeacher).get(examController.getExams);

examRouter
    .route("/:id", isTeacherLogin, isTeacher)
    .get(examController.getOneExam)
    .put(examController.updateExams);

module.exports = examRouter;
