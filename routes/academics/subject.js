const subjectRouter = require("express").Router();
const isLogIn = require("../../middlewares/isLogIn");
const isAdmin = require("../../middlewares/isAdmin");
const subject = require("../../controller/academics/subject");

subjectRouter.post("/:programId", isLogIn, isAdmin, subject.createSubject);

subjectRouter.get("/", isLogIn, isAdmin, subject.getSubjects); //

subjectRouter
    .route("/:id")
    .get(isLogIn, isAdmin, subject.getOneSubject)
    .put(isLogIn, isAdmin, subject.updateSubject)
    .delete(isLogIn, isAdmin, subject.deleteSubject); //

module.exports = subjectRouter;
