"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
// Fonction pour vérifier et décoder le JWT
const verifyJwt = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
// Middleware pour protéger les routes
const requireAuth = (req, res, next) => {
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
    }
    catch (err) {
        return res.status(403).json({ message: "Forbidden : Token invalide ou expiré" });
    }
};
exports.requireAuth = requireAuth;
