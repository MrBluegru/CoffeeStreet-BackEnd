const prisma = require("../utils/prisma");

const findById = async id => {
	const product = await prisma.product.findUnique({
		where: {
			id
		}
	});
	return product;
};

const create = async data => {
	return await prisma.product.create({ data });
};

const verifyName = async data => {
	const nameUnique = await prisma.product.findUnique({
		where: {
			name: data.name
		}
	});
	return nameUnique;
};

const verifyDataCreate = async data => {
	if (
		!data.name ||
		typeof data.name !== "string" ||
		!data.description ||
		typeof data.description !== "string" ||
		!data.image ||
		typeof data.image !== "string" ||
		!data.price ||
		typeof data.price !== "number" ||
		!data.category ||
		typeof data.category !== "string" ||
		!(data.lactose === false || data.lactose === true) ||
		!(data.gluten === false || data.gluten === true) ||
		!(data.alcohol === false || data.alcohol === true) ||
		!data.ingredients ||
		typeof data.ingredients !== "object" ||
		!data.ingredients.length
	)
		return true;
};

const verifyIngredients = async data => {
	return data.ingredients.some(e => typeof e !== "string");
};

module.exports = { findById, create, verifyDataCreate, verifyName, verifyIngredients };
