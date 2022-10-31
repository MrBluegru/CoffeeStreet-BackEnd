const verifyTitle = title => {
	return typeof title !== "string" || title.length < 7;
};

const verifyImage = image => {
	const imageExtension = image => {
		const test = [".gif", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".psd", ".bmp", ".tif", ".jfif"];
		return test.some(e => image.includes(e));
	};
	return image.length < 5 || typeof image !== "string" || !imageExtension(image);
};

const verifyDescription = description => {
	return typeof description !== "string" || title.length < 15;
};

const verifyParagraph = paragraph => {
	return typeof paragraph !== "string" || paragraph.length < 30;
};

module.exports = { verifyTitle, verifyImage, verifyDescription, verifyParagraph };
