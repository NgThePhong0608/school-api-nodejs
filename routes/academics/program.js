const programRouter = require("express").Router();
const isLogIn = require("../../middlewares/isLogIn");
const isAdmin = require("../../middlewares/isAdmin");
const program = require("../../controller/academics/program");

programRouter
    .route("/")
    .post(isLogIn, isAdmin, program.createProgram)
    .get(isLogIn, isAdmin, program.getPrograms); //

programRouter
    .route("/:id")
    .get(isLogIn, isAdmin, program.getOneProgram)
    .put(isLogIn, isAdmin, program.updateProgram)
    .delete(isLogIn, isAdmin, program.deleteProgram);

module.exports = programRouter;
