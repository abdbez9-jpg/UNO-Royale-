const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const {
  initGame,
  playCard,
  drawCards,
} = require('./gameEngine');

const app = express();
app.use(cors());
app.use(express.json());

// ربط الواجهة
app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// 🟢 بيانات اللعبة
let players = [];
let gameState = null;

// الاتصال
io.on('connection', (socket) => {

  console.log("Player connected:", socket.id);

  // دخول لاعب
  socket.on("join", () => {
    players.push({ id: socket.id });

    io.emit("players", players);

    // بدء اللعبة
    if (!gameState) {
      gameState = initGame(players);
    }

    io.emit("gameState", gameState);
  });

  // سحب كرت
  socket.on("drawCard", () => {
    if (!gameState) return;

    const result = drawCards(gameState, socket.id);
    gameState = result.newState;

    io.emit("gameState", gameState);
  });

  // لعب كرت
  socket.on("playCard", ({ cardId }) => {
    if (!gameState) return;

    const result = playCard(gameState, socket.id, cardId);

    if (result.success) {
      gameState = result.newState;
      io.emit("gameState", gameState);
    }
  });

});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("UNO Royale Server running on port", PORT);
});
