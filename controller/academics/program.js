const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const Program = require("../../model/Academic/Program");

class programController {
    // @desc Create academic term
    // @route POST api/v1/academic-terms/
    // @access private
    createProgram = AsyncHandler(async (req, res) => {
        const { name, description, duration, code } = req?.body;
        const program = await Program.findOne({ name });
        if (program) {
            throw new Error("Class level has already existed");
        } else {
            // create
            const programCreated = await Program.create({
                name,
                description,
                duration,
                code,
                createdBy: req?.userAuth?._id,
            });

            // push to admin field
            const admin = await Admin.findById(req?.userAuth?._id);
            admin.programs.push(programCreated?._id);
            await admin.save();

            res.status(201).json({
                status: "success",
                data: programCreated,
                message: "Class level created successfully",
            });
        }
    });
    // @desc Get all academic term
    // @route GET api/v1/academic-terms/
    // @access private
    getPrograms = AsyncHandler(async (req, res) => {
        const programData = await Program.find();
        res.status(200).json({
            length: programData.length,
            status: "success",
            data: programData,
            message: "Class level fetched successfully",
        });
    });

    // @desc Get one academic term
    // @route GET api/v1/academic-terms/:id
    // @access private
    getOneProgram = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        const programData = await Program.findById(id);
        res.status(200).json({
            status: "success",
            data: programData,
            message: "Class level fetched successfully",
        });
    });

    // @desc Update academic term
    // @route PUT api/v1/academic-terms/
    // @access private
    updateProgram = AsyncHandler(async (req, res) => {
        const { name, description, duration, code } = req?.body;
        const id = req?.params?.id;
        const programFound = await Program.findOne({ name });
        if (programFound) {
            throw new Error("Class level name has been existed");
        } else {
            const programUpdate = await Program.findByIdAndUpdate(
                id,
                {
                    name,
                    description,
                    duration,
                    code,
                    createdBy: req?.userAuth?._id,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.status(201).json({
                status: "success",
                data: programUpdate,
                message: "Class level updated successfully",
            });
        }
    });

    // @desc Delete academic term
    // @route DELETE api/v1/academic-terms/
    // @access private
    deleteProgram = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        await Program.findByIdAndDelete(id);
        res.status(200).json({
            status: "success",
            message: "Class level deletedd succesfully",
        });
    });
}

module.exports = new programController();
