require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

const PORT = process.env.PORT || 3001;
const rooms = new Map();

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// ============================================================
// DECK CREATION — UNO Show 'em No Mercy (168 cards)
// ============================================================
const COLORS = ['RED', 'YELLOW', 'GREEN', 'BLUE'];
const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const createDeck = () => {
  let deck = [];
  let id = 0;

  COLORS.forEach(color => {
    // 1× 0, 2× 1-9
    NUMBERS.forEach(num => {
      deck.push({ id: id++, type: 'NUMBER', color, value: num });
      if (num !== '0') deck.push({ id: id++, type: 'NUMBER', color, value: num });
    });
    // 3× Skip, 3× Reverse, 3× Draw Two
    for (let i = 0; i < 3; i++) {
      deck.push({ id: id++, type: 'ACTION', color, value: 'SKIP' });
      deck.push({ id: id++, type: 'ACTION', color, value: 'REVERSE' });
      deck.push({ id: id++, type: 'ACTION', color, value: 'DRAW_TWO' });
    }
    // 1× Skip Everyone, 1× Discard All per color
    deck.push({ id: id++, type: 'ACTION', color, value: 'SKIP_EVERYONE' });
    deck.push({ id: id++, type: 'ACTION', color, value: 'DISCARD_ALL' });

    // Colored Wilds — ONLY Wild Draw Four has per-color variants (1 per color = 4 total)
    deck.push({ id: id++, type: 'WILD', color, value: 'WILD_DRAW_FOUR' });
  });

  // Black Wild cards (color: 'ANY') — 4 each: WD6, WD10, WRDF, Roulette
  for (let i = 0; i < 4; i++) {
    deck.push({ id: id++, type: 'WILD', color: 'ANY', value: 'WILD_DRAW_SIX' });
    deck.push({ id: id++, type: 'WILD', color: 'ANY', value: 'WILD_DRAW_TEN' });
    deck.push({ id: id++, type: 'WILD', color: 'ANY', value: 'WILD_REVERSE_DRAW_FOUR' });
    deck.push({ id: id++, type: 'WILD', color: 'ANY', value: 'WILD_COLOR_ROULETTE' });
  }

  return deck.sort(() => Math.random() - 0.5);
};

// ============================================================
// RULE ENGINE
// ============================================================
const DRAW_CARD_VALUES = ['DRAW_TWO', 'WILD_DRAW_FOUR', 'WILD_DRAW_SIX', 'WILD_DRAW_TEN', 'WILD_REVERSE_DRAW_FOUR'];
const DRAW_AMOUNTS = {
  DRAW_TWO: 2, WILD_DRAW_FOUR: 4, WILD_DRAW_SIX: 6, WILD_DRAW_TEN: 10, WILD_REVERSE_DRAW_FOUR: 4
};

const canPlayCard = (card, room, playerHand, pendingDrawAmount) => {
  const topCard = room.discardPile[room.discardPile.length - 1];

  // Stacking rule: if there's a pending draw, can only play equal-or-higher draw card
  if (pendingDrawAmount > 0) {
    // HANYA kartu yang ada di DRAW_CARD_VALUES yang bisa dipakai untuk stacking
    // WILD_COLOR_ROULETTE tidak ada di DRAW_CARD_VALUES → otomatis INVALID
    if (!DRAW_CARD_VALUES.includes(card.value)) return false;
    // drawValue harus >= drawValue kartu teratas (topCard), BUKAN total pendingDraw
    const cardDraw = DRAW_AMOUNTS[card.value] || 0;
    const topDraw = DRAW_AMOUNTS[topCard.value] || 0;
    return cardDraw >= topDraw;
  }

  // Hapus Legality Rule: Semua Wild (termasuk WD4 & WRDF) sekarang bisa dimainkan bebas kapan saja.

  if (card.type === 'WILD') return true;
  if (card.color === room.currentColor) return true;

  const topVal = topCard.value;
  const cardVal = card.value;
  if (cardVal === topVal) return true; // same number or same action type

  return false;
};

const refillDeck = (room) => {
  if (room.deck.length === 0) {
    const top = room.discardPile.pop();
    room.deck = room.discardPile.sort(() => Math.random() - 0.5);
    room.discardPile = [top];
  }
};

const drawCards = (room, player, amount) => {
  for (let i = 0; i < amount; i++) {
    refillDeck(room);
    if (room.deck.length > 0) player.hand.push(room.deck.shift());
  }
  // Check Mercy (25+ cards = eliminated)
  if (player.hand.length >= room.mercyLimit && !player.eliminated) {
    player.eliminated = true;
    return 'MERCY';
  }
  return null;
};

const getActivePlayers = (room) => room.players.filter(p => !p.eliminated);

const getNextActiveIndex = (room, fromIndex, skipExtra = 0) => {
  const total = room.players.length;
  let idx = fromIndex;
  let skipped = 0;
  do {
    idx = (idx + room.direction + total) % total;
    if (!room.players[idx].eliminated) {
      if (skipped >= skipExtra) return idx;
      skipped++;
    }
  } while (true);
};

const advanceTurn = (room, skipExtra = 0) => {
  room.players.forEach(p => { p.drawnCardThisTurn = null; });
  // JANGAN reset pendingDraw di sini. Reset hanya terjadi saat penalti ditarik.
  room.currentTurnIndex = getNextActiveIndex(room, room.currentTurnIndex, skipExtra);
};

const checkWin = (room, io) => {
  const active = getActivePlayers(room);
  if (active.length <= 1) {
    room.status = 'finished';
    const w = active[0] || room.players[0];
    io.to(room.roomCode).emit('game_finished', { winner: w.nickname });
    io.to(room.roomCode).emit('game_state', sanitize(room));
    return true;
  }
  return false;
};

// Remove sensitive data from room before sending to client
const sanitize = (room) => {
  const r = { ...room };
  r.players = room.players.map(p => ({ ...p })); // keep full hand for now (single screen)
  return r;
};

const applyCardEffect = (room, player, card, chosenColor, io) => {
  const topCard = room.discardPile[room.discardPile.length - 1];
  room.currentColor = card.type === 'WILD' ? chosenColor : card.color;

  // 7's Swap
  if (card.value === '7' && card.type === 'NUMBER') {
    // Wait for the 'swap_cards' event to handle this effect.
    // For now, we set a state indicating the player must choose a target.
    room.status = 'awaiting_swap_target';
    room.swapInitiator = player.id;
    io.to(room.roomCode).emit('game_state', sanitize(room));
    return;
  }

  // 0's Pass (everyone passes hand clockwise)
  if (card.value === '0' && card.type === 'NUMBER') {
    const active = getActivePlayers(room);
    if (active.length > 1) {
      const hands = active.map(p => p.hand);
      if (room.direction === 1) {
        const first = hands.shift();
        hands.push(first);
      } else {
        const last = hands.pop();
        hands.unshift(last);
      }
      active.forEach((p, i) => { p.hand = hands[i]; });
      io.to(room.roomCode).emit('notification', { msg: `🔄 Semua pemain mengoper tangan mereka!` });
    }
    advanceTurn(room);
    return;
  }

  if (card.value === 'SKIP') {
    // skipExtra=1 selalu: lewati 1 pemain berikutnya (lawan), pemain aktif dapat giliran lagi
    // Ini berlaku untuk 2 pemain maupun 3+ pemain
    advanceTurn(room, 1);
    return;
  }

  if (card.value === 'SKIP_EVERYONE') {
    io.to(room.roomCode).emit('notification', { msg: `⊘ ${player.nickname} Skip Everyone! Giliran lagi!` });
    // Stay on same player (don't advance)
    return;
  }

  if (card.value === 'DISCARD_ALL') {
    const before = player.hand.length;
    player.hand = player.hand.filter(c => c.color !== card.color);
    const discarded = before - player.hand.length;
    io.to(room.roomCode).emit('notification', { msg: `🗑️ ${player.nickname} membuang ${discarded} kartu ${card.color}!` });
    advanceTurn(room);
    return;
  }

  if (card.value === 'REVERSE') {
    room.direction *= -1;
    if (getActivePlayers(room).length === 2) return; // 2-player: acts like skip (play again)
    advanceTurn(room);
    return;
  }

  if (card.value === 'WILD_REVERSE_DRAW_FOUR') {
    room.direction *= -1;
    // Just like other Draw cards, we treat it as stacking
    advanceTurn(room);
    const nextPlayer = room.players[room.currentTurnIndex];
    const canStack = nextPlayer.hand.some(c =>
      DRAW_CARD_VALUES.includes(c.value) && (DRAW_AMOUNTS[c.value] || 0) >= 4
    );
    if (canStack) {
      room.pendingDraw = (room.pendingDraw || 0) + 4;
      io.to(room.roomCode).emit('notification', { msg: `⚠️ ${nextPlayer.nickname} bisa stack! Total +${room.pendingDraw}` });
    } else {
      const total = (room.pendingDraw || 0) + 4;
      room.pendingDraw = 0;
      const result = drawCards(room, nextPlayer, total);
      if (result === 'MERCY') io.to(room.roomCode).emit('player_eliminated', { nickname: nextPlayer.nickname });
      io.to(room.roomCode).emit('notification', { msg: `💥 ${nextPlayer.nickname} menarik ${total} kartu!` });
      advanceTurn(room, 1); // skip them
    }
    return;
  }

  if (card.value === 'WILD_COLOR_ROULETTE') {
    advanceTurn(room);
    room.status = 'awaiting_roulette_color';
    room.rouletteTarget = room.players[room.currentTurnIndex].id;
    io.to(room.roomCode).emit('game_state', sanitize(room));
    
    // Check if target is bot, then auto pick
    const nextPlayer = room.players[room.currentTurnIndex];
    if (nextPlayer.isBot) {
      setTimeout(() => {
        const rouletteColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        applyRoulette(room, nextPlayer, rouletteColor, io);
      }, 1500);
    }
    return;
  }

  // Draw cards (DRAW_TWO, WD4, WD6, WD10) — with stacking
  const drawAmt = DRAW_AMOUNTS[card.value];
  if (drawAmt) {
    advanceTurn(room);
    const nextPlayer = room.players[room.currentTurnIndex];
    // Check if next player can stack (has a draw card of equal/higher value)
    const canStack = nextPlayer.hand.some(c =>
      DRAW_CARD_VALUES.includes(c.value) && (DRAW_AMOUNTS[c.value] || 0) >= drawAmt
    );
    if (canStack) {
      // Give them a window to stack; set pending draw
      room.pendingDraw = (room.pendingDraw || 0) + drawAmt;
      io.to(room.roomCode).emit('notification', { msg: `⚠️ ${nextPlayer.nickname} bisa stack! Total +${room.pendingDraw}` });
    } else {
      const total = (room.pendingDraw || 0) + drawAmt;
      room.pendingDraw = 0;
      const result = drawCards(room, nextPlayer, total);
      if (result === 'MERCY') io.to(room.roomCode).emit('player_eliminated', { nickname: nextPlayer.nickname });
      io.to(room.roomCode).emit('notification', { msg: `💥 ${nextPlayer.nickname} menarik ${total} kartu!` });
      advanceTurn(room, 1); // skip them
    }
    return;
  }

  // Default: number card or regular wild
  advanceTurn(room);
};

const applyRoulette = (room, player, rouletteColor, io) => {
  let drawn = 0;
  let found = false;
  while (!found && drawn < 30) {
    refillDeck(room);
    if (room.deck.length === 0) break;
    const c = room.deck.shift();
    player.hand.push(c);
    drawn++;
    if (c.color === rouletteColor) { found = true; }
  }
  room.currentColor = rouletteColor; // The target's chosen color becomes the top color!
  io.to(room.roomCode).emit('notification', { msg: `🎡 Roulette! ${player.nickname} menarik ${drawn} kartu (mencari ${rouletteColor})!` });
  
  if (player.hand.length >= room.mercyLimit) {
    player.eliminated = true;
    io.to(room.roomCode).emit('player_eliminated', { nickname: player.nickname });
    if (checkWin(room, io)) return;
  }
  
  room.status = 'playing';
  room.rouletteTarget = null;
  advanceTurn(room, 1); // skip roulette victim
  io.to(room.roomCode).emit('game_state', sanitize(room));
  checkBotTurn(room);
};

const startGameForRoom = (roomCode) => {
  const room = rooms.get(roomCode);
  room.status = 'playing';
  room.deck = createDeck();
  room.discardPile = [];
  room.direction = 1;
  room.pendingDraw = 0;

  room.players.forEach(p => {
    p.hand = room.deck.splice(0, 7);
    p.unoCalled = false;
    p.eliminated = false;
    p.drawnCardThisTurn = null;
  });

  // First card: keep drawing until not WD4 or WD6 or WD10
  let firstCard = room.deck.shift();
  while (['WILD_DRAW_FOUR','WILD_DRAW_SIX','WILD_DRAW_TEN','WILD_COLOR_ROULETTE','WILD_REVERSE_DRAW_FOUR'].includes(firstCard.value)) {
    room.deck.push(firstCard);
    room.deck.sort(() => Math.random() - 0.5);
    firstCard = room.deck.shift();
  }
  room.discardPile.push(firstCard);
  room.currentColor = firstCard.type === 'WILD' ? COLORS[Math.floor(Math.random() * COLORS.length)] : firstCard.color;
  room.currentTurnIndex = Math.floor(Math.random() * room.players.length);

  io.to(roomCode).emit('game_started', sanitize(room));
  checkBotTurn(room);
};

const checkBotTurn = (room) => {
  // Handle bot awaiting swap target selection
  if (room.status === 'awaiting_swap_target') {
    const initiator = room.players.find(p => p.id === room.swapInitiator);
    if (initiator && initiator.isBot) {
      setTimeout(() => {
        const actives = getActivePlayers(room).filter(p => p.id !== initiator.id);
        if (actives.length > 0) {
          const target = actives[Math.floor(Math.random() * actives.length)];
          const temp = target.hand;
          target.hand = initiator.hand;
          initiator.hand = temp;
          io.to(room.roomCode).emit('notification', { msg: `🔄 ${initiator.nickname} menukar tangan dengan ${target.nickname}!` });
        }
        room.status = 'playing';
        room.swapInitiator = null;
        advanceTurn(room);
        io.to(room.roomCode).emit('game_state', sanitize(room));
        checkBotTurn(room);
      }, 1200);
    }
    return;
  }

  if (room.status !== 'playing') return;
  const cp = room.players[room.currentTurnIndex];
  if (!cp || !cp.isBot) return;

  setTimeout(() => {
    if (room.status !== 'playing') return;
    const currentBot = room.players[room.currentTurnIndex];
    if (!currentBot || !currentBot.isBot) return;

    // Find playable card
    let playIdx = currentBot.hand.findIndex(c => canPlayCard(c, room, currentBot.hand, room.pendingDraw || 0));
    if (playIdx !== -1) {
      const card = currentBot.hand[playIdx];
      const chosenColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      if (currentBot.hand.length === 2) { currentBot.unoCalled = true; io.to(room.roomCode).emit('uno_called', { nickname: currentBot.nickname }); }
      currentBot.hand.splice(playIdx, 1);
      room.discardPile.push(card);

      if (currentBot.hand.length === 0) {
        room.status = 'finished';
        io.to(room.roomCode).emit('game_finished', { winner: currentBot.nickname });
        io.to(room.roomCode).emit('game_state', sanitize(room));
        return;
      }
      if (currentBot.hand.length !== 1) currentBot.unoCalled = false;

      applyCardEffect(room, currentBot, card, chosenColor, io);
      if (checkWin(room, io)) return;
      io.to(room.roomCode).emit('game_state', sanitize(room));
      checkBotTurn(room);
    } else {
      // Draw until playable
      let drew = 0;
      let playable = false;
      while (!playable && drew < room.deck.length + 1) {
        refillDeck(room);
        if (room.deck.length === 0) break;
        const drawn = room.deck.shift();
        currentBot.hand.push(drawn);
        drew++;
        if (currentBot.hand.length >= room.mercyLimit) {
          currentBot.eliminated = true;
          io.to(room.roomCode).emit('player_eliminated', { nickname: currentBot.nickname });
          if (checkWin(room, io)) return;
          advanceTurn(room);
          io.to(room.roomCode).emit('game_state', sanitize(room));
          checkBotTurn(room);
          return;
        }
        if (canPlayCard(drawn, room, currentBot.hand, room.pendingDraw || 0)) {
          // Bot plays it
          const idx = currentBot.hand.length - 1;
          const card = currentBot.hand[idx];
          const chosenColor = COLORS[Math.floor(Math.random() * COLORS.length)];
          currentBot.hand.splice(idx, 1);
          room.discardPile.push(card);
          if (currentBot.hand.length === 0) {
            room.status = 'finished';
            io.to(room.roomCode).emit('game_finished', { winner: currentBot.nickname });
            io.to(room.roomCode).emit('game_state', sanitize(room));
            return;
          }
          applyCardEffect(room, currentBot, card, chosenColor, io);
          if (checkWin(room, io)) return;
          playable = true;
        }
      }
      if (!playable) {
        advanceTurn(room);
      }
      io.to(room.roomCode).emit('game_state', sanitize(room));
      checkBotTurn(room);
    }
  }, 1500);
};

// ============================================================
// SOCKET HANDLERS
// ============================================================
io.on('connection', (socket) => {
  socket.on('create_room', ({ nickname, maxPlayers, mercyLimit, isSinglePlayer }, cb) => {
    const roomCode = generateRoomCode();
    const host = { id: socket.id, nickname, isHost: true, isReady: true, hand: [], eliminated: false, isBot: false };
    const room = {
      roomCode, hostId: socket.id,
      maxPlayers: isSinglePlayer ? 2 : (maxPlayers || 4),
      mercyLimit: mercyLimit || 25,
      players: [host], status: 'waiting', direction: 1, pendingDraw: 0,
    };
    if (isSinglePlayer) {
      room.players.push({ id: `bot_${Date.now()}`, nickname: 'Bot Mercy', isHost: false, isReady: true, hand: [], eliminated: false, isBot: true });
    }
    rooms.set(roomCode, room);
    socket.join(roomCode);
    cb({ success: true, room });
  });

  socket.on('join_room', ({ roomCode, nickname }, cb) => {
    const code = roomCode.toUpperCase();
    const room = rooms.get(code);
    if (!room) return cb({ success: false, message: 'Ruangan tidak ditemukan' });
    if (room.status !== 'waiting') return cb({ success: false, message: 'Permainan sudah dimulai' });
    if (room.players.length >= room.maxPlayers) return cb({ success: false, message: 'Ruangan penuh' });
    room.players.push({ id: socket.id, nickname, isHost: false, isReady: false, hand: [], eliminated: false, isBot: false });
    socket.join(code);
    io.to(code).emit('room_updated', room);
    cb({ success: true, room });
  });

  socket.on('toggle_ready', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== 'waiting') return;
    const p = room.players.find(p => p.id === socket.id);
    if (p) { p.isReady = !p.isReady; io.to(roomCode).emit('room_updated', room); }
  });

  socket.on('start_game', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room && room.hostId === socket.id && room.status === 'waiting') {
      if (room.players.every(p => p.isReady) && room.players.length >= 2) {
        startGameForRoom(roomCode);
      }
    }
  });

  socket.on('play_card', ({ roomCode, cardId, chosenColor }) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== 'playing') return;
    const cp = room.players[room.currentTurnIndex];
    if (cp.id !== socket.id) return;
    const cardIdx = cp.hand.findIndex(c => c.id === cardId);
    if (cardIdx === -1) return;
    const card = cp.hand[cardIdx];
    if (!canPlayCard(card, room, cp.hand, room.pendingDraw || 0)) return;

    cp.hand.splice(cardIdx, 1);
    room.discardPile.push(card);
    if (cp.hand.length !== 1) cp.unoCalled = false;

    if (cp.hand.length === 0) {
      room.status = 'finished';
      io.to(roomCode).emit('game_finished', { winner: cp.nickname });
      io.to(roomCode).emit('game_state', sanitize(room));
      return;
    }

    applyCardEffect(room, cp, card, chosenColor || 'RED', io);
    if (checkWin(room, io)) return;
    io.to(roomCode).emit('game_state', sanitize(room));
    checkBotTurn(room);
  });

  socket.on('draw_card', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== 'playing') return;
    const cp = room.players[room.currentTurnIndex];
    if (cp.id !== socket.id || cp.drawnCardThisTurn) return;

    if (room.pendingDraw > 0) {
      // Must accept penalty
      const result = drawCards(room, cp, room.pendingDraw);
      if (result === 'MERCY') { io.to(roomCode).emit('player_eliminated', { nickname: cp.nickname }); if (checkWin(room, io)) return; }
      room.pendingDraw = 0;
      advanceTurn(room, 1);
      io.to(roomCode).emit('game_state', sanitize(room));
      checkBotTurn(room);
      return;
    }

    // Regular draw until playable
    refillDeck(room);
    if (room.deck.length === 0) { advanceTurn(room); io.to(roomCode).emit('game_state', sanitize(room)); return; }
    const drawn = room.deck.shift();
    cp.hand.push(drawn);
    if (cp.hand.length >= room.mercyLimit) {
      cp.eliminated = true;
      io.to(roomCode).emit('player_eliminated', { nickname: cp.nickname });
      if (checkWin(room, io)) return;
      advanceTurn(room);
      io.to(roomCode).emit('game_state', sanitize(room));
      checkBotTurn(room);
      return;
    }
    if (canPlayCard(drawn, room, cp.hand, 0)) {
      cp.drawnCardThisTurn = drawn.id;
    } else {
      advanceTurn(room);
    }
    io.to(roomCode).emit('game_state', sanitize(room));
    checkBotTurn(room);
  });

  socket.on('pass_turn', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== 'playing') return;
    const cp = room.players[room.currentTurnIndex];
    if (cp.id !== socket.id || !cp.drawnCardThisTurn) return;
    cp.unoCalled = false;
    advanceTurn(room);
    io.to(roomCode).emit('game_state', sanitize(room));
    checkBotTurn(room);
  });

  socket.on('call_uno', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== 'playing') return;
    const p = room.players.find(p => p.id === socket.id);
    if (p && (p.hand.length === 1 || (p.hand.length === 2 && room.players[room.currentTurnIndex].id === socket.id))) {
      p.unoCalled = true;
      io.to(roomCode).emit('uno_called', { nickname: p.nickname });
      io.to(roomCode).emit('game_state', sanitize(room));
    }
  });

  socket.on('challenge_uno', ({ roomCode, targetId }) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== 'playing') return;
    const target = room.players.find(p => p.id === targetId);
    if (target && target.hand.length === 1 && !target.unoCalled && !target.eliminated) {
      const result = drawCards(room, target, 2);
      if (result === 'MERCY') { io.to(roomCode).emit('player_eliminated', { nickname: target.nickname }); checkWin(room, io); }
      io.to(roomCode).emit('uno_penalty', { nickname: target.nickname });
      io.to(roomCode).emit('game_state', sanitize(room));
    }
  });

  socket.on('swap_cards', ({ roomCode, targetId }) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== 'awaiting_swap_target') return;
    const cp = room.players[room.currentTurnIndex];
    if (cp.id !== socket.id || room.swapInitiator !== socket.id) return;
    
    const target = room.players.find(p => p.id === targetId);
    if (target && !target.eliminated) {
      const temp = target.hand;
      target.hand = cp.hand;
      cp.hand = temp;
      io.to(roomCode).emit('notification', { msg: `🔄 ${cp.nickname} menukar tangan dengan ${target.nickname}!` });
      room.status = 'playing';
      room.swapInitiator = null;
      advanceTurn(room);
      io.to(roomCode).emit('game_state', sanitize(room));
      checkBotTurn(room);
    }
  });

  socket.on('roulette_color', ({ roomCode, color }) => {
    const room = rooms.get(roomCode);
    if (!room || room.status !== 'awaiting_roulette_color') return;
    const cp = room.players[room.currentTurnIndex];
    if (cp.id !== socket.id || room.rouletteTarget !== socket.id) return;
    applyRoulette(room, cp, color, io);
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, code) => {
      const idx = room.players.findIndex(p => p.id === socket.id);
      if (idx !== -1 && room.status === 'waiting') {
        room.players.splice(idx, 1);
        io.to(code).emit('room_updated', room);
      }
    });
  });
});

server.listen(PORT, () => console.log(`UNO No Mercy server on port ${PORT}`));
