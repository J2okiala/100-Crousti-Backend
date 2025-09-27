import { Router } from "express";
import pool from "../database";
import { Utilisateur } from "../models/utilisateur";  // 👈 import de l’interface
import { log } from "console";

const router = Router();

// CREATE - Ajouter un utilisateur
router.post("/", async (req, res) => {
    try {
        const { nom, prenom, email, mot_de_passe, telephone, adresse } = req.body;
        const [result] = await pool.query(
        "INSERT INTO Utilisateur (nom, prenom, email, mot_de_passe, telephone, adresse) VALUES (?, ?, ?, ?, ?, ?)",
        [nom, prenom, email, mot_de_passe, telephone, adresse]
        );
        res.status(201).json({ message: "Utilisateur créé", result });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// READ - Récupérer tous les utilisateurs
router.get("/", async (_req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Utilisateur");
        const utilisateurs = rows as Utilisateur[];
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// READ - Récupérer un utilisateur par ID
router.get("/:id", async (req, res) => {
    console.log("Hello");
    
    try {
        const [rows] = await pool.query(
            "SELECT * FROM Utilisateur WHERE id_utilisateur = ?",
            [req.params.id]
        );

        // On caste ici car pool.query renvoie un type trop générique
        const utilisateurs = rows as Utilisateur[];

        res.json(utilisateurs[0] || {});
    } catch (error) {
        res.status(500).json({ error });
    }
});

// UPDATE - Modifier un utilisateur
router.put("/:id", async (req, res) => {
    try {
        const { nom, prenom, email, mot_de_passe, telephone, adresse } = req.body;
        const [result] = await pool.query(
        "UPDATE Utilisateur SET nom=?, prenom=?, email=?, mot_de_passe=?, telephone=?, adresse=? WHERE id_utilisateur=?",
        [nom, prenom, email, mot_de_passe, telephone, adresse, req.params.id]
        );
        res.json({ message: "Utilisateur mis à jour", result });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// DELETE - Supprimer un utilisateur
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM Utilisateur WHERE id_utilisateur = ?", [req.params.id]);
        res.json({ message: "Utilisateur supprimé", result });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
