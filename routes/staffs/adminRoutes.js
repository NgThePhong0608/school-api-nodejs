const adminRouter = require("express").Router();
const adminController = require("../../controller/staffs/adminController");
const isAdmin = require("../../middlewares/isAdmin");
const isLogIn = require("../../middlewares/isLogIn");
// register
adminRouter.post("/register", adminController.register);

// login
adminRouter.post("/login", adminController.login);

// logout
// adminRouter.post("/logout", adminController.logout);

// get all
adminRouter.get("/", adminController.getAllAdmins);

// get profile admin
adminRouter.get("/profile", isLogIn, isAdmin, adminController.getAdminProfile);

// update admin
adminRouter.put("/", isLogIn, isAdmin, adminController.update);

// delete admin
adminRouter.delete("/", isLogIn, isAdmin, adminController.delete);

// suspend
adminRouter.put("/suspend/teacher/:id", adminController.suspendTeacher);

// unsuspend
adminRouter.put("/unsuspend/teacher/:id", adminController.unsuspendTeacher);

// withdraw
adminRouter.put("/withdraw/teacher/:id", adminController.withdrawTeacher);

// unwithdraw
adminRouter.put("/unwithdraw/teacher/:id", adminController.unwithdrawTeacher);

// publish exam
adminRouter.put("/publish/exam/:id", adminController.publishExam);

// unpublish exam
adminRouter.put("/unpublish/exam/:id", adminController.unPublishExam);

module.exports = adminRouter;
