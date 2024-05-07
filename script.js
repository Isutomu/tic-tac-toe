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
    const updateGameboard = (playerNumber) => {
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