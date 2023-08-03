const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const ClassLevel = require("../../model/Academic/ClassLevel");

class classLevel {
    // @desc Create class level
    // @route POST api/v1/class-levels/
    // @access private
    createClassLevel = AsyncHandler(async (req, res) => {
        const { name, description } = req?.body;
        const classLevel = await ClassLevel.findOne({ name });
        if (classLevel) {
            throw new Error("Class level has already existed");
        } else {
            // create
            const classLevelCreated = await ClassLevel.create({
                name,
                description,
                createdBy: req?.userAuth?._id,
            });

            // push to admin field
            const admin = await Admin.findById(req?.userAuth?._id);
            admin.classLevels.push(classLevelCreated?._id);
            await admin.save();

            res.status(201).json({
                status: "success",
                data: classLevelCreated,
                message: "Class level created successfully",
            });
        }
    });
    // @desc Get all class level
    // @route GET api/v1/class-levels/
    // @access private
    getClassLevels = AsyncHandler(async (req, res) => {
        const classLevelData = await ClassLevel.find();
        res.status(200).json({
            length: classLevelData.length,
            status: "success",
            data: classLevelData,
            message: "Class level fetched successfully",
        });
    });

    // @desc Get one class level
    // @route GET api/v1/class-levels/:id
    // @access private
    getOneClassLevel = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        const classLevelData = await ClassLevel.findById(id);
        res.status(200).json({
            status: "success",
            data: classLevelData,
            message: "Class level fetched successfully",
        });
    });

    // @desc Update class level
    // @route PUT api/v1/class-levels/:id
    // @access private
    updateClassLevel = AsyncHandler(async (req, res) => {
        const { name, description } = req.body;
        const id = req?.params?.id;
        const classLevelFound = await ClassLevel.findOne({ name });
        if (classLevelFound) {
            throw new Error("Class level name has been existed");
        } else {
            const classLevelUpdate = await ClassLevel.findByIdAndUpdate(
                id,
                {
                    name,
                    description,
                    createdBy: req?.userAuth?._id,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.status(201).json({
                status: "success",
                data: classLevelUpdate,
                message: "Class level updated successfully",
            });
        }
    });

    // @desc Delete class level
    // @route DELETE api/v1/class-levels/:id
    // @access private
    deleteClassLevel = AsyncHandler(async (req, res) => {
        const id = req?.params?.id;
        await ClassLevel.findByIdAndDelete(id);
        res.status(200).json({
            status: "success",
            message: "Class level deletedd succesfully",
        });
    });
}

module.exports = new classLevel();
