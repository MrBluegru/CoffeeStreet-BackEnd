const fs = require("fs");
const path = require("path");

//Borra la carpeta de migration con el comando "npm run prisma-d"

fs.rm("./prisma/migrations", { recursive: true, force: true }, err => {
	if (err) {
		return console.log("Error occurred in deleting directory", err);
	}

	console.log("Migrations directory deleted successfully");
});
