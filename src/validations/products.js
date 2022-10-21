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

const categories = ["coffee", "tea", "sweetBakery", "saltyBakery", "other"];

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
	verifyDataProduct,
	verifyCoffePreparedOrBakery,
	verifyCoffeBox,
	verifyCategory,
	verifyIngredients
};
