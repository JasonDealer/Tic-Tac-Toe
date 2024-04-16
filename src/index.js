// Select all cell elements on the board
const cells = document.querySelectorAll('[data-cell]');

// Track the current player's turn
let turn = 'X';
let playAgainstAI = false;

// Access modal elements
const modal = document.getElementById("myModal");
const winnerAnnouncement = document.getElementById("winnerAnnouncement");
const restartButton = document.getElementById("restartGame");
const closeButton = document.getElementById("closeGame");

// Define all possible winning combinations on the board
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Initialize the game by adding click event listeners to each cell
cells.forEach(cell => {
  cell.addEventListener('click', handleClick, { once: true });
});

document.getElementById('playMode').addEventListener('change', function() {
  if (this.checked) {
    playAgainstAI = true;
  } else {
    playAgainstAI = false;
  }
});

// Function to check if the current player has won
function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cells[index].classList.contains(currentClass);
    });
  });
}

// Function to check if it is a draw
function checkDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
}

// Show the winner announcement modal
function showWinner(winner) {
  winnerAnnouncement.textContent = `${winner} wins!`;
  modal.style.display = "block";
}

// Show draw announcement modal
function showDraw() {
    winnerAnnouncement.textContent = "Draw!";
    modal.style.display = "block";
}

// Restart the game and reset the board
restartButton.onclick = function() {
  modal.style.display = "none";
  restartGame();
}

// Close the game window
closeButton.onclick = function() {
  modal.style.display = "none";
  window.close();
}

// Reset game board and start a new game
function restartGame() {
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  turn = 'X'; // Reset turn to the initial player
  document.querySelector('#side').textContent = turn
}

// Handle click events on cells
function handleClick(e) {
  if (playAgainstAI) {
    const cell = e.target;
    const currentClass = 'x';
    if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
        cell.classList.add(currentClass);
        cell.textContent = 'X';

        if (checkWin(currentClass)) {
            setTimeout(() => showWinner('X'), 10);
        } else if (checkDraw()) {
            setTimeout(showDraw, 10);
        } else {
            let bestMove = findBestMove();
            cells[bestMove].classList.add('o');
            cells[bestMove].textContent = 'O';
            if (checkWin('o')) {
                setTimeout(() => showWinner('O'), 10);
            } else if (checkDraw()) {
                setTimeout(showDraw, 10);
            }
        }
    }
  } else {
    const cell = e.target;
    const currentClass = turn === 'X' ? 'x' : 'o';
    cell.classList.add(currentClass);
    cell.textContent = turn;
   

    // Check for a win or tie after each turn
    if (checkWin(currentClass)) {
        setTimeout(() => {
            showWinner(turn === 'O' ? 'X' : 'O');
        }, 10);
    } else if (checkDraw()) { //Check if draw
        setTimeout(() => {
            showDraw();
        }, 10);
    }

    // Switch turns
    turn = turn === 'X' ? 'O' : 'X';
    document.querySelector('#side').textContent = turn
  }
}

function findBestMove() {
  let bestScore = -Infinity;
  let move;
  cells.forEach((cell, index) => {
      if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
          cell.classList.add('o');
          let score = minimax(false);
          cell.classList.remove('o');
          if (score > bestScore) {
              bestScore = score;
              move = index;
          }
      }
  });
  return move;
}

function minimax(isMaximizing) {
  if (checkWin('x')) return -10;
  if (checkWin('o')) return 10;
  if (checkDraw()) return 0;

  if (isMaximizing) {
      let bestScore = -Infinity;
      cells.forEach((cell, index) => {
          if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
              cell.classList.add('o');
              let score = minimax(false);
              cell.classList.remove('o');
              bestScore = Math.max(score, bestScore);
          }
      });
      return bestScore;
  } else {
      let bestScore = Infinity;
      cells.forEach((cell, index) => {
          if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
              cell.classList.add('x');
              let score = minimax(true);
              cell.classList.remove('x');
              bestScore = Math.min(score, bestScore);
          }
      });
      return bestScore;
  }
}

// Close the game window
document.getElementById("closeGame").addEventListener('click', () => {
    window.electronAPI.closeWindow();
});