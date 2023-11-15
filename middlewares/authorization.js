const { User } = require("../models");

const authorization = async (req, res, next) => {
  try {
    const userId = req.userData.id;
    const { id } = req.params;
    console.log(id);
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userId !== user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { authorization }