require("dotenv").config();
const { PORT } = process.env;
const server = require("./src/app");

const { setUsersDB } = require("./src/seed/user.seed");
const { setAuth } = require("./src/seed/auth.seed");

const prisma = require("./src/utils/prisma");

server.listen(PORT || 3001, () => {
  prisma.auth
    .findMany()
    .then(e => {
      if (e.length === 0) {
        setAuth().then(e => setUsersDB());
      }
    })
    .catch(error => console.error(error));
  console.log(`Listening at 3001 or ${PORT} `);
});
