const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// ═══════════════════════════════════════════════════════════
//  SYSTÈME DE SAUVEGARDE
// ═══════════════════════════════════════════════════════════
const SAVES_DIR = path.join(__dirname, '../saves');
if (!fs.existsSync(SAVES_DIR)) fs.mkdirSync(SAVES_DIR, { recursive: true });

function saveGame(roomId, gameState) {
  try {
    const filePath = path.join(SAVES_DIR, `${roomId}.json`);
    fs.writeFileSync(filePath, JSON.stringify({
      roomId,
      gameState,
      lastSaved: new Date().toISOString()
    }, null, 2));
    return true;
  } catch(e) {
    console.error('Erreur sauvegarde:', e);
    return false;
  }
}

function loadGame(roomId) {
  try {
    const filePath = path.join(SAVES_DIR, `${roomId}.json`);
    if (!fs.existsSync(filePath)) return null;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data;
  } catch(e) {
    console.error('Erreur chargement:', e);
    return null;
  }
}

function listSaves() {
  try {
    return fs.readdirSync(SAVES_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const data = JSON.parse(fs.readFileSync(path.join(SAVES_DIR, f), 'utf8'));
        return {
          roomId: data.roomId,
          lastSaved: data.lastSaved,
          players: data.gameState?.players?.map(p => p.name) || [],
          region: data.gameState?.players?.[0]?.region || 'Kanto'
        };
      })
      .sort((a, b) => new Date(b.lastSaved) - new Date(a.lastSaved));
  } catch(e) {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════
//  ROOMS (parties en cours)
// ═══════════════════════════════════════════════════════════
const rooms = new Map();
// rooms[roomId] = { gameState, players: Map(socketId -> {name, playerIdx}) }

function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      gameState: null,
      connectedPlayers: new Map(), // socketId -> { name, playerIdx, connected }
      hostSocketId: null
    });
  }
  return rooms.get(roomId);
}

// ═══════════════════════════════════════════════════════════
//  API REST
// ═══════════════════════════════════════════════════════════

// Lister les sauvegardes
app.get('/api/saves', (req, res) => {
  res.json(listSaves());
});

// Charger une sauvegarde
app.get('/api/saves/:roomId', (req, res) => {
  const save = loadGame(req.params.roomId);
  if (!save) return res.status(404).json({ error: 'Sauvegarde non trouvée' });
  res.json(save);
});

// Supprimer une sauvegarde
app.delete('/api/saves/:roomId', (req, res) => {
  try {
    const filePath = path.join(SAVES_DIR, `${req.params.roomId}.json`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Fallback React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// ═══════════════════════════════════════════════════════════
//  SOCKET.IO — Multijoueur temps réel
// ═══════════════════════════════════════════════════════════
io.on('connection', (socket) => {
  console.log(`✅ Connexion: ${socket.id}`);
  let currentRoomId = null;
  let currentPlayerIdx = null;

  // ── Rejoindre ou créer une room ─────────────────────────
  socket.on('join_room', ({ roomId, playerName, playerIdx }) => {
    currentRoomId = roomId;
    currentPlayerIdx = playerIdx;
    socket.join(roomId);

    const room = getOrCreateRoom(roomId);

    // Charger la sauvegarde si la room est vide
    if (!room.gameState) {
      const save = loadGame(roomId);
      if (save) {
        room.gameState = save.gameState;
        console.log(`📂 Sauvegarde chargée: ${roomId}`);
      }
    }

    // Enregistrer ce joueur dans la room
    room.connectedPlayers.set(socket.id, {
      name: playerName,
      playerIdx,
      connected: true
    });

    if (!room.hostSocketId) room.hostSocketId = socket.id;

    console.log(`🎮 ${playerName} rejoint la room ${roomId} (joueur ${playerIdx})`);

    // Envoyer l'état actuel au joueur qui vient de rejoindre
    socket.emit('room_state', {
      gameState: room.gameState,
      connectedPlayers: Array.from(room.connectedPlayers.values()),
      yourPlayerIdx: playerIdx
    });

    // Notifier les autres
    socket.to(roomId).emit('player_connected', {
      name: playerName,
      playerIdx,
      connectedPlayers: Array.from(room.connectedPlayers.values())
    });
  });

  // ── Nouvelle partie ─────────────────────────────────────
  socket.on('new_game', ({ roomId, gameState }) => {
    const room = getOrCreateRoom(roomId);
    room.gameState = gameState;
    saveGame(roomId, gameState);

    io.to(roomId).emit('game_state_update', {
      gameState,
      action: 'new_game',
      fromPlayer: currentPlayerIdx
    });
    console.log(`🆕 Nouvelle partie: ${roomId}`);
  });

  // ── Mise à jour de l'état du jeu ────────────────────────
  socket.on('game_action', ({ roomId, gameState, actionText, msgLog }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.gameState = gameState;

    // Auto-save toutes les actions
    saveGame(roomId, gameState);

    // Diffuser à tous les autres joueurs de la room
    socket.to(roomId).emit('game_state_update', {
      gameState,
      actionText,
      msgLog,
      fromPlayer: currentPlayerIdx
    });
  });

  // ── Sync forcée (ex: après combat) ──────────────────────
  socket.on('force_sync', ({ roomId, gameState }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    room.gameState = gameState;
    saveGame(roomId, gameState);
    io.to(roomId).emit('game_state_update', {
      gameState,
      fromPlayer: currentPlayerIdx,
      forceSync: true
    });
  });

  // ── Message chat entre joueurs ───────────────────────────
  socket.on('chat_message', ({ roomId, playerName, message }) => {
    io.to(roomId).emit('chat_message', {
      playerName,
      message,
      timestamp: new Date().toISOString()
    });
  });

  // ── Déconnexion ─────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`❌ Déconnexion: ${socket.id}`);
    if (!currentRoomId) return;

    const room = rooms.get(currentRoomId);
    if (!room) return;

    const player = room.connectedPlayers.get(socket.id);
    if (player) {
      player.connected = false;
      room.connectedPlayers.delete(socket.id);

      io.to(currentRoomId).emit('player_disconnected', {
        name: player.name,
        playerIdx: player.playerIdx,
        connectedPlayers: Array.from(room.connectedPlayers.values())
      });
    }

    // Nettoyer la room si vide
    if (room.connectedPlayers.size === 0) {
      // Garder la room en mémoire 5min puis nettoyer
      setTimeout(() => {
        if (rooms.get(currentRoomId)?.connectedPlayers.size === 0) {
          rooms.delete(currentRoomId);
          console.log(`🗑️ Room ${currentRoomId} nettoyée`);
        }
      }, 5 * 60 * 1000);
    }
  });
});

// ═══════════════════════════════════════════════════════════
//  DÉMARRAGE
// ═══════════════════════════════════════════════════════════
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🎮 PokeWorld Server                  ║
║   Port: ${PORT}                           ║
║   Sauvegardes: ./saves/                ║
║   http://localhost:${PORT}                ║
╚════════════════════════════════════════╝
  `);
});
