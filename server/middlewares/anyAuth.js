import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Accepts either an admin token (Authorization header) or a user token
// (x-auth-token header). Used for endpoints both roles need, like requesting
// upload credentials, without duplicating the endpoint per role.
const anyAuth = async (req, res, next) => {
  const adminToken = req.headers.authorization;
  if (adminToken) {
    try {
      const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
      if (decoded.email === process.env.ADMIN_EMAIL) return next();
    } catch {
      // fall through to user token check
    }
  }

  const userToken = req.headers["x-auth-token"];
  if (userToken) {
    try {
      const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        return next();
      }
    } catch {
      // falls through to the rejection below
    }
  }

  res.json({ success: false, message: "Invalid token" });
};

export default anyAuth;
