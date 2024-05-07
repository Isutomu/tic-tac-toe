const gameboard = (function() {
    let tileColor; //color format???
    let symbolColor; //color format???
    const gameboardTiles = [];
    resetGameboard();

    const getTileColor = () => tileColor;
    const setTileColor = (newColor) => {
        tileColor = newColor;
        symbolColor = newColor;; //calculate complementary color + color format???
    };
    const getSymbolColor = () => symbolColor;

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
    }

    return {
        getTileColor,
        setTileColor,
        getSymbolColor,
        isGameboardFull,
        updateGameboard,
        getGameboard,
        resetGameboard
    };
})();

const gameController = (function() {
    let currentFirstPlayer = '1';
    let currentPlayer = currentFirstPlayer;

    const getCurrentPlayer = () => currentPlayer;
    const updateCurrentFirstPlayer = () => {
        currentFirstPlayer = currentFirstPlayer==='1' ? '2' : '1';
        currentPlayer = currentFirstPlayer;
    };

    const checkGameStatus = () => {
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
    }
    const newGame = () => {
        gameboard.resetGameboard();
        updateCurrentFirstPlayer();
    }

    const checkIfWinner = () => {
        const combinations = [];
        const gameboardTiles = gameboard.getGameboard();

        // rows combinations
        combinations.push(...gameboardTiles.map(row => ''.concat(row)));

        // columns combinations
        const columnsCombined = (function() {
            let gameboardRotated = [[], [], []];
            for (let i=0; i<3; i++) {
                for (let j=0; j<3; j++) {
                    gameboardRotated[j][i] = gameboardTiles[i][j];
                }
            }
            return gameboardRotated.map(row => ''.concat(row));
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

        updateCurrentFirstPlayer();
        gameboard.resetGameboard();
    }
    const gameTie = () => {
        updateCurrentFirstPlayer();
        gameboard.resetGameboard();
    }

    return {
        getCurrentPlayer,
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

const colorBtn = document.querySelector('.theme-color');
colorBtn.addEventListener('click', (e) => {
    gameboard.setTileColor(e.target.value);
});

const newgameBtn = document.querySelector('.btn-newgame');
newgameBtn.addEventListener('click', () => {
    gameboard.resetGameboard();
    gameController.updateCurrentFirstPlayer();
});

const resetBtn = document.querySelector('.btn-reset');
resetBtn.addEventListener('click', () => {
    gameController.resetSession();
});

const player1Name = document.querySelector('.player-name.player1');
player1Name.addEventListener('onchange', () => {
    players['1'].name = player1Name.value;
});

const player2Name = document.querySelector('.player-name.player2');
player1Name.addEventListener('onchange', () => {
    players['2'].name = player1Name.value;
});