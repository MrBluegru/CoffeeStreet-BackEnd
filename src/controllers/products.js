const axios = require("axios");
const prisma = require("../utils/prisma");

const getProducts = async (req, res, next) => {
  try {
    const productsAlrearyInDb = await prisma.Product.findMany();

    if (productsAlrearyInDb.length) return res.status(200).json(productsAlrearyInDb);
    else {
      const fetchingProducts = await axios.get("https://apimocha.com/tea-data/info");

      if (typeof fetchingProducts.data === "object") {
        await prisma.Product.createMany({
          data: fetchingProducts.data
        });

        return res.status(200).json(fetchingProducts.data);
      } else {
        return res.status(404).json({ errorMessage: "Products not found" });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts };
