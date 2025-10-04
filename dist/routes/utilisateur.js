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
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Appliquer requireAuth à toutes les routes de ce router
router.use(auth_1.requireAuth);
// CREATE - Ajouter un utilisateur
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nom, prenom, email, mot_de_passe, telephone, adresse } = req.body;
        // Hasher le mot de passe
        const hashedPassword = yield bcrypt_1.default.hash(mot_de_passe, 10);
        const [result] = yield database_1.default.query("INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, telephone, adresse) VALUES (?, ?, ?, ?, ?, ?)", [nom, prenom, email, hashedPassword, telephone, adresse]);
        res.status(201).json({ message: "Utilisateur créé", result });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// READ - Récupérer tous les utilisateurs
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query("SELECT * FROM utilisateur");
        const utilisateurs = rows;
        res.json(utilisateurs);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// READ - Récupérer un utilisateur par ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query("SELECT * FROM utilisateur WHERE id_utilisateur = ?", [req.params.id]);
        const utilisateurs = rows;
        res.json(utilisateurs[0] || {});
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// UPDATE - Modifier un utilisateur
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nom, prenom, email, mot_de_passe, telephone, adresse } = req.body;
        // Hasher le mot de passe s'il est présent
        const hashedPassword = mot_de_passe ? yield bcrypt_1.default.hash(mot_de_passe, 10) : undefined;
        const [result] = yield database_1.default.query("UPDATE utilisateur SET nom=?, prenom=?, email=?, mot_de_passe=COALESCE(?, mot_de_passe), telephone=?, adresse=? WHERE id_utilisateur=?", [nom, prenom, email, hashedPassword, telephone, adresse, req.params.id]);
        res.json({ message: "Utilisateur mis à jour", result });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// DELETE - Supprimer un utilisateur
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield database_1.default.query("DELETE FROM utilisateur WHERE id_utilisateur = ?", [req.params.id]);
        res.json({ message: "Utilisateur supprimé", result });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
exports.default = router;
