const bcrypt = require("bcrypt");

const test = async () => {
    const hashAdmin = "$2b$10$aaPmC7ioKkjZh1VRtAAWuOieSLWZmIjNnEn3BePNr002bzANbLoIS";
    const matchAdmin = await bcrypt.compare("admin123", hashAdmin);
    console.log("admin123 matches hashAdmin:", matchAdmin);

    const hashStaff = "$2b$10$bvxyrZCfJKd98POwMZjkc.KQhoPZFJtqKHkD87O5I0vY9UVJPUGvq";
    const matchStaff = await bcrypt.compare("staff123", hashStaff);
    console.log("staff123 matches hashStaff:", matchStaff);
};

test();
