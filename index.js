require("dotenv").config();
const { PORT } = process.env;
const server = require("./src/app");
// const prisma = require("./src/utils/prisma");

server.listen(PORT, () => {
  // prisma();
  console.log(`Listening at ${PORT} `);
});
