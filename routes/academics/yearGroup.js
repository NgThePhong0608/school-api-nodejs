const yearGroupRouter = require("express").Router();
const isLogIn = require("../../middlewares/isLogIn");
const isAdmin = require("../../middlewares/isAdmin");
const yearGroup = require("../../controller/academics/yearGroup");

yearGroupRouter
    .route("/")
    .post(isLogIn, isAdmin, yearGroup.createYearGroup)
    .get(isLogIn, isAdmin, yearGroup.getYearGroups);

yearGroupRouter
    .route("/:id")
    .get(isLogIn, isAdmin, yearGroup.getOneYearGroup)
    .put(isLogIn, isAdmin, yearGroup.updateYearGroup)
    .delete(isLogIn, isAdmin, yearGroup.deleteYearGroup); //

module.exports = yearGroupRouter;
