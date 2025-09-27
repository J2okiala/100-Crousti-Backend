import express, { Express, Request, Response } from 'express';
import pool from "./database";
import utilisateurRoutes from "./routes/utilisateur";

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes simples
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World! in Typescript Now WITH NPM RUN');
});
app.get('/login', (req: Request, res: Response) => {
    res.send('Connexion réussie');
});

// Routes CRUD
app.use("/utilisateurs", utilisateurRoutes);

// Lancement du serveur
app.listen(port, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
});

// Vérif de la connexion MySQL
async function main() {
    try {
        const [rows] = await pool.query("SELECT NOW() as currentTime");
        console.log("✅ Connexion réussie à MySQL !");
        console.log(rows);
    } catch (err) {
        console.error("❌ Erreur de connexion :", err);
    }
}
main();
