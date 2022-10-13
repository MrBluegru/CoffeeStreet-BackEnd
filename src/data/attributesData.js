const axios = require("axios");

const getAttributesFromApi = async () => {
	const { data } = await axios.get("https://apimocha.com/cafebolsa/attributes");
	return data;
};

module.exports = { getAttributesFromApi };
