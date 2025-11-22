import express, { Express, Request, Response } from 'express';
import cors from "cors";
import pool from "./database";
import utilisateurRoutes from "./routes/utilisateur";
import authRoutes from "./routes/auth";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// 🔍 DEBUG: Vérifier les imports
console.log("Type de utilisateurRoutes:", typeof utilisateurRoutes);
console.log("Type de authRoutes:", typeof authRoutes);

// 🔍 DEBUG des requêtes
app.use((req, res, next) => {
    next();
});

// ROUTES
app.use("/api", authRoutes);

app.use("/api/utilisateurs", utilisateurRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`\n Serveur lancé sur http://localhost:${port}`);
    console.log(` Route /api/utilisateurs devrait être accessible`);
});

async function main() {
    try {
        const [rows] = await pool.query("SELECT NOW() as currentTime");
        console.log("\n Connexion réussie à MySQL !");
    } catch (err) {
        console.error(" Erreur de connexion :", err);
    }
}
main();
