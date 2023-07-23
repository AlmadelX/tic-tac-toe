// Modules
const game = (() => {
  function playerFactory(name, marker) {
    return { name, marker };
  }

  let players;
  let currentPlayer = 0;
  let board = [];

  function start(xPlayerName, oPlayerName) {
    players = [
      playerFactory(xPlayerName, 'X'),
      playerFactory(oPlayerName, 'O'),
    ];
  }

  function getCurrentPlayer() {
    return players[currentPlayer].name;
  }

  return { start, getCurrentPlayer };
})();

const displayController = (() => {
  const form = document.querySelector('form');
  const moveInfo = document.querySelector('.move-info');

  function getForm() {
    return form;
  }

  function toggleElement(element) {
    element.classList.toggle('hidden');
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

  function updateMoveInfo() {
    const player = moveInfo.querySelector('.marker');
    player.textContent = game.getCurrentPlayer();
  }

  return { getForm, handleForm };
})();

// Page setup
function setup() {
  const form = displayController.getForm();

  form.addEventListener('submit', e => {
    e.preventDefault();
    displayController.handleForm();
  });
}

setup();
