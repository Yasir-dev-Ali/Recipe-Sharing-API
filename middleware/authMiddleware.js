import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ message: "Authorization Denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
    }
}

export default authMiddleware;
