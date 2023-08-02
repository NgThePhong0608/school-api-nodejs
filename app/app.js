const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

// import router
const adminRouter = require("../routes/staffs/adminRoutes");
const academicYearRouter = require("../routes/academics/academicYear");
const academicTermsRouter = require("../routes/academics/academicTerm");
const classLevelRouter = require("../routes/academics/classLevel");
const programRouter = require("../routes/academics/program");

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

// admin routes
app.use("/api/v1/admins", adminRouter);

// academic year routes
app.use("/api/v1/academic-years", academicYearRouter);

// academic term routes
app.use("/api/v1/academic-terms", academicTermsRouter);

// class level routes
app.use("/api/v1/class-levels", classLevelRouter);

// program routes
app.use("/api/v1/programs", programRouter);

// Error middlewares
app.use(notFound);
app.use(global);

module.exports = app;
