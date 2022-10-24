const prisma = require("../utils/prisma");

const createNewAttribute = async data => {
	const { cream, texture, body, acidity, bitterness, roast, color } = data;
	const dataAttributes = { cream, texture, body, acidity, bitterness, roast, color };

	const newAttribute = await prisma.attribute.create({ data: dataAttributes });
	return newAttribute;
};

const updateAttribute = async (data, id) => {
	const { cream, texture, body, acidity, bitterness, roast, color } = data;
	const dataAttributes = { cream, texture, body, acidity, bitterness, roast, color };
	console.log(dataAttributes);
	const newAttribute = await prisma.attribute.update({ where: { id }, data:  dataAttributes  });
	return newAttribute;
};

module.exports = { createNewAttribute, updateAttribute };
