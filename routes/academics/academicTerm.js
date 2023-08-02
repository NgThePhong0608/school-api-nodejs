const academicTerms = require("express").Router();
const isLogIn = require("../../middlewares/isLogIn");
const isAdmin = require("../../middlewares/isAdmin");
const academicTerm = require("../../controller/academics/academicTerm");
academicTerms
    .route("/")
    .post(isLogIn, isAdmin, academicTerm.createAcademicTerm)
    .get(isLogIn, isAdmin, academicTerm.getAcademicTerms);

academicTerms
    .route("/:id")
    .get(isLogIn, isAdmin, academicTerm.getOneAcademicTerm)
    .put(isLogIn, isAdmin, academicTerm.updateAcademicTerm)
    .delete(isLogIn, isAdmin, academicTerm.deleteAcademicTerm);

module.exports = academicTerms;
