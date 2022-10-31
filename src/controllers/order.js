const prisma = require("../utils/prisma");

const changeStatus = async (req, res, next) => {
	const { id } = req.params;
	const { statusDelivery } = req.body;

	try {
		const foundOrder = await prisma.order.findUnique({
			where: {
				id
			}
		});
		if (!foundOrder) return res.status(404).json({ errorMessage: "There is no order with that id" });
		if (statusDelivery !== "pending" && statusDelivery !== "complete")
			return res.status(400).json({ errorMessage: "Please enter a valid statusDelivery" });
		if (statusDelivery === foundOrder.statusDelivery)
			return res.status(400).json({ errorMessage: "Please enter a different statusDelivery" });
		const updatedStatus = await prisma.order.update({
			where: {
				id
			},
			data: {
				statusDelivery
			}
		});
		return res
			.status(200)
			.json({ message: `The statusDelivery has been updated successfully to '${statusDelivery}'`, updatedStatus });
	} catch (error) {
		next(error);
	}
};

module.exports = { changeStatus };
