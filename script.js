const HUMAN = "X";
const AI = "O";
const AI_DELAY_MS = 350;

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const difficultyEl = document.getElementById("difficulty");
const aiFirstEl = document.getElementById("ai-first");
const scoreEls = {
  wins: document.getElementById("wins"),
  draws: document.getElementById("draws"),
  losses: document.getElementById("losses"),
};

let board, gameOver, aiThinking, aiTimer, winLine;
let score = loadScore();

// Build the 9 cells once; render() only updates them
const cells = Array.from({ length: 9 }, (_, i) => {
  const cell = document.createElement("button");
  cell.className = "cell";
  cell.setAttribute("aria-label", `Cell ${i + 1}`);
  cell.onclick = () => humanMove(i);
  boardEl.append(cell);
  return cell;
});

function loadScore() {
  try {
    return { wins: 0, draws: 0, losses: 0, ...JSON.parse(localStorage.getItem("ttt-score")) };
  } catch {
    return { wins: 0, draws: 0, losses: 0 };
  }
}

function saveScore() {
  try { localStorage.setItem("ttt-score", JSON.stringify(score)); } catch {}
}

function newGame() {
  clearTimeout(aiTimer);
  board = Array(9).fill(null);
  gameOver = false;
  aiThinking = false;
  winLine = [];
  statusEl.textContent = "Your turn. You are X.";
  render();
  if (aiFirstEl.checked) playAi();
}

function humanMove(i) {
  if (gameOver || aiThinking || board[i]) return;
  board[i] = HUMAN;
  if (!checkEnd()) playAi();
  render();
}

function playAi() {
  aiThinking = true;
  statusEl.textContent = "AI is thinking…";
  render();
  // A short pause so the AI's move doesn't feel instant
  aiTimer = setTimeout(() => {
    board[aiMove(board, AI, HUMAN, difficultyEl.value)] = AI;
    aiThinking = false;
    if (!checkEnd()) statusEl.textContent = "Your turn.";
    render();
  }, AI_DELAY_MS);
}

function checkEnd() {
  const result = getResult(board);
  if (!result) return false;

  gameOver = true;
  if (result.winner === "draw") {
    score.draws++;
    statusEl.textContent = "It's a draw.";
  } else if (result.winner === HUMAN) {
    score.wins++;
    statusEl.textContent = "You win! 🎉";
  } else {
    score.losses++;
    statusEl.textContent = "AI wins.";
  }
  winLine = result.line ?? [];
  saveScore();
  return true;
}

function render() {
  cells.forEach((cell, i) => {
    cell.textContent = board[i] ?? "";
    cell.className = "cell" + (board[i] ? " " + board[i].toLowerCase() : "") +
      (winLine.includes(i) ? " win" : "");
    cell.disabled = gameOver || aiThinking || Boolean(board[i]);
  });
  for (const key in scoreEls) scoreEls[key].textContent = score[key];
}

document.getElementById("new-game").onclick = newGame;
difficultyEl.onchange = newGame;
aiFirstEl.onchange = newGame;

newGame();
