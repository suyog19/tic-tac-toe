let board = ["", "", "", "", "", "", "", "", ""];
let human = "X";
let ai = "O";
let currentPlayer = "X";
let gameOver = false;

const boardContainer = document.getElementById("board");

function startGame(choice) {
  human = choice;
  ai = choice === "X" ? "O" : "X";
  currentPlayer = "X";
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  document.getElementById("symbol-selection").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  renderBoard();

  if (currentPlayer !== human) makeAIMove();
}

function renderBoard() {
  boardContainer.innerHTML = "";
  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.textContent = cell;
    div.onclick = () => handleMove(index);
    boardContainer.appendChild(div);
  });
  document.getElementById("status").textContent = gameOver ? checkWinner() : `${currentPlayer}'s turn`;
}

function handleMove(index) {
  if (board[index] !== "" || gameOver || currentPlayer !== human) return;
  board[index] = human;
  currentPlayer = ai;
  renderBoard();
  if (checkWinner()) {
    gameOver = true;
    renderBoard();
    return;
  }
  setTimeout(makeAIMove, 300);
}

function makeAIMove() {
  const best = minimax(board, ai);
  board[best.index] = ai;
  currentPlayer = human;
  gameOver = !!checkWinner();
  renderBoard();
}

function checkWinner() {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (let win of wins) {
    const [a, b, c] = win;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return `${board[a]} wins!`;
    }
  }

  if (!board.includes("")) return "It's a draw!";
  return "";
}

function resetGame() {
  document.getElementById("symbol-selection").classList.remove("hidden");
  document.getElementById("game").classList.add("hidden");
}

function minimax(newBoard, player) {
  const availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(i => i !== null);

  const winner = checkWinner();
  if (winner === `${human} wins!`) return { score: -10 };
  if (winner === `${ai} wins!`) return { score: 10 };
  if (winner === "It's a draw!") return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const index = availSpots[i];
    const move = {};
    move.index = index;
    newBoard[index] = player;

    const result = minimax(newBoard, player === ai ? human : ai);
    move.score = result.score;

    newBoard[index] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === ai) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
