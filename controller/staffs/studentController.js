const AsyncHandler = require("express-async-handler");
const Student = require("../../model/Staff/Student");
const { hashPassword, isPassMatched } = require("../../utils/helpers");
const generateToken = require("../../utils/generateToken");
const Admin = require("../../model/Staff/Admin");
const Exam = require("../../model/Academic/Exam");
const ExamResult = require("../../model/Academic/ExamResults");

class studentController {
    // @desc Admin register student
    // @route POST api/v1/students/admin/register
    // @access private
    adminRegisterStudent = AsyncHandler(async (req, res) => {
        const { name, email, password } = req.body;
        const admin = await Admin.findById(req?.userAuth?._id);
        if (!admin) {
            throw new Error("Admin not found");
        }
        const teacherFound = await Student.findOne({ email });
        if (teacherFound) {
            throw new Error("Email already existed !");
        }
        //register
        const studentCreate = await Student.create({
            name,
            email,
            password: await hashPassword(password),
        });

        // push to admin fields
        admin.students.push(studentCreate?._id);
        await admin.save();

        res.status(201).json({
            status: "success",
            data: studentCreate,
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
        // console.log(id);
        const student = await Student.findById(id)
            .select("-password -createdAt -updatedAt")
            .populate("examResults");
        if (!student) {
            throw new Error("Student not found");
        }
        // get student  profile
        const studentProfile = {
            studentId: student?.studentId,
            name: student.name,
            email: student?.email,
            currentClassLevel: student?.currentClassLevel,
            programId: student?.program,
            dateAmitted: student?.dateAdmitted,
            isSuspended: student?.isSuspended,
            isWithdrawn: student?.isWithdrawn,
            prefectName: student?.prefectName,
        };
        // get student exam results
        const examResults = student?.examResults;
        // console.log(examResults);
        // current exam
        const currentExamResults = examResults[examResults.length - 1];
        // console.log(currentExamResults);
        // check if exam is published
        const isPublished = currentExamResults?.isPublished;
        // console.log(isPublished);
        res.status(200).json({
            status: "success",
            message: "Student profile fetched succesfully",
            data: {
                studentProfile,
                currentExamResults: isPublished ? currentExamResults : [],
            },
        });
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
        const {
            classLevels,
            academicYear,
            program,
            name,
            email,
            prefectName,
            isSuspended,
            isWithdrawn,
        } = req?.body;
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
                    isSuspended,
                    isWithdrawn,
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

    // @desc Student taking exam
    // @route POST api/v1/students/exam/:examId/write
    // @access Student only
    writeExam = AsyncHandler(async (req, res) => {
        const studentFound = await Student.findById(req?.userAuth?._id);
        if (!studentFound) throw new Error("Student not found");

        const examFound = await Exam.findById(req?.params?.examId).populate(
            "questions academicTerm"
        );
        if (!examFound) throw new Error("Exam not found");
        /* console.log({
            studentFound,
            examFound,
        }); */
        // get questions
        const questions = examFound.questions;
        // get student answers
        const answers = req?.body?.answers;

        // check if student has answered all the questions
        if (answers.length !== questions.length)
            throw new Error("You have not completed the examination");

        // check if student has already taking examination
        const studentFoundInResults = await ExamResult.findOne({
            student: studentFound._id,
        });
        if (studentFoundInResults) {
            throw new Error("You have already taken exams");
        }

        // check if student is suspended/withdraw
        if (studentFound.isSuspended || studentFound.isWithdrawn) {
            throw new Error(
                "You are suspended/withdraw, you can not take the exam"
            );
        }

        // check answers
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let totalQuestions = 0;
        let status = ""; // whether fail or pass
        let grade = 0;
        let score = 0;
        let remarks = "";
        let answeredQuestion = [];

        // check for answers
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            // console.log(question);

            // check
            if (question.correctAnswer === answers[i]) {
                correctAnswers++;
                score++;
                question.isCorrect = true;
            } else {
                wrongAnswers++;
            }
        }

        // calculate report
        totalQuestions = questions.length;
        grade = (correctAnswers / totalQuestions) * 100;
        answeredQuestion = questions.map((question) => {
            return {
                question: question.question,
                correctAnswers: question.correctAnswer,
                isCorrect: question.isCorrect,
            };
        });

        // calculate status
        if (grade >= 50) {
            status = "passed";
        } else {
            status = "failed";
        }

        // remarks
        if (grade >= 80) {
            remarks = "Excellent";
        } else if (grade >= 70) {
            remarks = "Very good";
        } else if (grade >= 60) {
            remarks = "Good";
        } else if (grade >= 50) {
            remarks = "Fair";
        } else {
            remarks = "Poor";
        }

        // generate exam results
        const examResult = await ExamResult.create({
            studentId: studentFound?.studentId,
            exam: examFound?._id,
            grade,
            score,
            status,
            remarks,
            classLevel: examFound?.classLevel,
            academicTerm: examFound?.academicTerm,
            academicYear: examFound?.academicYear,
            answeredQuestions: answeredQuestion,
        });

        //save exam result to student
        studentFound.examResults.push(examResult._id);
        await studentFound.save();

        // promoting student
        console.log(examFound.academicTerm);
        if (
            examFound?.academicTerm?.name === "Third term" &&
            status === "passed" &&
            studentFound?.currentClassLevel === "Level 100"
        ) {
            // promote to 200
            studentFound?.classLevels?.push("Level 200");
            studentFound.currentClassLevel = "Level 200";
            await studentFound.save();
            console.log("yes");
        } else {
            console.log("No");
        }

        if (
            examFound?.academicTerm?.name === "Third term" &&
            status === "passed" &&
            studentFound?.currentClassLevel === "Level 200"
        ) {
            // promote to 300
            studentFound?.classLevels?.push("Level 300");
            studentFound.currentClassLevel = "Level 300";
            await studentFound.save();
        } else {
            console.log("no");
        }

        if (
            examFound?.academicTerm?.name === "Third term" &&
            status === "passed" &&
            studentFound?.currentClassLevel === "Level 300"
        ) {
            // promote to 400
            studentFound?.classLevels?.push("Level 400");
            studentFound.currentClassLevel = "Level 400";
            await studentFound.save();
        }

        if (
            examFound?.academicTerm?.name === "Third term" &&
            status === "passed" &&
            studentFound?.currentClassLevel === "Level 400"
        ) {
            // promote to 400
            studentFound.isGraduated = true;
            studentFound.yearGraduated = new Date();
            studentFound.currentClassLevel = "Level 400";
            await studentFound.save();
        }

        res.status(200).json({
            status: "Success",
            data: "You have submitted your exam. Check later for the results",
        });
    });
}

module.exports = new studentController();
