const validateName = name => {
	return !name || typeof name !== "string" ? false : true;
};

const validateDescription = description => {
	return !description || typeof description !== "string" ? false : true;
};

const validateImg = image => {
	return !image || typeof image !== "string" ? false : true;
};

const validatePrice = price => {
	return !price || typeof price !== "number" ? false : true;
};

const validateCategory = category => {
	return (category && (typeof category === "string") & (category === "coffee")) ||
		category === "tea" ||
		category === "sweetBakery" ||
		category === "saltyBakery" ||
		category === "other"
		? true
		: false;
};

//Los que estan realizados de esta forma basicamente plantean: Si EXISTE LACTOSA YY ecumple con que sea un BOOLEANO, entonces retorname TRUE, sino, false

const validateLactose = lactose => {
	return lactose & (lactose === true) || lactose === false ? true : false;
};

//!== true || lactose !== false -   typeof lactose !== Boolean
const validateGluten = gluten => {
	return gluten & (gluten === true) || gluten === false ? true : false;
};

const validateAlcohol = alcohol => {
	return alcohol & (alcohol === true) || alcohol === false ? true : false;
};

const validateStock = stock => {
	return stock & (stock === true) || stock === false ? true : false;
};

const validateIngredients = ingredients => {
	return !ingredients || typeof ingredients !== "object" || !ingredients.length ? false : true;
};

const validateOriginCountry = originCountry => {
	return !originCountry || typeof originCountry !== "string" ? false : true;
};

const validateIsPrepared = isPrepared => {
	return isPrepared & (isPrepared === true) || isPrepared === false ? true : false;
};
// const validateIsPrepared = isPrepared => {
// 	return !isPrepared || isPrepared !== true || isPrepared !== false ? false : true;
// };De esta forma no entiendo porque no entiendo por que no funciona

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
	validateImg,
	validatePrice,
	validateCategory,
	validateLactose,
	validateGluten,
	validateAlcohol,
	validateStock,
	validateIngredients,
	validateOriginCountry,
	validateIsPrepared,
	verifyDataProduct,
	verifyCoffePreparedOrBakery,
	verifyCoffeBox,
	verifyCategory,
	verifyIngredients
};
