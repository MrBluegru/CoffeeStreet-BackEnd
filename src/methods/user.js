const prisma = require("../utils/prisma");

const findById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};



const updateUser = async (id, role) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
  });
  return user;
};

module.exports = { findById, updateUser };
