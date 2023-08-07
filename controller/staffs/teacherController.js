const AsyncHandler = require("express-async-handler");
const Teacher = require("../../model/Staff/Teacher");
const { hashPassword, isPassMatched } = require("../../utils/helpers");
const generateToken = require("../../utils/generateToken");
const Admin = require("../../model/Staff/Admin");

class teacherController {
    // @desc Admin register teacher
    // @route POST api/v1/teachers/admin/register
    // @access private
    adminRegisterTeacher = AsyncHandler(async (req, res) => {
        const { name, email, password } = req.body;
        const teacherFound = await Teacher.findOne({ email });
        if (teacherFound) {
            throw new Error("Email already existed !");
        }
        //register
        const teacherCreate = await Teacher.create({
            name,
            email,
            password: await hashPassword(password),
        });

        // push to admin field
        const admin = await Admin.findById(req?.userAuth?._id);
        admin.teachers.push(teacherCreate?._id);
        await admin.save();

        res.status(201).json({
            status: "success",
            data: teacherCreate,
            message: "Teacher registered successfully",
        });
    });

    // @desc Teacher login
    // @route POST api/v1/teachers/login
    // @access private
    login = AsyncHandler(async (req, res) => {
        const { email, password } = req?.body;
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(404).json({
                status: "failed",
                error: "Invalid login credentials",
            });
        }
        const isMatched = await isPassMatched(password, teacher.password);
        if (!isMatched) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid login crendentials",
            });
        } else {
            return res.status(200).json({
                status: "failed",
                message: "Teacher logged in successfully",
                data: generateToken(teacher._id),
                teacher: teacher,
            });
        }
    });

    // @desc Admin get all teachers
    // @route POST api/v1/teachers/admin/teachers/
    // @access private
    getAllTeachers = AsyncHandler(async (req, res) => {
        const teachers = await Teacher.find();
        res.status(200).json({
            results: teachers.length,
            status: "success",
            message: "Teachers fetched successfully",
            data: teachers,
        });
    });

    // @desc Admin get all teachers
    // @route POST api/v1/teachers/admin/:teacherId
    // @access private
    getOneTeacher = AsyncHandler(async (req, res) => {
        const teacher = await Teacher.findById(req?.params?.teacherId).populate(
            "examsCreated"
        );
        if (!teacher) {
            throw new Error("Teacher not found");
        }

        res.status(200).json({
            status: "success",
            message: "Teacher fetched successfully",
            data: teacher,
        });
    });

    // @desc Get teacher profile
    // @route POST api/v1/teachers/profile
    // @access Teacher only
    getTeacherProfile = AsyncHandler(async (req, res) => {
        const id = req?.userAuth?._id;
        const teacher = await Teacher.findById(id).select(
            "-password -createdAt -updatedAt"
        );
        if (!teacher) {
            throw new Error("Teacher not found");
        } else {
            res.status(200).json({
                status: "success",
                message: "Teacher profile fetched succesfully",
                data: teacher,
            });
        }
    });

    // @desc Teacher update profile
    // @route PUT api/v1/teachers/:id/update
    // @access private
    update = AsyncHandler(async (req, res) => {
        const { email, name, password } = req?.body;
        const id = req?.userAuth?._id;
        // console.log(email, name, password);
        const existEmail = await Teacher.findOne({ email });

        if (existEmail) {
            throw new Error("Teacher has already taken/exist");
        }

        // check if user changes password
        if (password) {
            // hash password
            const teacher = await Teacher.findByIdAndUpdate(
                id,
                {
                    email,
                    password: await hashPassword(password),
                    name,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.status(200).json({
                status: "success",
                message: "Update teacher successfully",
                data: teacher,
            });
        } else {
            // update
            const teacher = await Teacher.findByIdAndUpdate(
                id,
                {
                    email,
                    name,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.status(200).json({
                status: "success",
                message: "Update teacher successfully",
                data: teacher,
            });
        }
    });

    // @desc Update teacher (teacher update depends on token verify it is admin or teacher)
    // @route PATCH api/v1/teachers/:id/admin
    // @access admin only
    adminUpdateTeacher = AsyncHandler(async (req, res) => {
        const { program, classLevel, academicYear, subject } = req?.body;
        const id = req?.params?.teacherId;
        // console.log(email, name, password);
        const teacherFound = await Teacher.findById(id);
        if (!teacherFound) {
            throw new Error("Teacher not found");
        }

        // check teacher is suspended or withdraw
        if (teacherFound.isWitdrawn || teacherFound.isSuspended) {
            throw new Error("Action denied");
        }
        // assign program
        if (program) {
            teacherFound.program = program;
            await teacherFound.save();
            res.status(200).json({
                status: "success",
                message: "Update teacher successfully",
                data: teacherFound,
            });
        }

        // assign classLevel
        if (classLevel) {
            teacherFound.classLevel = classLevel;
            await teacherFound.save();
            res.status(200).json({
                status: "success",
                message: "Update teacher successfully",
                data: teacherFound,
            });
        }

        // assign academicYear
        if (academicYear) {
            teacherFound.academicYear = academicYear;
            await teacherFound.save();
            res.status(200).json({
                status: "success",
                message: "Update teacher successfully",
                data: teacherFound,
            });
        }

        // assign subject
        if (subject) {
            teacherFound.subject = subject;
            await teacherFound.save();
            res.status(200).json({
                status: "success",
                message: "Update teacher successfully",
                data: teacherFound,
            });
        }
    });
}

module.exports = new teacherController();
