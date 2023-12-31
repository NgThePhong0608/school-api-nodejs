const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const generateToken = require("../../utils/generateToken");
const { hashPassword, isPassMatched } = require("../../utils/helpers");
// const bcrypt = require("bcryptjs");
class adminController {
    // @desc Register admin
    // @route POST api/v1/admins/register
    // @access private
    register = AsyncHandler(async (req, res) => {
        const { name, email, password } = req.body;
        const adminFound = await Admin.findOne({ email });
        if (adminFound) {
            throw new Error("Email already existed !");
        }
        //register
        const admin = await Admin.create({
            name,
            email,
            password: await hashPassword(password),
        });
        res.status(201).json({
            status: "success",
            data: admin,
            message: "Admin registered successfully",
        });
    });

    // @desc Register admin
    // @route POST api/v1/admins/login
    // @access private
    login = AsyncHandler(async (req, res) => {
        const { email, password } = req?.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({
                status: "failed",
                error: "Invalid login credentials",
            });
        }
        const isMatched = await isPassMatched(password, admin.password);

        if (!isMatched) {
            return res
                .status(400)
                .json({ message: "Invalid login credentials" });
        } else {
            return res.status(200).json({
                message: "Admin logged in successfully",
                data: generateToken(admin._id),
                user: admin,
            });
        }
    });

    // @desc Get all admins
    // @route POST api/v1/admins/
    // @access private
    getAllAdmins = AsyncHandler(async (req, res) => {
        res.status(200).json(res.results);
    });

    // @desc Get single admin
    // @route POST api/v1/admins/
    // @access private
    getAdminProfile = AsyncHandler(async (req, res) => {
        const id = req?.userAuth?._id;
        // console.log(id);
        const admin = await Admin.findById(id)
            .select("-updatedAt -createdAt -password")
            .populate(
                "teachers students academicYears academicTerms classLevels programs yearGroups"
            );
        // console.log(admin);
        if (!admin) {
            throw new Error("Admin not found");
        } else {
            res.status(200).json({
                status: "success",
                data: admin,
                message: "Admin profile fetched successfully",
            });
        }
    });

    // @desc Update admin
    // @route PATCH api/v1/admins/update/
    // @access private
    update = AsyncHandler(async (req, res) => {
        const { email, name, password } = req?.body;
        const id = req?.userAuth?._id;
        // console.log(email, name, password);
        const existEmail = await Admin.findOne({ email });

        if (existEmail) {
            throw new Error("Admin has already taken/exist");
        }

        // check if user changes password
        if (password) {
            // hash password
            const admin = await Admin.findByIdAndUpdate(
                id,
                {
                    email,
                    password: await hashPassword(password),
                    name,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.status(200).json({
                status: "success",
                message: "Update admin successfully",
                data: admin,
            });
        } else {
            // update
            const admin = await Admin.findByIdAndUpdate(
                id,
                {
                    email,
                    name,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.status(200).json({
                status: "success",
                message: "Update admin successfully",
                data: admin,
            });
        }
    });

    // @desc Register admin
    // @route POST api/v1/admin/delete/:id
    // @access private
    delete = AsyncHandler(async (req, res) => {
        const id = req?.userAuth?._id;
        const adminFound = await Admin.findById(id);

        if (!adminFound) {
            throw new Error("Admin not found");
        } else {
            // delete
            await Admin.findByIdAndDelete(id);
            res.status(204).json({
                status: "success",
            });
        }
    });
}

module.exports = new adminController();
