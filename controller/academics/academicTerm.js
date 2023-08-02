const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const AcademicTerm = require("../../model/Academic/AcademicTerm");

class academicTerm {
    // @desc Create academic term
    // @route POST api/v1/academic-terms/
    // @access private
    createAcademicTerm = AsyncHandler(async (req, res) => {
        const { name, description, duration } = req?.body;
        const academicTerm = await AcademicTerm.findOne({ name });
        if (academicTerm) {
            throw new Error("Academic term has already existed");
        } else {
            // create
            const academicTermCreated = await AcademicTerm.create({
                name,
                description,
                duration,
                createdBy: req?.userAuth?._id,
            });
            
            // push to admin field
            const admin = await Admin.findById(req?.userAuth?._id);
            admin.academicTerms.push(academicTermCreated?._id);
            await admin.save();

            res.status(201).json({
                status: "success",
                data: academicTermCreated,
                message: "Academic term created successfully",
            });
        }
    });
    // @desc Get all academic term
    // @route GET api/v1/academic-terms/
    // @access private
    getAcademicTerms = AsyncHandler(async (req, res) => {
        const academicTermData = await AcademicTerm.find();
        res.status(200).json({
            length: academicTermData.length,
            status: "success",
            data: academicTermData,
            message: "Academic term fetched successfully",
        });
    });

    // @desc Get one academic term
    // @route GET api/v1/academic-terms/:id
    // @access private
    getOneAcademicTerm = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        const academicTermData = await AcademicTerm.findById(id);
        res.status(200).json({
            status: "success",
            data: academicTermData,
            message: "Academic term fetched successfully",
        });
    });

    // @desc Update academic term
    // @route PUT api/v1/academic-terms/
    // @access private
    updateAcademicTerm = AsyncHandler(async (req, res) => {
        const { name, description, duration } = req.body;
        const id = req?.params?.id;
        const academicTermFound = await AcademicTerm.findOne({ name });
        if (academicTermFound) {
            throw new Error("Academic term name has been existed");
        } else {
            const academicTermUpdate = await AcademicTerm.findByIdAndUpdate(
                id,
                {
                    name,
                    description,
                    duration,
                    createdBy: req?.userAuth?._id,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.status(201).json({
                status: "success",
                data: academicTermUpdate,
                message: "Academic term updated successfully",
            });
        }
    });

    // @desc Delete academic term
    // @route DELETE api/v1/academic-terms/
    // @access private
    deleteAcademicTerm = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        await AcademicTerm.findByIdAndDelete(id);
        res.status(200).json({
            status: "success",
            message: "Academic term deletedd succesfully",
        });
    });
}

module.exports = new academicTerm();
