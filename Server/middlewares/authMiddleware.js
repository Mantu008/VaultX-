import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ message: "Access Denied" });
    next();
};

// Optional – attach user if token exists, but don't block request
export const attachUserIfExists = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        // ignore token errors for public routes
    }

    next();
};