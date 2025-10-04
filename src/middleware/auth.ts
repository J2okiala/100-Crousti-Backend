import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Fonction pour vérifier et décoder le JWT
const verifyJwt = <T = object>(token: string): T => {
    return jwt.verify(token, JWT_SECRET) as T;
};

// Extension de la requête pour inclure l'utilisateur décodé
export interface AuthRequest extends Request {
    user?: any;
}

// Middleware pour protéger les routes
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token invalide" });
    }

    try {
        const payload = verifyJwt(token);
        req.user = payload; // stocke les infos du token dans la requête
        next(); // passe à la route suivante
    } catch (err) {
        return res.status(403).json({ message: "Forbidden : Token invalide ou expiré" });
    }
};
