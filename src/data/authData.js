const bcrypt = require("bcrypt");

const authFunction = async () => {
  const hashedPass = await bcrypt.hash("12345", 10);

  const AuthData = [
    { email: "admin@gmail.com", password: hashedPass },
    { email: "boris@gmail.com", password: hashedPass },
    { email: "alan@gmail.com", password: hashedPass }
  ];

  return AuthData;
};

module.exports = authFunction;
