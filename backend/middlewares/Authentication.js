const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = "WENEEDABETTERSECRET"; // Same as in the login route

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user; // Attach the decoded token (userId) to the request object
    return next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
