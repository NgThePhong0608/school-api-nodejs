const academicYearRouter = require("express").Router();
const academicYear = require("../../controller/academics/academicYear");
const isLogIn = require("../../middlewares/isLogIn");
const isAdmin = require("../../middlewares/isAdmin");

academicYearRouter
    .route("/")
    .post(isLogIn, isAdmin, academicYear.createAcademicYear)
    .get(isLogIn, isAdmin, academicYear.getAcademicYears);

academicYearRouter
    .route("/:id")
    .get(isLogIn, isAdmin, academicYear.getOneAcademicYear)
    .put(isLogIn, isAdmin, academicYear.updateAcademicYear)
    .delete(isLogIn, isAdmin, academicYear.deleteAcademicYear);

module.exports = academicYearRouter;
