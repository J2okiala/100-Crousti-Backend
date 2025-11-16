"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../database"));
const router = (0, express_1.Router)();
router.post("/auth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, mot_de_passe } = req.body;
    console.log(req.body);
    console.log(email, mot_de_passe);
    if (!email || !mot_de_passe) {
        return res.status(400).json({ message: "Email et mot de passe requis." });
    }
    try {
        const [rows] = yield database_1.default.execute("SELECT id_utilisateur, email, mot_de_passe FROM utilisateur WHERE email = ?", [email]);
        const users = rows;
        if (users.length === 0) {
            return res.status(401).json({ message: "Utilisateur inconnu." });
        }
        const user = users[0];
        const match = yield bcrypt_1.default.compare(mot_de_passe, user.mot_de_passe);
        if (!match) {
            return res.status(401).json({ message: "Mot de passe incorrect." });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id_utilisateur, email: user.email }, process.env.JWT_SECRET || "secretKey", { expiresIn: "24h" });
        return res.json({ token });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
}));
exports.default = router;
