const mongoose = require("mongoose");
const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log("DB Connected Succesfully ");
    } catch (error) {
        console.log("DB Connected Fail ", error.message);
    }
};

module.exports = dbConnect;
