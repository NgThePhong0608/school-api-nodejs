const questionController = require("../../controller/academics/questions");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const questionRouter = require("express").Router();

questionRouter.post(
    "/:examId",
    isTeacherLogin,
    isTeacher,
    questionController.createQuestion
);

questionRouter.get(
    "/",
    isTeacherLogin,
    isTeacher,
    questionController.getQuestions
);

questionRouter
    .route("/:id", isTeacherLogin, isTeacher)
    .get(questionController.getOneQuestion)
    .put(questionController.updateQuestion);

module.exports = questionRouter;
