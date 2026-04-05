const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Lire les utilisateurs depuis users.json
function readUsers() {
  return JSON.parse(fs.readFileSync("users.json"));
}

// Écrire dans users.json
function writeUsers(users) {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

// Inscription
app.post("/register", (req, res) => {
  const { username } = req.body;
  if(!username) return res.send("Nom d'utilisateur requis");

  let users = readUsers();
  if(users.find(u => u.username === username))
    return res.send("Utilisateur déjà inscrit");

  users.push({ username, password: null });
  writeUsers(users);
  res.send("Inscription OK, mot de passe à fournir après paiement");
});

// Ajouter mot de passe (toi seulement)
app.post("/setpassword", (req, res) => {
  const { username, password } = req.body;
  let users = readUsers();
  const user = users.find(u => u.username === username);
  if(!user) return res.send("Utilisateur introuvable");

  user.password = password;
  writeUsers(users);
  res.send(`Mot de passe ajouté pour ${username}`);
});

// Connexion
app.post("/login", (req, res) => {
  const { username } = req.body;
  let users = readUsers();
  const user = users.find(u => u.username === username && u.password !== null);
  if(user) res.send("Accès autorisé !");
  else res.send("Accès refusé ! Contacte l'admin");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
