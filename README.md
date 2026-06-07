# 🎮 PokeWorld MMORPG — Guide d'installation

## Ce dont tu as besoin
- Node.js 24 LTS (nodejs.org)
- Un compte Railway (railway.app) — gratuit

---

## ÉTAPE 1 — Préparer le projet

Ouvre l'**Invite de commandes** (cmd) et tape ces commandes une par une :

```
cd Desktop
mkdir PokeWorld
cd PokeWorld
```

Copie ensuite le dossier `pokeworld` que tu as téléchargé dans ce dossier.

---

## ÉTAPE 2 — Installer les dépendances

Dans l'invite de commandes, depuis le dossier `pokeworld` :

```
npm install
cd client
npm install
npm run build
cd ..
```

⏳ Attends que tout se termine (2-3 minutes).

---

## ÉTAPE 3 — Tester en local

```
npm start
```

Ouvre **http://localhost:3001** dans ton navigateur.
Tu dois voir l'écran de lobby de PokeWorld. ✅

---

## ÉTAPE 4 — Mettre en ligne sur Railway

### 4a — Créer un compte Railway
1. Va sur **railway.app**
2. Clique "Start a New Project"
3. Connecte-toi avec GitHub (crée un compte GitHub si tu n'en as pas)

### 4b — Déployer
1. Dans Railway, clique **"New Project"**
2. Choisis **"Deploy from GitHub repo"**
3. Si ton projet n'est pas là, clique "Configure GitHub App" et sélectionne ton repo
4. Railway détecte automatiquement Node.js et déploie

### 4c — Récupérer l'URL
1. Dans Railway, va dans ton projet
2. Clique sur **"Settings"** → **"Domains"**
3. Clique **"Generate Domain"**
4. Tu obtiens une URL genre : `pokeworld-production.up.railway.app`

**C'est cette URL que tu envoies à tes amis !** 🎉

---

## ÉTAPE 5 — Jouer avec tes amis

### Toi (hôte) :
1. Ouvre l'URL
2. Clique **"Nouvelle partie"**
3. Entre ton nom (ex: Jordan)
4. Génère un code (ex: ABC123)
5. **Envoie ce code à tes amis**
6. Lance la partie

### Tes amis :
1. Ouvrent la même URL
2. Cliquent **"Rejoindre"**
3. Entrent leur nom
4. Entrent le code que tu leur as envoyé
5. Choisissent leur numéro de joueur (J2, J3, J4...)
6. Cliquent "Rejoindre la partie"

---

## Les sauvegardes

Les sauvegardes sont automatiques après chaque action.
Elles sont stockées dans le dossier `saves/` sur le serveur.
Pour reprendre une partie : onglet **"Charger"** → entre ton nom → "Continuer"

---

## Problèmes courants

**"npm n'est pas reconnu"** → Node.js n'est pas installé. Va sur nodejs.org.

**"Port 3001 déjà utilisé"** → Tape `set PORT=3002 && npm start`

**L'URL Railway ne fonctionne pas** → Attends 2-3 minutes, Railway est en train de builder.

---

## Variables d'environnement Railway (optionnel)

Si tu veux personnaliser le port :
- Dans Railway → Variables → Ajouter `PORT` = `3001`

---

*Bon jeu ! ⚡*
