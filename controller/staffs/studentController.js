const AsyncHandler = require("express-async-handler");
const Student = require("../../model/Staff/Student");
const { hashPassword, isPassMatched } = require("../../utils/helpers");
const generateToken = require("../../utils/generateToken");
const Admin = require("../../model/Staff/Admin");

class studentController {
    // @desc Admin register student
    // @route POST api/v1/students/admin/register
    // @access private
    adminRegisterStudent = AsyncHandler(async (req, res) => {
        const { name, email, password } = req.body;
        const teacherFound = await Student.findOne({ email });
        if (teacherFound) {
            throw new Error("Email already existed !");
        }
        //register
        const student = await Student.create({
            name,
            email,
            password: await hashPassword(password),
        });

        // push to admin fields
        const admin = await Admin.findById(req?.userAuth?._id);
        admin.students.push(student._id);
        await admin.save();

        res.status(201).json({
            status: "success",
            data: student,
            message: "Student registered successfully",
        });
    });

    // @desc Student login
    // @route POST api/v1/students/login
    // @access private
    login = AsyncHandler(async (req, res) => {
        const { email, password } = req?.body;
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({
                status: "failed",
                error: "Invalid login credentials",
            });
        }
        const isMatched = await isPassMatched(password, student.password);
        if (!isMatched) {
            return res
                .status(400)
                .json({ message: "Invalid login crendentials" });
        } else {
            return res.status(200).json({
                message: "Student logged in successfully",
                data: generateToken(student._id),
                student: student,
            });
        }
    });

    // @desc Admin get all students
    // @route GET api/v1/students
    // @access Admin only
    getAllStudents = AsyncHandler(async (req, res) => {
        const students = await Student.find();
        res.status(200).json({
            results: students.length,
            status: "success",
            message: "Students fetched successfully",
            data: students,
        });
    });

    // @desc Admin get one student
    // @route GET api/v1/students/:studentId
    // @access Admin only
    getOneStudent = AsyncHandler(async (req, res) => {
        const id = req?.params?.studentId;
        const student = await Student.findById(id);
        if (!student) {
            throw new Error("Student not found");
        } else {
            res.status(200).json({
                status: "success",
                message: "Student profile fetched succesfully",
                data: student,
            });
        }
    });

    // @desc Student profile
    // @route GET api/v1/students/profile
    // @access Student only
    getStudentProfile = AsyncHandler(async (req, res) => {
        const id = req?.userAuth?._id;
        console.log(id);
        const student = await Student.findById(id).select(
            "-password -createdAt -updatedAt"
        );
        if (!student) {
            throw new Error("Student not found");
        } else {
            res.status(200).json({
                status: "success",
                message: "Student profile fetched succesfully",
                data: student,
            });
        }
    });

    // @desc Student update profile
    // @route PUT api/v1/students/:studentId/update
    // @access Stdent only
    studentUpdateProfile = AsyncHandler(async (req, res) => {
        const { email, name, password } = req?.body;
        const id = req?.userAuth?._id;
        // console.log(email, name, password);
        const existEmail = await Student.findOne({ email });

        if (existEmail) {
            throw new Error("Student has already taken/exist");
        }

        // check if user changes password
        if (password) {
            // hash password
            const student = await Student.findByIdAndUpdate(
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
                message: "Update student successfully",
                data: student,
            });
        } else {
            // update
            const student = await Student.findByIdAndUpdate(
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
                message: "Update student successfully",
                data: student,
            });
        }
    });

    // @desc Admin update (eg: assign class, program, ...)
    // @route PUT api/v1/students/:studentId/update/admin
    // @access Admin only
    adminUpdateStudent = AsyncHandler(async (req, res) => {
        const { classLevels, academicYear, program, name, email, prefectName } =
            req?.body;
        // find the student by id
        const id = req?.params?.studentId;
        const studentFound = await Student.findById(id);
        if (!studentFound) {
            throw new Error("Student not found");
        }

        const studentUpdate = await Student.findByIdAndUpdate(
            id,
            {
                $set: {
                    academicYear,
                    program,
                    name,
                    email,
                    prefectName,
                },
                $addToSet: {
                    classLevels,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            status: "success",
            message: "Student updated successfully",
            data: studentUpdate,
        });
    });
}

module.exports = new studentController();
