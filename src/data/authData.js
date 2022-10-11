const bcrypt = require("bcrypt");

const authFunction = async () => {
	const hashedPass = await bcrypt.hash("12345", 10);

	const authData = [
		{ email: "admin@gmail.com", password: hashedPass },
		{ email: "francesco@gmail.com", password: hashedPass },
		{ email: "aaron@gmail.com", password: hashedPass },
		{ email: "sherman@gmail.com", password: hashedPass },
		{ email: "leola@gmail.com", password: hashedPass },
		{ email: "sister@gmail.com", password: hashedPass },
		{ email: "ali@gmail.com", password: hashedPass },
		{ email: "leslie@gmail.com", password: hashedPass },
		{ email: "chris@gmail.com", password: hashedPass },
		{ email: "antonina@gmail.com", password: hashedPass },
		{ email: "mario@gmail.com", password: hashedPass },
		{ email: "donald@gmail.com", password: hashedPass },
		{ email: "andy@gmail.com", password: hashedPass },
		{ email: "marjolaine@gmail.com", password: hashedPass },
		{ email: "shaylee@gmail.com", password: hashedPass },
		{ email: "brisa@gmail.com", password: hashedPass },
		{ email: "patience@gmail.com", password: hashedPass },
		{ email: "lera@gmail.com", password: hashedPass },
		{ email: "brionna@gmail.com", password: hashedPass },
		{ email: "lonny@gmail.com", password: hashedPass }
	];

	return authData;
};

module.exports = authFunction;
