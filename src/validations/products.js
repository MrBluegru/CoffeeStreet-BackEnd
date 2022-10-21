const validateName = name => {
	return typeof name !== "string" || name.length < 5 ? false : true;
};

const validateDescription = description => {
	return typeof description !== "string" || description.length < 20 ? false : true;
};

const validatePrice = price => {
	return typeof price !== "number" ? false : true;
};

// const validateCategory = category => {
// 	return (typeof category === "string" && category === "coffee") ||
// 		category === "tea" ||
// 		category === "sweetBakery" ||
// 		category === "saltyBakery" ||
// 		category === "other"
// 		? true
// 		: false;
// };

const validateLactose = lactose => {
	return lactose === true || lactose === false ? true : false;
};

const validateGluten = gluten => {
	return gluten === true || gluten === false ? true : false;
};

const validateAlcohol = alcohol => {
	return alcohol === true || alcohol === false ? true : false;
};

const validateStock = stock => {
	return stock === true || stock === false ? true : false;
};

const validateIngredients = ingredients => {
	return typeof ingredients !== "object" || !ingredients.length ? false : true;
};

const validateOriginCountry = originCountry => {
	return typeof originCountry !== "string" ? false : true;
};

const validateIsPrepared = isPrepared => {
	return isPrepared === true || isPrepared === false ? true : false;
};

const validateState = state => {
	return (typeof state === "string" && state === "active") || state === "inactive" ? true : false;
};

//----------------------------------------- CREATE PRODUCT ---------------------------------------------------//

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
	validateName,
	validateDescription,
	validatePrice,
	validateLactose,
	validateGluten,
	validateAlcohol,
	validateStock,
	validateIngredients,
	validateOriginCountry,
	validateIsPrepared,
	validateState,
	verifyDataProduct,
	verifyCoffePreparedOrBakery,
	verifyCoffeBox,
	verifyCategory,
	verifyIngredients
};
