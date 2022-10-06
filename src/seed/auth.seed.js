const prisma = require("../utils/prisma");
const authFunction = require("../data/authData");

const setAuth = async () => {
  const array = await authFunction();
  try {
    const auth = await prisma.auth.createMany({ data: array });

    return { message: "The auth table has been successfully created" };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { setAuth };
