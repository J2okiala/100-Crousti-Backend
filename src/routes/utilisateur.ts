import { Router, Request, Response } from "express";
import pool from "../database";
import { Utilisateur } from "../models/utilisateur";
import bcrypt from "bcrypt";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

// Appliquer requireAuth à toutes les routes de ce router
router.use(requireAuth);

// CREATE - Ajouter un utilisateur
router.post("/", async (req: AuthRequest, res: Response) => {
    try {
        const { nom, prenom, email, mot_de_passe, telephone, adresse } = req.body;

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        const [result] = await pool.query(
            "INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, telephone, adresse) VALUES (?, ?, ?, ?, ?, ?)",
            [nom, prenom, email, hashedPassword, telephone, adresse]
        );

        res.status(201).json({ message: "Utilisateur créé", result });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// READ - Récupérer tous les utilisateurs
router.get("/", async (_req: AuthRequest, res: Response) => {
    try {
        const [rows] = await pool.query("SELECT * FROM utilisateur");
        const utilisateurs = rows as Utilisateur[];
        res.json(utilisateurs);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// READ - Récupérer un utilisateur par ID
router.get("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM utilisateur WHERE id_utilisateur = ?",
            [req.params.id]
        );

        const utilisateurs = rows as Utilisateur[];
        res.json(utilisateurs[0] || {});
    } catch (error) {
        res.status(500).json({ error });
    }
});

// UPDATE - Modifier un utilisateur
router.put("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const { nom, prenom, email, mot_de_passe, telephone, adresse } = req.body;

        // Hasher le mot de passe s'il est présent
        const hashedPassword = mot_de_passe ? await bcrypt.hash(mot_de_passe, 10) : undefined;

        const [result] = await pool.query(
            "UPDATE utilisateur SET nom=?, prenom=?, email=?, mot_de_passe=COALESCE(?, mot_de_passe), telephone=?, adresse=? WHERE id_utilisateur=?",
            [nom, prenom, email, hashedPassword, telephone, adresse, req.params.id]
        );

        res.json({ message: "Utilisateur mis à jour", result });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// DELETE - Supprimer un utilisateur
router.delete("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const [result] = await pool.query(
            "DELETE FROM utilisateur WHERE id_utilisateur = ?",
            [req.params.id]
        );
        res.json({ message: "Utilisateur supprimé", result });
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
