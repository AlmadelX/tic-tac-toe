'use strict';

// Modules

const game = (() => {
  // Factories
  function playerFactory(name, marker) {
    return { name, marker };
  }

  // Properties
  let players;
  let currentPlayer = 0;
  let status = '';
  let board = new Array(9);
  let winner = null;

  // Methods

  function start(xPlayerName, oPlayerName) {
    // Initialize properties
    players = [
      playerFactory(xPlayerName, 'X'),
      playerFactory(oPlayerName, 'O'),
    ];
    status = 'playing';
  }

  // Performs the move, if it's possible
  function move(id) {
    if (board[id]) {
      return;
    }

    board[id] = players[currentPlayer].marker;
    update();
    if (status === 'playing') {
      currentPlayer = (currentPlayer + 1) % 2;
    }
  }

  // Checks the board, if there's a draw sets status to 'draw', if there's a winner sets status to 'winner' and updates the winner property
  function update() {
    const winningPositions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of winningPositions) {
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        // Handle win case
        status = 'win';
        if (board[a] === 'X') {
          winner = 0;
        } else {
          winner = 1;
        }
        return;
      }
    }

    if (!board.includes(undefined)) {
      // No space left, handle the draw
      status = 'draw';
    }
  }

  function restart() {
    currentPlayer = 0;
    status = '';
    board = new Array(9);
    winner = null;
  }

  // Getters

  function getCurrentPlayerName() {
    return players[currentPlayer].name;
  }

  function getStatus() {
    return status;
  }

  function getBoard() {
    return board;
  }

  function getWinnerName() {
    return players[winner].name;
  }

  return {
    start,
    move,
    restart,
    getCurrentPlayerName,
    getStatus,
    getBoard,
    getWinnerName,
  };
})();

const displayController = (() => {
  // Dom elements
  const form = document.querySelector('form');
  const moveInfo = document.querySelector('.move-info');
  const gameResult = document.querySelector('.game-result');
  const restartButton = gameResult.querySelector('button');
  const cells = document.querySelectorAll('.cell');

  // Methods

  function toggleElement(element) {
    element.classList.toggle('hidden');
  }

  function updateMoveInfo() {
    const name = moveInfo.querySelector('.marker');
    name.textContent = game.getCurrentPlayerName();
  }

  function updateBoard() {
    const board = game.getBoard();
    for (let i = 0; i < 9; ++i) {
      cells[i].textContent = board[i];
    }
  }

  function handleForm() {
    // Parse form fields
    const formData = new FormData(form);
    let formObj = {};
    formData.forEach((value, key) => (formObj[key] = value));

    // Start the game
    game.start(formObj.xPlayerName, formObj.oPlayerName);

    // Update the page
    form.reset();
    toggleElement(form);
    toggleElement(moveInfo);
    updateMoveInfo();
  }

  function handleClick(id) {
    if (game.getStatus() !== 'playing') {
      return;
    }

    game.move(id);
    updateBoard();

    if (game.getStatus() === 'playing') {
      updateMoveInfo();
    } else {
      showGameResult();
    }
  }

  function showGameResult() {
    toggleElement(moveInfo);
    toggleElement(gameResult);

    const element = gameResult.querySelector('p');
    if (game.getStatus() === 'draw') {
      element.textContent = 'Draw!';
    } else {
      element.innerHTML = `<span class="marker">${game.getWinnerName()}</span> wins!`;
    }
  }

  function restart() {
    game.restart();
    toggleElement(gameResult);
    toggleElement(form);
    updateBoard();
  }

  function setupPage() {
    form.addEventListener('submit', e => {
      e.preventDefault();
      handleForm();
    });

    cells.forEach((cell, id) => {
      cell.addEventListener('click', () => {
        handleClick(id);
      });
    });

    restartButton.addEventListener('click', restart);
  }

  return { setupPage };
})();

// Page setup
displayController.setupPage();
