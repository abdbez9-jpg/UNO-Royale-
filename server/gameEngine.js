const { v4: uuidv4 } = require('uuid');

const COLORS = ['red', 'green', 'blue', 'yellow'];
const TYPES = ['0','1','2','3','4','5','6','7','8','9','skip','reverse','draw2'];

function createDeck() {
  const deck = [];

  COLORS.forEach(color => {
    TYPES.forEach(type => {
      deck.push({ id: uuidv4(), color, type });
      deck.push({ id: uuidv4(), color, type });
    });
  });

  for (let i = 0; i < 4; i++) {
    deck.push({ id: uuidv4(), color: 'wild', type: 'wild' });
    deck.push({ id: uuidv4(), color: 'wild', type: 'wild4' });
  }

  return deck.sort(() => Math.random() - 0.5);
}

function initGame(players) {
  const deck = createDeck();
  const hands = {};

  players.forEach(p => {
    hands[p.id] = [];
  });

  for (let i = 0; i < 7; i++) {
    players.forEach(p => {
      hands[p.id].push(deck.pop());
    });
  }

  const topCard = deck.pop();

  return {
    deck,
    hands,
    topCard,
    currentColor: topCard.color,
    playerOrder: players.map(p => p.id),
    currentPlayerIndex: 0,
  };
}

function canPlay(card, topCard, currentColor) {
  return (
    card.color === currentColor ||
    card.type === topCard.type ||
    card.color === 'wild'
  );
}

function playCard(state, playerId, cardId) {
  const hand = state.hands[playerId];
  const index = hand.findIndex(c => c.id === cardId);

  if (index === -1) {
    return { success: false, error: 'Card not found' };
  }

  const card = hand[index];

  if (!canPlay(card, state.topCard, state.currentColor)) {
    return { success: false, error: 'Invalid move' };
  }

  hand.splice(index, 1);

  state.topCard = card;
  state.currentColor = card.color === 'wild' ? 'red' : card.color;

  state.currentPlayerIndex =
    (state.currentPlayerIndex + 1) % state.playerOrder.length;

  return { success: true, newState: state };
}

function drawCards(state, playerId) {
  const card = state.deck.pop();

  state.hands[playerId].push(card);

  state.currentPlayerIndex =
    (state.currentPlayerIndex + 1) % state.playerOrder.length;

  return { success: true, newState: state };
}

module.exports = {
  initGame,
  playCard,
  drawCards,
};
