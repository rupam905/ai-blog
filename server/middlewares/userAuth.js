import jwt from "jsonwebtoken";
import User from "../models/User.js";

const userAuth = async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.json({ success: false, message: "Invalid token" });
  }
};

export default userAuth;
