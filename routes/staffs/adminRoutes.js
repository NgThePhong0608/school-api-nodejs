const adminRouter = require("express").Router();
const adminController = require("../../controller/staffs/adminController");
const advancedResults = require("../../middlewares/advancedResults");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const roleRestriction = require("../../middlewares/roleRestriction");
const Admin = require("../../model/Staff/Admin");

// register
adminRouter.post("/register", adminController.register);

// login
adminRouter.post("/login", adminController.login);

// logout
// adminRouter.post("/logout", adminController.logout);

// get all
adminRouter.get(
    "/",
    advancedResults(Admin, "teachers students"),
    adminController.getAllAdmins
);

// get profile admin
adminRouter.get(
    "/profile",
    isAuthenticated(Admin),
    roleRestriction("admin"),
    adminController.getAdminProfile
);

// update admin
adminRouter.put(
    "/",
    isAuthenticated(Admin),
    roleRestriction("admin"),
    adminController.update
);

// delete admin
adminRouter.delete(
    "/",
    isAuthenticated(Admin),
    roleRestriction("admin"),
    adminController.delete
);

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
