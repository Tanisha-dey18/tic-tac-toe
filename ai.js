// Game rules and the minimax AI. No DOM code here, so it can be tested on its own.

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

// Returns { winner: "X" | "O", line: [a, b, c] }, { winner: "draw" }, or null if the game is still going
function getResult(board) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return board.every(Boolean) ? { winner: "draw" } : null;
}

function emptyCells(board) {
  return board.map((v, i) => (v ? null : i)).filter((i) => i !== null);
}

// Scores a position from the AI's point of view: +10 win, -10 loss, 0 draw.
// Depth is subtracted so the AI prefers faster wins and slower losses.
function minimax(board, depth, isAiTurn, ai, human) {
  const result = getResult(board);
  if (result) {
    if (result.winner === ai) return 10 - depth;
    if (result.winner === human) return depth - 10;
    return 0;
  }

  const scores = emptyCells(board).map((i) => {
    board[i] = isAiTurn ? ai : human;
    const score = minimax(board, depth + 1, !isAiTurn, ai, human);
    board[i] = null;
    return score;
  });
  return isAiTurn ? Math.max(...scores) : Math.min(...scores);
}

function bestMove(board, ai, human) {
  let best = { score: -Infinity, index: null };
  for (const i of emptyCells(board)) {
    board[i] = ai;
    const score = minimax(board, 0, false, ai, human);
    board[i] = null;
    if (score > best.score) best = { score, index: i };
  }
  return best.index;
}

function randomMove(board) {
  const cells = emptyCells(board);
  return cells[Math.floor(Math.random() * cells.length)];
}

// How often each difficulty plays a random move instead of the best one
const MISTAKE_RATE = { easy: 0.75, medium: 0.35, hard: 0 };

function aiMove(board, ai, human, difficulty) {
  return Math.random() < MISTAKE_RATE[difficulty] ? randomMove(board) : bestMove(board, ai, human);
}

// Lets Node load this file for testing; ignored in the browser
if (typeof module !== "undefined") module.exports = { getResult, bestMove, aiMove, emptyCells };
