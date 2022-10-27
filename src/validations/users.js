// update user validations
const verifyData = data => {
	if (!data.name && !data.surname && !data.image) {
		return true;
	}
};
// que no sea vacio

const verifyDatatypes = data => {
	return typeof data.name !== "string" || typeof data.surname !== "string" || typeof data.image !== "string";
};

const verifyNameLength = data => {
	return data.name.length > 12;
};

const verifySurnameLength = data => {
	return data.surname.length > 15;
};

module.exports = {
	verifyData,
	verifyDatatypes,
	verifyNameLength,
	verifySurnameLength
};
