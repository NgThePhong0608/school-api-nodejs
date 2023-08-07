const AsyncHandler = require("express-async-handler");
const Exam = require("../../model/Academic/Exam");
const Teacher = require("../../model/Staff/Teacher");

class examController {
    // @desc Create exam
    // @route POST api/v1/exams
    // @access Teacher only
    createExam = AsyncHandler(async (req, res) => {
        const {
            name,
            description,
            subject,
            program,
            academicTerm,
            duration,
            examDate,
            examTime,
            examType,
            academicYear,
            classLevel,
            createdBy,
        } = req?.body;
        // console.log(name);
        // find teacher
        const id = req?.userAuth?._id;
        console.log(id);
        const teacherFound = await Teacher.findById(id);
        if (!teacherFound) {
            throw new Error("Teacher not found");
        }

        // exam exist
        const examExist = await Exam.findOne({ name });
        if (examExist) {
            throw new Error("Exam has already existed");
        }

        // create
        const examCreated = await Exam.create({
            name,
            description,
            subject,
            program,
            classLevel,
            academicTerm,
            duration,
            examDate,
            examTime,
            examType,
            createdBy: req?.userAuth?._id,
            academicYear,
        });

        // push exam into teacher
        teacherFound.examsCreated.push(examCreated?._id);
        await examCreated.save();
        await teacherFound.save();
        res.status(201).json({
            message: "Exam created successfully",
            data: examCreated,
        });
    });
    // @desc Get all exam
    // @route GET api/v1/exams/
    // @access private
    getExams = AsyncHandler(async (req, res) => {
        const exams = await Exam.find().populate({
            path: "questions",
            populate: {
                path: "createdBy",
            },
        });
        res.status(200).json({
            length: exams.length,
            status: "success",
            data: exams,
            message: "Exam fetched successfully",
        });
    });

    // @desc Get one exam
    // @route GET api/v1/exam/:id
    // @access private
    getOneExam = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        const exam = await Exam.findById(id).populate({
            path: "questions",
            populate: {
                path: "createdBy",
            },
        });
        res.status(200).json({
            status: "success",
            data: exam,
            message: "Exam fetched successfully",
        });
    });

    // @desc Update exam
    // @route PUT api/v1/exam/:id
    // @access private
    updateExams = AsyncHandler(async (req, res) => {
        const {
            name,
            description,
            subject,
            program,
            classLevel,
            academicTerm,
            duration,
            examDate,
            examTime,
            examType,
            academicYear,
        } = req?.body;
        const id = req?.params?.id;
        const examFound = await Exam.findOne({ name });
        if (examFound) {
            throw new Error("Exam has been existed");
        } else {
            const examUpdate = await Exam.findByIdAndUpdate(
                id,
                {
                    name,
                    description,
                    subject,
                    program,
                    classLevel,
                    academicTerm,
                    duration,
                    examDate,
                    examTime,
                    examType,
                    academicYear,
                    createdBy: req?.userAuth?._id,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.status(201).json({
                status: "success",
                data: examUpdate,
                message: "Exam updated successfully",
            });
        }
    });

    // @desc Delete exam
    // @route DELETE api/v1/exam/:id
    // @access private
    deleteExam = AsyncHandler(async (req, res) => {
        const id = req?.userAuth?._id;
        await Exam.findByIdAndDelete(id);
        res.status(200).json({
            status: "success",
            message: "Exam deletedd succesfully",
        });
    });
}

module.exports = new examController();
