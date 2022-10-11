const axios = require("axios");

const getSweetBakery = async () => {
	const { data } = await axios.get("https://6340e6e5d1fcddf69cbf57f4.mockapi.io/api/products");

	data.map(e => {
		delete e.id;
		delete e.originCountry;
	});

	return data;
};

const getTes = async () => {
	const { data } = await axios.get("https://apimocha.com/tea-data/info");
	return data;
};

module.exports = {
	getSweetBakery,
	getTes
};
