const texture = ["veryFine", "fine", "medium", "coarse", "desertDunes"];
const body = ["light", "perceivable", "medium", "thick", "sirupy"];
const acidity = ["notFound", "light", "perceivable", "fresh", "high"];
const bitterness = ["light", "perceivable", "medium", "high", "veryHigh"];
const roast = ["cinnamon", "light", "city", "fullCity", "dark", "french", "italian"];
const color = ["yellow", "amber", "lightBrown", "hazelnut", "darkBrown", "dark"];

const verifyDataAttributes = data => {
	////valido que la data enviada de attributes exista y que su datatype sea el correcto, si hay un solo error la función retornará true

	if (
		!(data.cream === false || data.cream === true) ||
		typeof data.cream !== "boolean" ||
		!texture.includes(data.texture) ||
		!body.includes(data.body) ||
		!acidity.includes(data.acidity) ||
		!bitterness.includes(data.bitterness) ||
		!roast.includes(data.roast) ||
		!color.includes(data.color)
	)
		return true;
	else return false;
};

module.exports = { verifyDataAttributes };
