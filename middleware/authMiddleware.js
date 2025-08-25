const jwt = require("jsonwebtoken");

// Middleware to protect routes
module.exports = (req, res, next) => {
  // Get token from headers
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Token comes as "Bearer <token>", so split it
  const token = authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "Token format is invalid" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded info to req
    next(); // proceed to next middleware/route
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
