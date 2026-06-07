import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import Game from "./Game";
import { DS_THEME as C, DS_PAGE_BG } from "./theme";

// ═══════════════════════════════════════════════════════════
//  CONNEXION SOCKET
// ═══════════════════════════════════════════════════════════
const SOCKET_URL = process.env.REACT_APP_SERVER_URL || window.location.origin;
const regionLabel = (region) => region === "Unova" ? "Unys" : (region || "Kanto");

export default function App() {
  const [screen, setScreen] = useState("lobby"); // lobby | game
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerIdx, setPlayerIdx] = useState(0);
  const [saves, setSaves] = useState([]);
  const [serverGameState, setServerGameState] = useState(null);
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingSave, setLoadingSave] = useState(null);

  // ── Connexion Socket.io ──────────────────────────────────
  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

    s.on('connect', () => {
      console.log('✅ Connecté au serveur');
      setConnected(true);
    });

    s.on('disconnect', () => {
      console.log('❌ Déconnecté');
      setConnected(false);
    });

    // État de la room reçu au join
    s.on('room_state', ({ gameState, connectedPlayers, yourPlayerIdx }) => {
      setOnlinePlayers(connectedPlayers || []);
      if (gameState) setServerGameState(gameState);
    });

    // Un autre joueur a fait une action
    s.on('game_state_update', ({ gameState, actionText, fromPlayer, forceSync }) => {
      setServerGameState(gameState);
      if (actionText) {
        addNotif(`🎮 Joueur ${fromPlayer + 1}: ${actionText.slice(0, 50)}...`);
      }
    });

    s.on('player_connected', ({ name, connectedPlayers }) => {
      setOnlinePlayers(connectedPlayers || []);
      addNotif(`✅ ${name} a rejoint la partie !`);
    });

    s.on('player_disconnected', ({ name, connectedPlayers }) => {
      setOnlinePlayers(connectedPlayers || []);
      addNotif(`⚠️ ${name} s'est déconnecté`);
    });

    s.on('chat_message', ({ playerName: pn, message }) => {
      addNotif(`💬 ${pn}: ${message}`);
    });

    s.on('room_error', ({ error }) => {
      addNotif(`⚠️ ${error || "Erreur de partie"}`);
    });

    setSocket(s);
    return () => s.disconnect();
  }, []);

  // ── Charger la liste des sauvegardes ────────────────────
  useEffect(() => {
    if (connected) {
      fetch('/api/saves')
        .then(r => r.json())
        .then(setSaves)
        .catch(() => {});
    }
  }, [connected]);

  const addNotif = useCallback((msg) => {
    const id = Date.now();
    setNotifications(prev => [...prev.slice(-4), { id, msg }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  }, []);

  // ── Rejoindre une room ───────────────────────────────────
  const joinRoom = useCallback((rid, pName, pIdx, existingState) => {
    if (!socket || !rid || !pName) return;
    setRoomId(rid);
    setPlayerName(pName);
    setPlayerIdx(pIdx);
    if (existingState) setServerGameState(existingState);

    socket.emit('join_room', {
      roomId: rid,
      playerName: pName,
      playerIdx: pIdx
    });
    setScreen("game");
  }, [socket]);

  // ── Charger une sauvegarde ───────────────────────────────
  const loadSave = useCallback(async (save) => {
    setLoadingSave(save.roomId);
    try {
      const res = await fetch(`/api/saves/${save.roomId}`);
      const data = await res.json();
      const pIdx = 0; // hôte = joueur 0
      joinRoom(save.roomId, playerName || save.players[0] || "Dresseur", pIdx, data.gameState);
    } catch(e) {
      addNotif("❌ Erreur chargement sauvegarde");
    }
    setLoadingSave(null);
  }, [joinRoom, playerName, addNotif]);

  // ── Supprimer une sauvegarde ─────────────────────────────
  const deleteSave = useCallback(async (rid) => {
    await fetch(`/api/saves/${rid}`, { method: 'DELETE' });
    setSaves(prev => prev.filter(s => s.roomId !== rid));
    addNotif("🗑️ Sauvegarde supprimée");
  }, [addNotif]);

  // ── Callbacks pour le jeu ───────────────────────────────
  const onGameStateChange = useCallback((gameState, actionText) => {
    if (!socket || !roomId) return;
    socket.emit('game_action', { roomId, gameState, actionText });
  }, [socket, roomId]);

  const onForceSync = useCallback((gameState) => {
    if (!socket || !roomId) return;
    socket.emit('force_sync', { roomId, gameState });
  }, [socket, roomId]);

  const onNewGame = useCallback((gameState) => {
    if (!socket || !roomId) return;
    socket.emit('new_game', { roomId, gameState });
  }, [socket, roomId]);

  // ══════════════════════════════════════════════════════════
  //  LOBBY SCREEN
  // ══════════════════════════════════════════════════════════
  if (screen === "lobby") {
    return (
      <LobbyScreen
        connected={connected}
        saves={saves}
        loadingSave={loadingSave}
        onJoin={joinRoom}
        onLoadSave={loadSave}
        onDeleteSave={deleteSave}
        notifications={notifications}
      />
    );
  }

  // ══════════════════════════════════════════════════════════
  //  GAME SCREEN
  // ══════════════════════════════════════════════════════════
  return (
    <div style={{ width:"100vw", height:"100vh", position:"relative" }}>
      {/* Indicateurs online */}
      <div style={{ position:"fixed", top:8, right:8, zIndex:999, display:"flex", gap:6, alignItems:"center", background:"rgba(255,255,255,0.92)", border:`2px solid ${C.border}`, borderRadius:999, padding:"5px 9px", boxShadow:"0 3px 0 rgba(47,95,168,0.16)" }}>
        <div style={{ fontSize:8, color: connected ? C.green : C.red, fontFamily:"'Press Start 2P',monospace" }}>
          {connected ? "🟢 EN LIGNE" : "🔴 HORS LIGNE"}
        </div>
        <div style={{ fontSize:8, color:C.dim, fontFamily:"'Press Start 2P',monospace" }}>
          #{roomId}
        </div>
        <div style={{ fontSize:8, color:C.acc2, fontFamily:"'Press Start 2P',monospace" }}>
          👥 {onlinePlayers.length}
        </div>
      </div>

      {/* Notifications */}
      <div style={{ position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)", zIndex:999, display:"flex", flexDirection:"column", gap:4, alignItems:"center" }}>
        {notifications.map(n => (
          <div key={n.id} style={{ background:"#ffffff", border:`2px solid ${C.border}`, color:C.text, fontSize:10, padding:"8px 13px", borderRadius:12, opacity:0.98, maxWidth:340, textAlign:"center", boxShadow:"0 4px 0 rgba(47,95,168,0.16)" }}>
            {n.msg}
          </div>
        ))}
      </div>

      {/* Le jeu complet */}
      <Game
        initialGameState={serverGameState}
        myPlayerIdx={playerIdx}
        playerName={playerName}
        roomId={roomId}
        onGameStateChange={onGameStateChange}
        onForceSync={onForceSync}
        onNewGame={onNewGame}
        onBackToLobby={() => setScreen("lobby")}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  LOBBY SCREEN COMPONENT
// ══════════════════════════════════════════════════════════
function LobbyScreen({ connected, saves, loadingSave, onJoin, onLoadSave, onDeleteSave, notifications }) {
  const [tab, setTab] = useState("new"); // new | load | join
  const [pName, setPName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [pIdx, setPIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lobbyBg = DS_PAGE_BG;
  const inp = {
    width:"100%", padding:"10px 12px",
    background:"#ffffff", border:`2px solid rgba(47,95,168,0.35)`,
    color:C.text, fontFamily:"'Press Start 2P',monospace",
    fontSize:10, outline:"none", borderRadius:10, marginBottom:8,
    boxSizing:"border-box", boxShadow:"inset 0 2px rgba(47,95,168,0.08)"
  };
  const tabBtn = (t) => ({
    flex:1, padding:"11px 6px", background: tab===t ? "#f4ead2" : "#ffffff",
    border: tab===t ? `3px solid ${C.acc}` : `2px solid rgba(47,95,168,0.24)`,
    color: tab===t ? C.border : C.dim,
    fontFamily:"'Press Start 2P',monospace", fontSize:8, cursor:"pointer",
    borderRadius:10, boxShadow:tab===t?"0 3px 0 rgba(47,95,168,0.16)":"none"
  });
  const bigBtn = (col=C.acc) => ({
    width:"100%", padding:"13px", background:col==="green"?"#e7f2e8":col==="red"?"#f3e5e2":"#f4ead2",
    border:`2px solid ${col==="green"?C.green:col==="red"?C.red:C.acc}`,
    color:col==="green"?C.green:col==="red"?C.red:C.border,
    fontFamily:"'Press Start 2P',monospace", fontSize:9, cursor:"pointer",
    marginTop:4, borderRadius:12, boxShadow:"0 3px 0 rgba(36,54,79,0.14)"
  });

  return (
    <div style={{ width:"100vw", height:"100vh", background:lobbyBg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:16 }}>
      {/* Titre */}
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:22, color:C.acc, textShadow:`2px 2px 0 rgba(79,103,146,0.42)`, marginBottom:8 }}>
          ⚡ PokéWorld
        </div>
        <div style={{ fontSize:9, color:C.border, fontFamily:"'Press Start 2P',monospace", background:"rgba(255,255,255,0.75)", border:`2px solid ${C.border}`, borderRadius:999, padding:"7px 12px" }}>MMORPG — Gen I à VI</div>
        <div style={{ fontSize:8, color: connected ? C.green : C.red, fontFamily:"'Press Start 2P',monospace", marginTop:10, background:"#ffffff", border:`2px solid ${connected ? C.green : C.red}`, borderRadius:999, padding:"6px 10px" }}>
          {connected ? "🟢 Serveur connecté" : "🔴 Connexion..."}
        </div>
      </div>

      {/* Panel */}
      <div style={{ width:"100%", maxWidth:440, background:C.panel, border:`3px solid ${C.border}`, borderRadius:18, overflow:"hidden", boxShadow:"0 8px 0 rgba(47,95,168,0.18),0 22px 45px rgba(23,54,91,0.24)" }}>
        {/* Tabs */}
        <div style={{ display:"flex", gap:6, padding:8, borderBottom:`3px solid ${C.border}`, background:C.panel2 }}>
          <button style={tabBtn("new")} onClick={()=>setTab("new")}>Nouvelle</button>
          <button style={tabBtn("join")} onClick={()=>setTab("join")}>Rejoindre</button>
          <button style={tabBtn("load")} onClick={()=>setTab("load")}>Charger ({saves.length})</button>
        </div>

        <div style={{ padding:16 }}>

          {/* ── NOUVELLE PARTIE ─────────────────────────── */}
          {tab==="new" && <>
            <div style={{ fontSize:8, color:C.dim, fontFamily:"'Press Start 2P',monospace", marginBottom:8 }}>TON NOM</div>
            <input style={inp} placeholder="Ex: Jordan" value={pName} onChange={e=>setPName(e.target.value)} maxLength={16}/>

            <div style={{ fontSize:8, color:C.dim, fontFamily:"'Press Start 2P',monospace", marginBottom:8 }}>CODE DE PARTIE</div>
            <div style={{ display:"flex", gap:8, marginBottom:8 }}>
              <input style={{...inp, marginBottom:0, flex:1}} placeholder="Ex: ABC123" value={roomCode} onChange={e=>setRoomCode(e.target.value.toUpperCase())} maxLength={8}/>
              <button onClick={generateCode} style={{ padding:"0 12px", background:"#f4ead2", border:`2px solid ${C.acc}`, color:C.border, fontFamily:"'Press Start 2P',monospace", fontSize:7, cursor:"pointer", borderRadius:10, whiteSpace:"nowrap", boxShadow:"0 3px 0 rgba(36,54,79,0.12)" }}>
                🎲 Générer
              </button>
            </div>

            {roomCode && (
              <div style={{ background:"#f7efd9", border:`2px solid ${C.acc}`, borderRadius:12, padding:"9px 12px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 3px 0 rgba(36,54,79,0.10)" }}>
                <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:11, color:C.acc, letterSpacing:2 }}>{roomCode}</span>
                <button onClick={copyCode} style={{ background:"transparent", border:"none", color:copied?C.green:C.dim, fontFamily:"'Press Start 2P',monospace", fontSize:7, cursor:"pointer" }}>
                  {copied?"✅ Copié !":"📋 Copier"}
                </button>
              </div>
            )}

            <div style={{ fontSize:7, color:C.dim, marginBottom:12, lineHeight:1.6 }}>
              Envoie ce code à tes amis pour qu'ils rejoignent ta partie !
            </div>

            <button
              style={bigBtn()}
              disabled={!pName || !roomCode || !connected}
              onClick={() => onJoin(roomCode, pName, 0, null)}
            >
              ▶ CRÉER LA PARTIE
            </button>
          </>}

          {/* ── REJOINDRE ───────────────────────────────── */}
          {tab==="join" && <>
            <div style={{ fontSize:8, color:C.dim, fontFamily:"'Press Start 2P',monospace", marginBottom:8 }}>TON NOM</div>
            <input style={inp} placeholder="Ex: Raphaël" value={pName} onChange={e=>setPName(e.target.value)} maxLength={16}/>

            <div style={{ fontSize:8, color:C.dim, fontFamily:"'Press Start 2P',monospace", marginBottom:8 }}>CODE DE LA PARTIE</div>
            <input style={inp} placeholder="Ex: ABC123" value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} maxLength={8}/>

            <div style={{ fontSize:8, color:C.dim, fontFamily:"'Press Start 2P',monospace", marginBottom:8 }}>TON NUMÉRO DE JOUEUR</div>
            <div style={{ display:"flex", gap:6, marginBottom:12 }}>
              {[0,1,2,3,4].map(i => (
                <button key={i} onClick={()=>setPIdx(i)} style={{
                  flex:1, padding:"8px 0", background: pIdx===i ? "#f4ead2" : "#ffffff",
                  border:`2px solid ${pIdx===i?C.acc:C.border}`, color: pIdx===i?C.acc:C.dim,
                  fontFamily:"'Press Start 2P',monospace", fontSize:8, cursor:"pointer", borderRadius:10,
                  boxShadow:pIdx===i?"0 3px 0 rgba(47,95,168,0.16)":"none"
                }}>J{i+1}</button>
              ))}
            </div>

            <div style={{ fontSize:7, color:C.dim, marginBottom:12, lineHeight:1.6 }}>
              Jordan = J1, Raphaël = J2, Maxime = J3, etc.
            </div>

            <button
              style={bigBtn("green")}
              disabled={!pName || !joinCode || !connected}
              onClick={() => onJoin(joinCode, pName, pIdx, null)}
            >
              ▶ REJOINDRE LA PARTIE
            </button>
          </>}

          {/* ── CHARGER ─────────────────────────────────── */}
          {tab==="load" && <>
            {saves.length === 0 ? (
              <div style={{ textAlign:"center", padding:20, color:C.dim, fontFamily:"'Press Start 2P',monospace", fontSize:8, lineHeight:1.8 }}>
                Aucune sauvegarde.<br/>Crée une nouvelle partie !
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:320, overflowY:"auto" }}>
                <div style={{ fontSize:8, color:C.dim, fontFamily:"'Press Start 2P',monospace", marginBottom:4 }}>TON NOM POUR CETTE PARTIE</div>
                <input style={inp} placeholder="Ex: Jordan" value={pName} onChange={e=>setPName(e.target.value)} maxLength={16}/>
                {saves.map(save => (
                  <div key={save.roomId} style={{ background:"#ffffff", border:`2px solid rgba(47,95,168,0.24)`, borderRadius:12, padding:12, boxShadow:"0 3px 0 rgba(47,95,168,0.12)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <div>
                        <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:9, color:C.acc, marginBottom:4 }}>
                          #{save.roomId}
                        </div>
                        <div style={{ fontSize:8, color:C.text }}>
                          👥 {save.players.join(", ")}
                        </div>
                        <div style={{ fontSize:7, color:C.dim, marginTop:3 }}>
                          🌍 {regionLabel(save.region)} · {new Date(save.lastSaved).toLocaleDateString('fr-FR')} {new Date(save.lastSaved).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
                        </div>
                      </div>
                      <button onClick={()=>onDeleteSave(save.roomId)} style={{ background:"transparent", border:`1px solid ${C.red}`, color:C.red, padding:"4px 8px", fontFamily:"'Press Start 2P',monospace", fontSize:7, cursor:"pointer", borderRadius:3 }}>
                        🗑️
                      </button>
                    </div>
                    <button
                      style={{ ...bigBtn("green"), marginTop:4 }}
                      disabled={loadingSave === save.roomId || !pName}
                      onClick={() => onLoadSave(save)}
                    >
                      {loadingSave === save.roomId ? "⏳ Chargement..." : "▶ CONTINUER"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>}
        </div>
      </div>

      {/* Notifications */}
      <div style={{ position:"fixed", bottom:16, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", gap:4, alignItems:"center" }}>
        {notifications.map(n => (
          <div key={n.id} style={{ background:"#ffffff", border:`2px solid ${C.border}`, color:C.text, fontSize:9, padding:"7px 14px", borderRadius:12, boxShadow:"0 4px 0 rgba(47,95,168,0.16)" }}>
            {n.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
