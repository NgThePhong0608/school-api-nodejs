const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const Program = require("../../model/Academic/Program");

class programController {
    // @desc Create program
    // @route POST api/v1/programs/
    // @access private
    createProgram = AsyncHandler(async (req, res) => {
        const { name, description, duration, code } = req?.body;
        const program = await Program.findOne({ name });
        if (program) {
            throw new Error("Program has already existed");
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
                message: "Program created successfully",
            });
        }
    });
    // @desc Get all program
    // @route GET api/v1/programs/
    // @access private
    getPrograms = AsyncHandler(async (req, res) => {
        const programData = await Program.find();
        res.status(200).json({
            length: programData.length,
            status: "success",
            data: programData,
            message: "Program fetched successfully",
        });
    });

    // @desc Get one program
    // @route GET api/v1/programs/:id
    // @access private
    getOneProgram = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        const programData = await Program.findById(id).populate("subjects");
        res.status(200).json({
            status: "success",
            data: programData,
            message: "Program fetched successfully",
        });
    });

    // @desc Update program
    // @route PUT api/v1/programs/:id
    // @access private
    updateProgram = AsyncHandler(async (req, res) => {
        const { name, description, duration, code } = req?.body;
        const id = req?.params?.id;
        const programFound = await Program.findOne({ name });
        if (programFound) {
            throw new Error("Program name has been existed");
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
                message: "Program updated successfully",
            });
        }
    });

    // @desc Delete program
    // @route DELETE api/v1/programs/:id
    // @access private
    deleteProgram = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        await Program.findByIdAndDelete(id);
        res.status(200).json({
            status: "success",
            message: "Program deletedd succesfully",
        });
    });
}

module.exports = new programController();
