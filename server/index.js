const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const {
  initGame,
  playCard,
  drawCards,
} = require('./gameEngine');

const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');

// ربط ملف الواجهة
app.use(express.static(path.join(__dirname, '../client')));

// عند الدخول للرابط الرئيسي يعرض index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const rooms = {};

// إنشاء غرفة
app.post('/api/rooms', (req, res) => {
  const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

  rooms[roomId] = {
    id: roomId,
    players: [],
    gameState: null,
  };

  res.json({ roomId });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // دخول غرفة
  socket.on('joinRoom', ({ roomId, playerName }) => {
    const room = rooms[roomId];

    if (!room) {
      socket.emit('error', { message: 'الغرفة غير موجودة' });
      return;
    }

    if (room.players.length >= 10) {
      socket.emit('error', { message: 'الغرفة ممتلئة' });
      return;
    }

    const playerId = uuidv4();

    const player = {
      id: playerId,
      name: playerName,
      socketId: socket.id,
    };

    room.players.push(player);
    socket.join(roomId);

    socket.emit('joinedRoom', { playerId, roomId });

    io.to(roomId).emit('players', room.players);
  });

  // بدء اللعبة
  socket.on('startGame', () => {
    const roomId = socket.data?.roomId;
    const room = rooms[roomId];
    if (!room) return;

    if (room.players.length < 2) return;

    room.gameState = initGame(room.players);

    io.to(roomId).emit('gameStarted', room.gameState);
  });

  // لعب كرت
  socket.on('playCard', ({ roomId, playerId, cardId }) => {
    const room = rooms[roomId];
    if (!room || !room.gameState) return;

    const result = playCard(room.gameState, playerId, cardId);

    if (!result.success) {
      socket.emit('error', { message: result.error });
      return;
    }

    room.gameState = result.newState;

    io.to(roomId).emit('gameState', room.gameState);
  });

  // سحب كرت
  socket.on('drawCard', ({ roomId, playerId }) => {
    const room = rooms[roomId];
    if (!room || !room.gameState) return;

    const result = drawCards(room.gameState, playerId);

    room.gameState = result.newState;

    io.to(roomId).emit('gameState', room.gameState);
  });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('UNO Royale Server running on port', PORT);
});
