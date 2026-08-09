import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
}

export function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}

export function isAhliGizi(req, res, next) {
  if (req.user.role !== "ahli_gizi") {
    return res.status(403).json({ message: "Ahli Gizi only" });
  }
  next();
}

export function isAhliGiziOrAdmin(req, res, next) {
  if (req.user.role !== "ahli_gizi" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Ahli Gizi or Admin only" });
  }
  next();
}