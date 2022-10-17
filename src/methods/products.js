const prisma = require("../utils/prisma");

const getAll = async () => {
	const products = await prisma.product.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			image: true,
			price: true,
			category: true,
			lactose: true,
			gluten: true,
			alcohol: true,
			stock: true,
			ingredients: true,
			originCountry: true,
			isPrepared: true,
			idDiscount: true,
			attribute: true, // preguntar a front si lo necesitan, sino, para eliminar este campo
			state: true
		}
	});
	return products;
};

const findById = async id => {
	const product = await prisma.product.findUnique({
		where: {
			id
		},
		select: {
			name: true,
			description: true,
			image: true,
			price: true,
			category: true,
			lactose: true,
			gluten: true,
			alcohol: true,
			stock: true,
			ingredients: true,
			originCountry: true,
			isPrepared: true,
			idDiscount: true,
			attribute: true
		}
	});
	return product;
};

const verifyName = async data => {
	const nameUnique = await prisma.product.findUnique({
		// verifico que el producto nuevo a crear no tenga un nombre que ya está en la base de datos
		where: {
			name: data.name
		}
	});
	return nameUnique;
};

const createNewProduct = async data => {
	//se crea el nuevo producto
	const {
		name,
		description,
		image,
		price,
		category,
		lactose,
		gluten,
		alcohol,
		ingredients,
		originCountry,
		isPrepared,
		idAttribute
	} = data;
	const newProduct = {
		name,
		description,
		image,
		price,
		category,
		lactose,
		gluten,
		alcohol,
		ingredients,
		originCountry,
		isPrepared,
		idAttribute
	};

	return await prisma.product.create({ data: newProduct });
};

module.exports = {
	findById,
	createNewProduct,
	getAll,
	verifyName
};
