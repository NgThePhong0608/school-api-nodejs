const AsyncHandler = require("express-async-handler");
const Subject = require("../../model/Academic/Subject");
const Program = require("../../model/Academic/Program");

class subjectController {
    // @desc Create subject
    // @route POST api/v1/subject/:programId
    // @access private
    createSubject = AsyncHandler(async (req, res) => {
        const { name, description, duration, academicTerm } = req?.body;

        // check program exist
        const programFound = await Program.findById(req?.params?.programId);
        if (!programFound) {
            throw new Error("Program not found");
        }

        // check subject exist
        const subjectFound = await Subject.findOne({ name });
        if (subjectFound) {
            throw new Error("Subject has already existed");
        } else {
            // create
            const subjectCreated = await Subject.create({
                name,
                description,
                duration,
                academicTerm,
                createdBy: req?.userAuth?._id,
            });

            // push to program field
            programFound.subjects.push(subjectCreated._id);
            await programFound.save();

            res.status(201).json({
                status: "success",
                data: subjectCreated,
                message: "Subject created successfully",
            });
        }
    });
    // @desc Get all subject
    // @route GET api/v1/subjects/
    // @access private
    getSubjects = AsyncHandler(async (req, res) => {
        const subjectData = await Subject.find();
        res.status(200).json({
            length: subjectData.length,
            status: "success",
            data: subjectData,
            message: "Subject fetched successfully",
        });
    });

    // @desc Get one subject
    // @route GET api/v1/subject/:id
    // @access private
    getOneSubject = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        const subjectData = await Subject.findById(id);
        res.status(200).json({
            status: "success",
            data: subjectData,
            message: "Subject fetched successfully",
        });
    });

    // @desc Update subject
    // @route PUT api/v1/subject/:id
    // @access private
    updateSubject = AsyncHandler(async (req, res) => {
        const { name, description, duration, academicTerm } = req?.body;
        const id = req?.params?.id;
        const subjectFound = await Subject.findOne({ name });
        if (subjectFound) {
            throw new Error("Subject has been existed");
        } else {
            const subjectUpdate = await Subject.findByIdAndUpdate(
                id,
                {
                    name,
                    description,
                    duration,
                    academicTerm,
                    createdBy: req?.userAuth?._id,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.status(201).json({
                status: "success",
                data: subjectUpdate,
                message: "Subject updated successfully",
            });
        }
    });

    // @desc Delete subject
    // @route DELETE api/v1/subject/:id
    // @access private
    deleteSubject = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        await Subject.findByIdAndDelete(id);
        res.status(200).json({
            status: "success",
            message: "Subject deletedd succesfully",
        });
    });
}

module.exports = new subjectController();
