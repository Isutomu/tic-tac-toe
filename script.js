"use strict";

const gameboard = (function() {
    const gameboardTiles = [];

    const isGameboardFull = () => {
        const tilesOccupied = gameboardTiles.map((tile) => tile!= '' ? 1 : 0).reduce((sum, tile) => sum + tile);
        if (tilesOccupied === 9) {
            return true;
        }
        return false;
    };
    const updateGameboard = (playerNumber, x, y) => {
        gameboardTiles[x][y] = playerNumber; 
    };
    const getGameboard = () => gameboardTiles;
    const resetGameboard = () => {
        for (let i=0; i<3; i++) {
            gameboardTiles[i] = ['', '', ''];
        }
        const tileBtns = Array(...document.querySelectorAll('.btn-tile'));
        for (let btn of tileBtns) {
            btn.textContent = '';
        }
    }

    return {
        isGameboardFull,
        updateGameboard,
        getGameboard,
        resetGameboard
    };
})();
gameboard.resetGameboard();

const gameController = (function() {
    let currentFirstPlayer = '1';
    let currentPlayer = currentFirstPlayer;
    let gameDone = false;

    const getCurrentPlayer = () => currentPlayer;
    const updateCurrentFirstPlayer = () => {
        currentFirstPlayer = currentFirstPlayer==='1' ? '2' : '1';
        currentPlayer = currentFirstPlayer;
    };

    const checkGameStatus = () => {
        if (gameDone) {
            return;
        }
        if(checkIfWinner()) {
            gameWon();
        } else if (gameboard.isGameboardFull()) {
            gameTie();
        } else {
            currentPlayer = currentPlayer==='1' ? '2' : '1';
        }
    };
    const resetSession = () => {
        players['1'].resetScore();
        players['2'].resetScore();
        const player1Score = document.querySelector('.player-score.player1');
        const player2Score = document.querySelector('.player-score.player2');
        player1Score.textContent = '0';
        player2Score.textContent = '0';

        gameboard.resetGameboard();
        currentFirstPlayer = '1';
        currentPlayer = currentFirstPlayer;
        enableTileBtns();
        gameDone = false;
    }
    const newGame = () => {
        gameboard.resetGameboard();
        updateCurrentFirstPlayer();
        enableTileBtns();
        gameDone = false;
    }

    const enableTileBtns = () => {
        const tileBtns = Array(...document.querySelectorAll('.btn-tile'));
        for (let btn of tileBtns) {
            btn.disabled = false;
        }
    }
    const checkIfWinner = () => {
        const combinations = [];
        const gameboardTiles = gameboard.getGameboard();

        // rows combinations
        combinations.push(...gameboardTiles.map(row => row.join('')));

        // columns combinations
        const columnsCombined = (function() {
            let gameboardRotated = [[], [], []];
            for (let i=0; i<3; i++) {
                for (let j=0; j<3; j++) {
                    gameboardRotated[j][i] = gameboardTiles[i][j];
                }
            }
            return gameboardRotated.map(row => row.join(''));
        })();
        combinations.push(...columnsCombined);

        // diagonals combinations
        const diagonal1 = (function() {
            let diagonal = '';
            for (let i=0; i<3; i++) {
                diagonal += gameboardTiles[i][i];
            }
            return diagonal;
        })();
        const diagonal2 = (function() {
            let diagonal = '';
            for (let i=0; i<3; i++) {
                diagonal += gameboardTiles[i][2-i];
            }
            return diagonal;
        })();
        combinations.push(diagonal1, diagonal2);

        // inspect the combinations for a winner
        if (combinations.includes('111') || combinations.includes('222')) {
            return true;
        } else {
            return false;
        }
    };
    const gameWon = () => {
        players[currentPlayer].increaseScore();
        const playerScore = document.querySelector(`.player-score.player${currentPlayer}`);
        playerScore.textContent = players[currentPlayer].getScore();

        gameDone = true;
    }
    const gameTie = () => {
        gameDone = true;
    }

    return {
        getCurrentPlayer,
        updateCurrentFirstPlayer,
        checkGameStatus,
        resetSession,
        newGame
    };
})();

function createPlayer(playerName, playerSymbol) {
    let name = playerName;
    let symbol = playerSymbol;
    let score = 0;

    const increaseScore = () => ++score;
    const getScore = () => score;
    const resetScore = () => {score = 0;};

    return {
        name,
        symbol,
        increaseScore,
        getScore,
        resetScore
    }
}

const players = {
    '1': createPlayer('Player1', 'X'),
    '2': createPlayer('Player2', 'O')
}

const newgameBtn = document.querySelector('.btn-newgame');
newgameBtn.addEventListener('click', () => {
    gameController.newGame();
});
const resetBtn = document.querySelector('.btn-reset');
resetBtn.addEventListener('click', () => {
    gameController.resetSession();
});
const player1Name = document.querySelector('.player-name.player1');
player1Name.addEventListener('change', () => {
    players['1'].name = player1Name.value;
});
const player2Name = document.querySelector('.player-name.player2');
player2Name.addEventListener('change', () => {
    players['2'].name = player2Name.value;
});

function onTileClick(e) {
    const tileBtn = e.target;
    tileBtn.disabled = true;
    tileBtn.textContent = players[gameController.getCurrentPlayer()].symbol;
    gameboard.updateGameboard(
        gameController.getCurrentPlayer(),
        Number(tileBtn.dataset.row),
        Number(tileBtn.dataset.column)
    );
    gameController.checkGameStatus();
}

const gameboardHtml = document.querySelector('.gameboard');
(function() {
    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
            const tileBtn = document.createElement('button');
            tileBtn.classList.add('btn-tile');
            tileBtn.setAttribute('data-row', String(i));
            tileBtn.setAttribute('data-column', String(j));
            tileBtn.addEventListener('click', (e) => onTileClick(e));
            gameboardHtml.appendChild(tileBtn);
        }
    }
})();
