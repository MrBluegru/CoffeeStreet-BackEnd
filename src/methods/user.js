const prisma = require("../utils/prisma");

const findById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};



const updateUser = async (id, name, surname, role) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
			name,
			surname,
      role,
    },
  });
  return user;
};

module.exports = { findById, updateUser };
