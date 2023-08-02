const AsyncHandler = require("express-async-handler");
const AcademicYear = require("../../model/Academic/AcademicYear");
const Admin = require("../../model/Staff/Admin");

class academicYear {
    // @desc Create academic year
    // @route POST api/v1/academic-years/
    // @access private
    createAcademicYear = AsyncHandler(async (req, res) => {
        const { name, fromYear, toYear } = req.body;
        const academicYear = await AcademicYear.findOne({ name });
        if (academicYear) {
            throw new Error("Academic year has already existed");
        } else {
            // create
            const academicYearCreated = await AcademicYear.create({
                name,
                fromYear,
                toYear,
                createdBy: req?.userAuth?._id,
            });

            // push to admin field
            const admin = await Admin.findById(req?.userAuth?._id);
            admin.academicYears.push(academicYearCreated?._id);
            await admin.save();

            res.status(201).json({
                status: "success",
                data: academicYearCreated,
                message: "Academic Year created successfully",
            });
        }
    });
    // @desc Get all academic year
    // @route GET api/v1/academic-years/
    // @access private
    getAcademicYears = AsyncHandler(async (req, res) => {
        const academicYearData = await AcademicYear.find();
        res.status(200).json({
            length: academicYearData.length,
            status: "success",
            data: academicYearData,
            message: "Academic Year fetched successfully",
        });
    });

    // @desc Get one academic year
    // @route GET api/v1/academic-years/:id
    // @access private
    getOneAcademicYear = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        const academicYearData = await AcademicYear.findById(id);
        res.status(200).json({
            status: "success",
            data: academicYearData,
            message: "Academic Year fetched successfully",
        });
    });

    // @desc Update academic year
    // @route PUT api/v1/academic-years/
    // @access private
    updateAcademicYear = AsyncHandler(async (req, res) => {
        const { name, fromYear, toYear } = req.body;
        const id = req?.params?.id;
        const academicYearFound = await AcademicYear.findOne({ name });
        if (academicYearFound) {
            throw new Error("Academic year name has been existed");
        } else {
            const academicYearUpdate = await AcademicYear.findByIdAndUpdate(
                id,
                {
                    name,
                    fromYear,
                    toYear,
                    createdBy: req?.userAuth?._id,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.status(201).json({
                status: "success",
                data: academicYearUpdate,
                message: "Academic Year updated successfully",
            });
        }
    });

    // @desc Delete academic year
    // @route DELETE api/v1/academic-years/
    // @access private
    deleteAcademicYear = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        await AcademicYear.findByIdAndDelete(id);
        res.status(200).json({
            status: "success",
            message: "Academic year deletedd succesfully",
        });
    });
}

module.exports = new academicYear();
