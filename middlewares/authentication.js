const { verifyToken } = require('../utils/jwt')
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers["token"]
    
    const decodedToken = verifyToken(token);
    
    const user = await User.findOne({ 
        where: { 
            id: decodedToken.id 
        } 
    });
    
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

module.exports = { authentication }