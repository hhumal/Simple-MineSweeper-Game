// Constants
const boardSize = 15;
const mineCount = 25;

// Game state variables
let board = [];
let mineLocations = [];
let revealedCount = 0;
let flagsCount = 0;
let seconds = 0;
let timer;

// Create the game board
function initializeBoard() {
  
  board = []; // Clear the existing board array

  for (let row = 0; row < boardSize; row++) {
    board[row] = [];
    for (let col = 0; col < boardSize; col++) {
      board[row][col] = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighbors: 0,
      };
    }
  }
}


// Randomly place mines on the board
function plantMines() {
  let plantedMines = 0;
  while (plantedMines < mineCount) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      mineLocations.push({ row, col });
      plantedMines++;
    }
  }
}

// Calculate the number of neighboring mines for each cell
function calculateNeighbors() {
  for (let { row, col } of mineLocations) {
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (isValidCell(i, j) && !(i === row && j === col)) {
          board[i][j].neighbors++;
        }
      }
    }
  }
}

// Check if a cell is valid
function isValidCell(row, col) {
  return row >= 0 && col >= 0 && row < boardSize && col < boardSize;
}

// Reveal a cell when clicked
function revealCell(row, col) {
  if (isValidCell(row, col) && !board[row][col].isRevealed && !board[row][col].isFlagged) {
    board[row][col].isRevealed = true;
    revealedCount++;

    if (board[row][col].isMine) {
      revealMines();
      gameOver();
      return;
    }

    if (board[row][col].neighbors === 0) {
      revealNeighbors(row, col);
    }

    if (revealedCount === (boardSize * boardSize) - mineCount) {
      gameWon();
    }
  }
}

// Reveal neighboring cells recursively
function revealNeighbors(row, col) {
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (isValidCell(i, j) && !(i === row && j === col)) {
        revealCell(i, j);
      }
    }
  }
}

// Toggle flag on a cell
function toggleFlag(row, col) {
  if (isValidCell(row, col) && !board[row][col].isRevealed) {
    if (board[row][col].isFlagged) {
      board[row][col].isFlagged = false;
      flagsCount--;
    } else {
      board[row][col].isFlagged = true;
      flagsCount++;
    }
    updateFlagsCount();
    renderBoard();
  }
}


// Reveal all mines
function revealMines() {
  for (let { row, col } of mineLocations) {
    board[row][col].isRevealed = true;
  }
}

// Handle game over condition
function gameOver() {
  clearInterval(timer);
  renderBoard();
  alert("Game Over");
}

// Handle game won condition
function gameWon() {
  clearInterval(timer);
  renderBoard();
  alert("Congratulations! You won the game!");
}

// Update flags count on the UI
function updateFlagsCount() {
  document.getElementById("flags").innerText = flagsCount;
}

// Start the timer
function startTimer() {
  seconds = 0;
  timer = setInterval(function () {
    seconds++;
    document.getElementById("timer").innerText = seconds;
  }, 1000);
}

// Reset the game
function resetGame() {
  clearInterval(timer);
  board = [];
  mineLocations = [];
  revealedCount = 0;
  flagsCount = 0;
  seconds = 0;
  document.getElementById("timer").innerText = seconds;
  document.getElementById("flags").innerText = flagsCount;
  initializeBoard();
  plantMines();
  calculateNeighbors();
  renderBoard();
  startTimer();
}

// Render the game board
function renderBoard() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", function () {
        revealCell(row, col);
        renderBoard();
      });
      cell.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        toggleFlag(row, col);
        renderBoard(); // Update the rendering after flag toggling
      });

      if (board[row][col].isRevealed) {
        cell.classList.remove("hidden");
        cell.classList.add("revealed");
        if (board[row][col].isMine) {
          cell.classList.add("mine");
          cell.innerHTML = "&#128163;";
        } else if (board[row][col].neighbors > 0) {
          cell.innerHTML = board[row][col].neighbors.toString();
        }
      } else if (board[row][col].isFlagged) {
        cell.innerHTML = "&#9873;"; // Display flag symbol
      } else {
        cell.classList.add("hidden");
      }

      boardElement.appendChild(cell);
    }
  }
}



document.getElementById("reset-button").addEventListener("click", resetGame);

resetGame();
