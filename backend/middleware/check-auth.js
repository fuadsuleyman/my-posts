const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // we get token from header, split and don`t take barrer word
    const token = req.headers.authorization.split(" ")[1];
    // second argument is secret word from where we create token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" })
  }
}
