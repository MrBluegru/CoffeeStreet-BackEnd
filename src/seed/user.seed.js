const prisma = require("../utils/prisma");
const usersData = require("../data/userData");

const setUsersDB = async () => {
  const auth = await prisma.auth.findMany();
  try {
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
