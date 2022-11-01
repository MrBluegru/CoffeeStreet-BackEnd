const verifyTitle = title => {
	return typeof title !== "string" || title.length < 10;
};

const verifyImage = image => {
	return (
		image.length < 5 ||
		typeof image !== "string" ||
		(!/.gif$/.test(image) &&
			!/.png$/.test(image) &&
			!/.jpg$/.test(image) &&
			!/.jpeg$/.test(image) &&
			!/.webp$/.test(image) &&
			!/.svg$/.test(image) &&
			!/.tif$/.test(image))
	);
};

const verifyDescription = description => {
	return typeof description !== "string" || description.length < 20;
};

const verifyParagraph = paragraph => {
	return typeof paragraph !== "string" || paragraph.length < 40;
};

module.exports = { verifyTitle, verifyImage, verifyDescription, verifyParagraph };
