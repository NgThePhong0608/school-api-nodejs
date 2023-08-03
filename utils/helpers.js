const bcrypt = require("bcryptjs");
//hash password

exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(15);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

exports.isPassMatched = async (password, hash) => {
    const isMatched = await bcrypt.compare(password, hash);
    return isMatched;
};
