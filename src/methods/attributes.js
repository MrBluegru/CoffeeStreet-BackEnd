const prisma = require("../utils/prisma");

const texture = ["veryFine", "fine", "medium", "coarse", "desertDunes"];
const body = ["light", "perceivable", "medium", "thick", "sirupy"];
const acidity = ["notFound", "light", "perceivable", "fresh", "high"];
const bitterness = ["light", "perceivable", "medium", "high", "veryHigh"];
const roast = ["cinnamon", "light", "city", "fullcity", "dark", "french", "italian"];
const color = ["yellow", "amber", "lightBrown", "hazelnut", "darkBrown", "dark"];

const verifyDataAttributes = async data => {
	console.log(data.cream);
	console.log(texture.includes(data.texture));
	if (
		!data.cream ||
		typeof data.cream !== "boolean" ||
		!texture.includes(data.texture) ||
		!body.includes(data.body) ||
		!acidity.includes(data.acidity) ||
		!bitterness.includes(data.bitterness) ||
		!roast.includes(data.roast) ||
		!color.includes(data.color)
	)
		return true;
};

const createNewAttribute = async data => {
	const { cream, texture, body, acidity, bitterness, roast, color } = data;
	const dataAttributes = { cream, texture, body, acidity, bitterness, roast, color };
	return await prisma.attribute.create({ data: dataAttributes });
};

module.exports = {
	verifyDataAttributes,
	createNewAttribute
};
