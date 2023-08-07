const AsyncHandler = require("express-async-handler");
const Question = require("../../model/Academic/Questions");
const Exam = require("../../model/Academic/Exam");

class questionController {
    // @desc Create question
    // @route POST api/v1/questions/:examId
    // @access Teacher only
    createQuestion = AsyncHandler(async (req, res) => {
        const { question, optionA, optionB, optionC, optionD, correctAnswer } =
            req?.body;
        // find the exam
        const examFound = await Exam.findById(req.params.examId);
        if (!examFound) {
            throw new Error("Exam not exist");
        }

        const duplicateQuestion = await Question.findOne({ question });
        if (duplicateQuestion) {
            throw new Error("Question has been existed");
        }

        const questionCreated = await Question.create({
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer,
            createdBy: req?.userAuth?._id,
        });

        examFound.questions.push(questionCreated._id);
        await examFound.save();

        res.status(201).json({
            status: "success",
            message: "Question created successfully",
            data: questionCreated,
        });
    });

    // @desc Get all questions
    // @route GET api/v1/questions/
    // @access private
    getQuestions = AsyncHandler(async (req, res) => {
        const questions = await Question.find().populate("createdBy");
        res.status(200).json({
            length: questions.length,
            status: "success",
            data: questions,
            message: "Questions fetched successfully",
        });
    });

    // @desc Get one question
    // @route GET api/v1/questions/:id
    // @access private
    getOneQuestion = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        const question = await Question.findById(id).populate("createdBy");
        res.status(200).json({
            status: "success",
            data: question,
            message: "Question fetched successfully",
        });
    });

    // @desc Update questions
    // @route PUT api/v1/questions/:id
    // @access private
    updateQuestion = AsyncHandler(async (req, res) => {
        const { question, optionA, optionB, optionC, optionD, correctAnswer } =
            req?.body;
        const id = req?.params?.id;
        const examFound = await Question.findOne({ question });
        if (examFound) {
            throw new Error("Question has been existed");
        } else {
            const examUpdate = await Question.findByIdAndUpdate(
                id,
                {
                    question,
                    optionA,
                    optionB,
                    optionC,
                    optionD,
                    correctAnswer,
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
                message: "Question updated successfully",
            });
        }
    });
}

module.exports = new questionController();
