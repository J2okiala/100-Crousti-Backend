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
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./database"));
const utilisateur_1 = __importDefault(require("./routes/utilisateur"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
// Déclare ta route d'authentification
app.use("/api", auth_1.default);
// Routes simples
app.get('/', (req, res) => {
    res.send('Hello World! in Typescript Now WITH NPM RUN');
});
app.get('/login', (req, res) => {
    res.send('Connexion réussie');
});
// Routes CRUD
app.use("/utilisateurs", utilisateur_1.default);
// Lancement du serveur
app.listen(port, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
});
// Vérif de la connexion MySQL
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield database_1.default.query("SELECT NOW() as currentTime");
            console.log("✅ Connexion réussie à MySQL !");
            console.log(rows);
        }
        catch (err) {
            console.error("❌ Erreur de connexion :", err);
        }
    });
}
main();
