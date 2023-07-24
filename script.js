// Modules

const game = (() => {
  // Factories
  function playerFactory(name, marker) {
    return { name, marker };
  }

  // Properties
  let players;
  let currentPlayer;
  let playing = false;
  let board;

  // Methods

  function start(xPlayerName, oPlayerName) {
    // Initialize properties
    players = [
      playerFactory(xPlayerName, 'X'),
      playerFactory(oPlayerName, 'O'),
    ];
    currentPlayer = 0;
    playing = true;
    board = new Array(9);
  }

  // If the move is possible, performs it and returns true, otherwise immediately returns false
  function move(id) {
    if (!playing || board[id]) {
      return false;
    }

    board[id] = players[currentPlayer].marker;
    currentPlayer = (currentPlayer + 1) % 2;
    return true;
  }

  // Getters

  function getCurrentPlayerName() {
    return players[currentPlayer].name;
  }

  function getBoard() {
    return board;
  }

  return { start, move, getCurrentPlayerName, getBoard };
})();

const displayController = (() => {
  // Dom elements
  const form = document.querySelector('form');
  const moveInfo = document.querySelector('.move-info');
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
    if (game.move(id)) {
      updateMoveInfo();
      updateBoard();
    }
  }

  function setupPage() {
    form.addEventListener('submit', e => {
      e.preventDefault();
      handleForm();
    });

    cells.forEach((cell, id) => {
      cell.addEventListener('click', e => {
        handleClick(id);
      });
    });
  }

  return { setupPage };
})();

// Page setup
displayController.setupPage();
