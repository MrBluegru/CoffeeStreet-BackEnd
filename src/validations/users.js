// update user validations
const verifyDataName = data => {
	if (!data.name || !data.surname || !data.image) {
		return true;
	}
};

const verifyDatatype = data => {
	if (typeof data.name !== "string" || typeof data.surname !== "string" || typeof data.image !== "string") {
		return true;
	}
};

const verifyName = data => {
	if (typeof data.name !== "string" && data.name.length > 12) {
		return true;
	} else if (data.name.length > 7) {
		return "namelength";
	} else {
		return false;
	}
};

const verifySurname = data => {
	if (data.surname.length > 10) {
		return "surnamelength";
	}
};

module.exports = { verifyDataName, verifyName, verifyDatatype, verifySurname };
