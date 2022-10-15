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

const verifyName = async data => {
	const nameUnique = await prisma.product.findUnique({
		// verifico que el producto nuevo a crear no tenga un nombre que ya está en la base de datos
		where: {
			name: data.name
		}
	});
	return nameUnique;
};

const verifyDataProduct = data => {
	////valido que la data enviada del product a crear exista y que su datatype sea el correcto, si hay un solo error la función retornará true
	if (
		!data.name ||
		typeof data.name !== "string" ||
		data.name.length < 5 ||
		!data.description ||
		typeof data.description !== "string" ||
		data.description < 20 ||
		!data.image ||
		typeof data.image !== "string" ||
		!data.price ||
		typeof data.price !== "number" ||
		!(data.isPrepared === false || data.isPrepared === true)
	)
		return true;
};

const categories = ["coffee", "tea", "sweetBakery", "saltyBakery"];

const verifyCategory = data => {
	return !data.category || typeof data.category !== "string" || !categories.some(e => e === data.category);
};

const verifyCoffePreparedOrBakery = data => {
	return (
		!(data.lactose === false || data.lactose === true) ||
		!(data.gluten === false || data.gluten === true) ||
		!(data.alcohol === false || data.alcohol === true)
	);
};

const verifyCoffeBox = data => {
	return !data.originCountry || typeof data.originCountry !== "string" || data.originCountry.length < 3;
};

const verifyIngredients = data => {
	//verifico que todos los ingredientes sean de tipo string, si hay alguno que no lo es, ésta función retornará true
	return (
		!data.ingredients ||
		typeof data.ingredients !== "object" ||
		!data.ingredients.length ||
		data.ingredients.some(e => typeof e !== "string")
	);
};

module.exports = {
	findById,
	createNewProduct,
	verifyDataProduct,
	verifyCoffePreparedOrBakery,
	verifyCoffeBox,
	verifyCategory,
	verifyName,
	verifyIngredients,
	getAll
};
