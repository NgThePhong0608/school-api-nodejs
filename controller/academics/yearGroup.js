const AsyncHandler = require("express-async-handler");
const YearGroup = require("../../model/Academic/YearGroup");
const Admin = require("../../model/Staff/Admin");

class yearGroupController {
    // @desc Create year group
    // @route POST api/v1/year-groups/
    // @access private
    createYearGroup = AsyncHandler(async (req, res) => {
        const { name, academicYear } = req?.body;
        const admin = await Admin.findById(req?.userAuth?._id);
        if (!admin) {
            throw new Error("Admin not found");
        }
        // check program exist
        const yearGroup = await YearGroup.findOne({ name });
        if (yearGroup) {
            throw new Error("Year group has already existed");
        } else {
            // create
            const yearGroupCreated = await YearGroup.create({
                name,
                academicYear,
                createdBy: req?.userAuth?._id,
            });

            // push to admin field
            admin.yearGroups.push(yearGroupCreated?._id);
            await admin.save();

            res.status(201).json({
                status: "success",
                data: yearGroupCreated,
                message: "Year group created successfully",
            });
        }
    });
    // @desc Get all year group
    // @route GET api/v1/year-groups/
    // @access private
    getYearGroups = AsyncHandler(async (req, res) => {
        const yearGroupData = await YearGroup.find();
        res.status(200).json({
            length: yearGroupData.length,
            status: "success",
            data: yearGroupData,
            message: "Year group fetched successfully",
        });
    });

    // @desc Get one year group
    // @route GET api/v1/year-groups/:id
    // @access private
    getOneYearGroup = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        const yearGroupData = await YearGroup.findById(id);
        res.status(200).json({
            status: "success",
            data: yearGroupData,
            message: "Year group fetched successfully",
        });
    });

    // @desc Update year group
    // @route PUT api/v1/year-groups/:id
    // @access private
    updateYearGroup = AsyncHandler(async (req, res) => {
        const { name, academicYear } = req?.body;
        const id = req?.params?.id;
        const yearGroupFound = await YearGroup.findOne({ name });
        if (yearGroupFound) {
            throw new Error("Year group has been existed");
        } else {
            const yearGroupUpdate = await YearGroup.findByIdAndUpdate(
                id,
                {
                    name,
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
                data: yearGroupUpdate,
                message: "Year group updated successfully",
            });
        }
    });

    // @desc Delete year group
    // @route DELETE api/v1/year-groups/:id
    // @access private
    deleteYearGroup = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        await YearGroup.findByIdAndDelete(id);
        res.status(200).json({
            status: "success",
            message: "Year group deletedd succesfully",
        });
    });
}

module.exports = new yearGroupController();
