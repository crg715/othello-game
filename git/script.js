document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('othello-board');
    const blackScoreElement = document.getElementById('black-score');
    const whiteScoreElement = document.getElementById('white-score');
    const statusElement = document.getElementById('game-status');
    const resetButton = document.getElementById('reset-button');

    let board = [];
    let currentPlayer = 'black';
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    function initializeGame() {
        board = Array.from({ length: 8 }, () => Array(8).fill(null));
        board[3][3] = 'white';
        board[3][4] = 'black';
        board[4][3] = 'black';
        board[4][4] = 'white';
        currentPlayer = 'black';
        statusElement.textContent = '黒のターンです';
        renderBoard();
    }

    function renderBoard() {
        boardElement.innerHTML = '';
        let blackCount = 0;
        let whiteCount = 0;
        const validMoves = getValidMoves(currentPlayer);

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                if (board[row][col]) {
                    const piece = document.createElement('div');
                    piece.className = `piece ${board[row][col]}`;
                    cell.appendChild(piece);
                }

                if (validMoves.some(move => move[0] === row && move[1] === col)) {
                    cell.classList.add('valid-move');
                }

                if (board[row][col] === 'black') blackCount++;
                if (board[row][col] === 'white') whiteCount++;

                cell.addEventListener('click', handleCellClick);
                boardElement.appendChild(cell);
            }
        }
        blackScoreElement.textContent = blackCount;
        whiteScoreElement.textContent = whiteCount;
    }

    function getFlippablePieces(startRow, startCol, player) {
        const opponent = player === 'black' ? 'white' : 'black';
        const flippable = [];
        
        for (const [dr, dc] of directions) {
            let tempFlipped = [];
            let r = startRow + dr;
            let c = startCol + dc;

            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if (board[r][c] === opponent) {
                    tempFlipped.push([r, c]);
                } else if (board[r][c] === player) {
                    if (tempFlipped.length > 0) {
                        flippable.push(...tempFlipped);
                    }
                    break;
                } else {
                    break;
                }
                r += dr;
                c += dc;
            }
        }
        return flippable;
    }

    function getValidMoves(player) {
        const validMoves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col] === null) {
                    if (getFlippablePieces(row, col, player).length > 0) {
                        validMoves.push([row, col]);
                    }
                }
            }
        }
        return validMoves;
    }

    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        const flippablePieces = getFlippablePieces(row, col, currentPlayer);

        if (board[row][col] !== null || flippablePieces.length === 0) {
            return;
        }

        board[row][col] = currentPlayer;
        flippablePieces.forEach(([r, c]) => {
            board[r][c] = currentPlayer;
        });

        const nextPlayer = currentPlayer === 'black' ? 'white' : 'black';
        if (getValidMoves(nextPlayer).length > 0) {
            currentPlayer = nextPlayer;
            statusElement.textContent = `${currentPlayer === 'black' ? '黒' : '白'}のターンです`;
        } else if (getValidMoves(currentPlayer).length > 0) {
            statusElement.textContent = `${nextPlayer === 'black' ? '黒' : '白'}はパスです。${currentPlayer === 'black' ? '黒' : '白'}のターンが続きます。`;
        } else {
            endGame();
        }
        renderBoard();
    }

    function endGame() {
        let blackScore = parseInt(blackScoreElement.textContent);
        let whiteScore = parseInt(whiteScoreElement.textContent);
        let winner = '';
        if (blackScore > whiteScore) {
            winner = '黒の勝ちです！';
        } else if (whiteScore > blackScore) {
            winner = '白の勝ちです！';
        } else {
            winner = '引き分けです！';
        }
        statusElement.textContent = `ゲーム終了。${winner}`;
        boardElement.removeEventListener('click', handleCellClick);
    }

    resetButton.addEventListener('click', initializeGame);
    initializeGame();
});