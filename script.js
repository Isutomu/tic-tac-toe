const gameboard = (function() {
    let tileColor; //color format???
    let symbolColor; //color format???
    const gameboardTiles = [new Array(3), new Array(3), new Array(3)];
    resetGameboard();

    const getTileColor = () => tileColor;
    const setTileColor = (newColor) => {
        tileColor = newColor;
        setSymbolColor('blue'); //calculate complementary color + color format???
    };
    const getSymbolColor = () => symbolColor;
    const setSymbolColor = (newColor) => {symbolColor = newColor;};

    const isGameboardFull = () => {
        const tilesOccupied = gameboardTiles.map((tile) => tile!= '' ? 1 : 0).reduce((sum, tile) => sum + tile);
        if (tilesOccupied === 9) {
            return true;
        }
        return false;
    };
    const updateGameboard = (playerSymbol) => {
        gameboardTiles[x][y] = playerSymbol; 
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