import jwt from "jsonwebtoken";
import config from "../config.js";
function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(404).json({ errors: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    console.log("Invalid token or expired token", error);
    return res.status(404).json({ errors: "Invalid or expired token" });
  }
}
export default adminMiddleware;
