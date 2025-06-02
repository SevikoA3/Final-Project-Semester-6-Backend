import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({
      message: "No token provided",
    });
  }

  const parts = authHeader.split(" ");
  const token =
    parts.length === 2 && parts[0] === "Bearer" ? parts[1] : authHeader;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized: Invalid or expired token",
      });
    }
    req.userId = decoded.id;
    next();
  });
};