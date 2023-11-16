const { verifyToken } = require("../utils/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers["token"];
    // console.log("tokennya :", token);

    const decodedToken = verifyToken(token);
    // console.log("ini decode token : ", decodedToken);

    const user = await User.findOne({
      where: {
        id: decodedToken.id,
      },
    });

    // console.log("ini usernya ", user);
    if (!user) {
      return res.status(401).json({ message: "Auth failed" });
    }

    req.userData = {
      id: user.id,
    };

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Auth failed" });
  }
};

module.exports = { authentication };
