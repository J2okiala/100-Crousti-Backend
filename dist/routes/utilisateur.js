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
const router = (0, express_1.Router)();
// CREATE - Ajouter un utilisateur
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nom, prenom, email, mot_de_passe, telephone, adresse } = req.body;
        const [result] = yield database_1.default.query("INSERT INTO Utilisateur (nom, prenom, email, mot_de_passe, telephone, adresse) VALUES (?, ?, ?, ?, ?, ?)", [nom, prenom, email, mot_de_passe, telephone, adresse]);
        res.status(201).json({ message: "Utilisateur créé", result });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// READ - Récupérer tous les utilisateurs
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query("SELECT * FROM Utilisateur");
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
        const [rows] = yield database_1.default.query("SELECT * FROM Utilisateur WHERE id_utilisateur = ?", [req.params.id]);
        // On caste ici car pool.query renvoie un type trop générique
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
        const [result] = yield database_1.default.query("UPDATE Utilisateur SET nom=?, prenom=?, email=?, mot_de_passe=?, telephone=?, adresse=? WHERE id_utilisateur=?", [nom, prenom, email, mot_de_passe, telephone, adresse, req.params.id]);
        res.json({ message: "Utilisateur mis à jour", result });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
// DELETE - Supprimer un utilisateur
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield database_1.default.query("DELETE FROM Utilisateur WHERE id_utilisateur = ?", [req.params.id]);
        res.json({ message: "Utilisateur supprimé", result });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
exports.default = router;
