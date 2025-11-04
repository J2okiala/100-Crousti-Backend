import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../database";

const router = Router();

router.post("/auth", async (req: Request, res: Response) => {
    const { email, mot_de_passe } = req.body;
    console.log(req.body)
    console.log(email, mot_de_passe)
    if (!email || !mot_de_passe) {
        return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    try {
        const [rows] = await pool.execute(
            "SELECT id_utilisateur, email, mot_de_passe FROM utilisateur WHERE email = ?",
            [email]
        );
        const users = rows as any[];

        if (users.length === 0) {
            return res.status(401).json({ message: "Utilisateur inconnu." });
        }

        const user = users[0];
        const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

        if (!match) {
            return res.status(401).json({ message: "Mot de passe incorrect." });
        }

        const token = jwt.sign(
            { id: user.id_utilisateur, email: user.email },
            process.env.JWT_SECRET || "secretKey",
            { expiresIn: "24h" }
        );

        return res.json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
});

export default router;
