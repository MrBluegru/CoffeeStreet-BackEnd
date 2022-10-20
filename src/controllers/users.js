const prisma = require("../utils/prisma");
const authMethod = require("../methods/auth");
const usersMethod = require("../methods/users");
const productsMethods = require("../methods/products");

const getUsers = async (req, res, next) => {
	const { email } = req.body;

	try {
		if (email) {
			const auth = await authMethod.emailVerify(email);
			if (!auth) return res.status(400).json({ errorMessage: "This email is not registered" });
			const user = await usersMethod.findByIdAuth(auth.id);
			if (!user) return res.status(404).json({ errorMessage: "No user found" });
			else return res.status(200).json({ user });
			// } else {
			// 	const users = await usersMethod.findAll();

			// 	if (users) return res.status(200).json(users);
			// 	else return res.status(404).json({ errorMessage: "Users Not Found" });
		}
	} catch (error) {
		next(error);
	}
};

const getUserById = async (req, res, next) => {
	const { id } = req.params;

	try {
		const user = await usersMethod.findById(id);
		if (!user || user.state === "inactive")
			return res.status(404).json({ errorMessage: "There is no user with that id" });
		else return res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

const getUserFavourites = async (req, res, next) => {
	const { id } = req.params;

	try {
		const doesUserExist = await usersMethod.findById(id);

		if (doesUserExist) {
			const favouritesProductsByUser = await prisma.favourite_Product.findMany({
				where: {
					idUser: id
				},
				select: {
					idProduct: true
				}
			});

			if (favouritesProductsByUser.length) {
				const idProductsArray = favouritesProductsByUser.map(favProduct => favProduct.idProduct);

				const favProductsByUser = [];
				for (let i = 0; i < idProductsArray.length; i++) {
					const favProduct = await productsMethods.findById(idProductsArray[i]);
					if (favProduct.state === "active") favProductsByUser.push(favProduct);
					else continue;
				}

				favProductsByUser.length
					? res.status(200).json(favProductsByUser)
					: res.status(200).json({
							errorMessage: `${doesUserExist.name} ${doesUserExist.surname} does not have favourites. There is nothing to show`
					  });
			} else
				return res.status(200).json({
					errorMessage: `${doesUserExist.name} ${doesUserExist.surname} does not have favourites. There is nothing to show`
				});
		} else return res.status(404).json({ errorMessage: "There is no user with that id" });
	} catch (error) {
		next(error);
	}
};

const addUserFavourites = async (req, res, next) => {
	const { id } = req.params;
	const { idProduct } = req.body;

	try {
		const doesUserExist = await usersMethod.findById(id);

		if (doesUserExist) {
			if (!idProduct) return res.status(404).json({ errorMessage: "No idProduct was given" });
			if (typeof idProduct !== "string")
				return res.status(400).json({ errorMessage: "The idProduct must be a string" });

			const doesProductExist = await productsMethods.findById(idProduct);

			if (doesProductExist && doesProductExist?.state === "active") {
				const favProductsByUser = await prisma.favourite_Product.findMany({
					where: {
						idUser: id
					},
					select: {
						idProduct: true
					}
				});

				const productAlreadyInFavs = favProductsByUser.find(favProduct => favProduct.idProduct === idProduct);

				if (productAlreadyInFavs)
					return res.status(200).json({
						errorMessage: `'${doesProductExist.name}' is already in ${doesUserExist.name} ${doesUserExist.surname}'s favourites`
					});
				else {
					await prisma.favourite_Product.create({
						data: {
							idUser: id,
							idProduct
						}
					});

					return res.status(200).json({
						message: `'${doesProductExist.name}' added to ${doesUserExist.name} ${doesUserExist.surname}'s favourites`
					});
				}
			} else return res.status(404).json({ errorMessage: "There is no product with that id" });
		} else return res.status(404).json({ errorMessage: "There is no user with that id" });
	} catch (error) {
		next(error);
	}
};

const deleteUserFavourites = async (req, res, next) => {
	const { id } = req.params;
	const { idProduct } = req.body;

	try {
		const doesUserExist = await usersMethod.findById(id);

		if (doesUserExist) {
			if (!idProduct) return res.status(404).json({ errorMessage: "No idProduct was given" });
			if (typeof idProduct !== "string")
				return res.status(400).json({ errorMessage: "The idProduct must be a string" });

			const doesProductExist = await productsMethods.findById(idProduct);

			if (doesProductExist && doesProductExist?.state === "active") {
				const productsInUserFavs = await prisma.favourite_Product.findMany({
					where: {
						idUser: id
					},
					select: {
						idProduct: true
					}
				});

				if (productsInUserFavs.length) {
					const idProductsInUserFavs = productsInUserFavs.map(favProduct => favProduct.idProduct);
					let productToDelete;
					for (const idProductInFavs of idProductsInUserFavs) {
						if (idProductInFavs === idProduct) {
							productToDelete = await prisma.favourite_Product.deleteMany({
								where: {
									idUser: id,
									idProduct
								}
							});
						} else continue;
					}

					productToDelete
						? res.status(200).json({
								message: `'${doesProductExist.name}' deleted from ${doesUserExist.name} ${doesUserExist.surname}'s favourites`
						  })
						: res.status(200).json({
								errorMessage: `'${doesProductExist.name}' has already been deleted from ${doesUserExist.name} ${doesUserExist.surname}'s favourites`
						  });
				} else
					return res.status(200).json({
						errorMessage: `${doesUserExist.name} ${doesUserExist.surname} does not have favourites. There is nothing to delete`
					});
			} else return res.status(404).json({ errorMessage: "There is no product with that id" });
		} else return res.status(404).json({ errorMessage: "There is no user with that id" });
	} catch (error) {
		next(error);
	}
};

const updateRole = async (req, res, next) => {
	const { id } = req.params;
	const { role } = req.body;

	try {
		const userFound = await usersMethod.findById(id);
		if (!userFound) return res.status(400).json({ errorMessage: "This user doesn't exist" });
		if (role === "admin" || role === "employee" || role === "client") {
			const all = await usersMethod.findAll();
			const isAdmin = all.filter(el => el.role === "admin");
			if (isAdmin.length === 1) {
				const isOk = all.find(el => el.id === id && el.role !== "admin");
				if (!isOk) return res.status(400).json({ errorMessage: "There must be at least one Admin" });
			}
			const updated = await usersMethod.updateRole(id, role);
			return res.status(200).json(updated);
		} else return res.status(400).json({ errorMessage: "The role must be admin, employee or client" });
	} catch (error) {
		next(error);
	}
};

const deleteUser = async (req, res, next) => {
	const { email } = req.body;

	try {
		if (email) {
			const userFound = await authMethod.emailVerify(email);
			if (userFound) {
				const user = await usersMethod.findByIdAuth(userFound.id);
				if (user) {
					const userToDelete = await usersMethod.logicDeleteUser(user.id);
					return res
						.status(200)
						.json({ message: `'${userToDelete.name} ${userToDelete.surname}' deleted successfully from the DB` });
				} else return res.status(404).json({ errorMessage: "This user is not authenticated" });
			} else return res.status(404).json({ errorMessage: "There is not a valid email" });
		} else return res.status(400).json({ errorMessage: "Please enter an email" });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getUsers,
	getUserById,
	getUserFavourites,
	addUserFavourites,
	deleteUserFavourites,
	updateRole,
	deleteUser
};
