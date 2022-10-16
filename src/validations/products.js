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
	validateIsPrepared
};
