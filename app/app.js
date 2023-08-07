const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

// import staffs router
const adminRouter = require("../routes/staffs/adminRoutes");
const studentRouter = require("../routes/staffs/studentRoutes");
const teacherRouter = require("../routes/staffs/teacherRoutes");

// import academics router
const examRouter = require("../routes/academics/exam");
const academicYearRouter = require("../routes/academics/academicYear");
const academicTermsRouter = require("../routes/academics/academicTerm");
const classLevelRouter = require("../routes/academics/classLevel");
const programRouter = require("../routes/academics/program");
const subjectRouter = require("../routes/academics/subject");
const yearGroupRouter = require("../routes/academics/yearGroup");

const { global, notFound } = require("../middlewares/globalErrorHandler");
dotenv.config();
const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// staff routes
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/students", studentRouter);

// academics routes
// academic year routes
app.use("/api/v1/academic-years", academicYearRouter);

// academic term routes
app.use("/api/v1/academic-terms", academicTermsRouter);

// class level routes
app.use("/api/v1/class-levels", classLevelRouter);

// program routes
app.use("/api/v1/programs", programRouter);

// subject routes
app.use("/api/v1/subjects", subjectRouter);

// year group routes
app.use("/api/v1/year-groups", yearGroupRouter);

// exam routes
app.use("/api/v1/exams", examRouter);

// Error middlewares
app.use(notFound);
app.use(global);

module.exports = app;
