const jwt = require("jsonwebtoken");

const authToken = async (req, res, next) => {
  try {
    let { authorization } = req.headers;

    const token = authorization.split(" ")[1];

    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) return res.sendStatus(403);
      req.body = user;
      next();
    });
  } catch (error) {
    res.status(400).send({ error });
  }
};

module.exports = { authToken };
