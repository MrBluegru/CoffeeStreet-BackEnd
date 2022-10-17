require("dotenv").config();
const server = require("./src/app");
const { PORT } = process.env;
const cron = require("node-cron");

const prisma = require("./src/utils/prisma");

const { setAuth } = require("./src/seed/auth.seed");
const { setUsersDB } = require("./src/seed/user.seed");
const { setProductsDB } = require("./src/seed/products.seed");

server.listen(PORT || 3002, () => {
	prisma.auth
		.findMany()
		.then(e => {
			if (e.length === 0) {
				setAuth()
					.then(e => setUsersDB())
					.then(e => setProductsDB());
			}
		})
		.catch(error => console.error(error));
	PORT ? console.log(`Listening at port ${PORT}`) : console.log("Listening at port 3002");
});

//Se programó eliminar los refreshTokens almacenados que correspondan al mes anterior, comparado a la fecha
//cuando se levante el servidor

const clearRefreshTable = async () => {
	const month = new Date().getMonth() + 1;
	const allRefreshTokens = await prisma.refresh.findMany();
	const oldTokens = allRefreshTokens.filter(e => month > e.createdAt.getMonth() + 1);
	oldTokens.map(async e => {
		await prisma.refresh.delete({ where: { id: e.id } });
	});
};

cron.schedule(`0 0 * * *`, async () => {
	clearRefreshTable();
});
