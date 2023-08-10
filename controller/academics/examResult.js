const AsyncHandler = require("express-async-handler");
const ExamResults = require("../../model/Academic/ExamResults");
const Student = require("../../model/Staff/Student");

class ExamResult {
    // @desc Exam result checking
    // @route POST api/v1/exam-results/checking
    // @access Student only
    checkExamResults = AsyncHandler(async (req, res) => {
        const studentFound = await Student.findById(req?.userAuth?._id);
        if (!studentFound) {
            throw new Error("Student not found");
        }

        const _id = req?.params?.id;
        const examResult = await ExamResults.findOne({
            studentId: studentFound?.studentId,
            _id,
        }).populate("exam classLevel academicTerm academicYear");

        // check if exam is publish
        // console.log(examResult?.isPublished);
        if (!examResult?.isPublished) {
            throw new Error("Exam is not available, check later");
        }
        if (!examResult) {
            throw new Error("Exam result not found");
        }
        res.status(200).json({
            status: "success",
            message: "Exam result",
            data: examResult,
            student: studentFound,
        });
    });

    // @desc Get all results
    // @route POST api/v1/exam-results
    // @access Student only
    getAllExamResults = AsyncHandler(async (req, res) => {
        const examResults = await ExamResults.find()
            .select("exam")
            .populate("exam");
        res.status(200).json({
            status: "success",
            message: "Exam results fetch success",
            length: examResults.length,
            data: examResults,
        });
    });

    // @desc Admin publish exam results
    // @route POST api/v1/exam-results/:id/admin-publish
    // @access Student only
    adminToggleExamResults = AsyncHandler(async (req, res) => {
        const examResult = await ExamResults.findById(req?.params?.id);
        if (!examResult) {
            throw new Error("Exam results not found");
        }
        const publishResults = await ExamResults.findByIdAndUpdate(
            req?.params?.id,
            {
                isPublished: req?.body?.publish,
            },
            {
                new: true,
            }
        );
        res.status(201).json({
            status: "success",
            message: "Exam result updated",
            data: publishResults,
        });
    });
}

module.exports = new ExamResult();
