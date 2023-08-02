const classLevelRouter = require("express").Router();
const isLogIn = require("../../middlewares/isLogIn");
const isAdmin = require("../../middlewares/isAdmin");
const classLevel = require("../../controller/academics/classLevel");

classLevelRouter
    .route("/")
    .post(isLogIn, isAdmin, classLevel.createClassLevel)
    .get(isLogIn, isAdmin, classLevel.getClassLevels); //

classLevelRouter
    .route("/:id")
    .get(isLogIn, isAdmin, classLevel.getOneClassLevel)
    .put(isLogIn, isAdmin, classLevel.updateClassLevel)
    .delete(isLogIn, isAdmin, classLevel.deleteClassLevel);

module.exports = classLevelRouter;
