require("dotenv").config();
const server = require("./src/app");
const { PORT } = process.env;

const prisma = require("./src/utils/prisma");

const { setAuth } = require("./src/seed/auth.seed");
const { setUsersDB } = require("./src/seed/user.seed");
const { setProducts } = require("./src/seed/products.seed");

server.listen(PORT || 3002, () => {
	prisma.auth
		.findMany()
		.then(e => {
			if (e.length === 0) {
				setAuth()
					.then(e => setUsersDB())
					.then(e => setProducts());
			}
		})
		.catch(error => console.error(error));
	PORT ? console.log(`Listening at port ${PORT}`) : console.log("Listening at port 3002");
});
