const prisma = require("../utils/prisma");

const createNewAttribute = async data => {
	const { cream, texture, body, acidity, bitterness, roast, color } = data;
	const dataAttributes = { cream, texture, body, acidity, bitterness, roast, color };

	const newAttribute = await prisma.attribute.create({ data: dataAttributes });
	return newAttribute;
};

module.exports = { createNewAttribute };
