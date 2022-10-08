const prisma = require("../utils/prisma");
const usersData = require("../data/userData");

const setUsersDB = async () => {
  try {
    const auth = await prisma.auth.findMany();

    for (let i = 0; i < auth.length; i++) {
      await prisma.user.create({
        data: { ...usersData[i], idAuth: auth[i].id }
      });
    }

    return { message: "The users have been successfully created" };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { setUsersDB };
