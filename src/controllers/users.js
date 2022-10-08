const authMethods = require("../methods/auth");

const getUser = async (req, res, next) => {
  const email = req.body.email;

  try {
    const user = await authMethods.emailVerify(email);

    if (!user) {
      return res.status(400).json({ error: "This email doesn't exist" });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getUser };
