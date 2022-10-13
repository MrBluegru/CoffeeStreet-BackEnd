const axios = require("axios");

const getProductsFromApi = async () => {
	const { data } = await axios.get("https://apimocha.com/coffee-street/products");
	return data;
};

module.exports = { getProductsFromApi };
