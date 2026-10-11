// Stockfish engine instance
let StockfishEngine = null;
let stockfishReady = false;
let stockfishQueue = [];

// AI configuration
const AI_DIFFICULTY = {
  easy: { depth: 6, skillLevel: 2 },
  medium: { depth: 15, skillLevel: 5 },
  hard: { depth: 20, skillLevel: 18 }
};

const AI_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
const AI_CENTER = [
  [-20, -10, -5, -5, -5, -5, -10, -20],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 5, 10, 12, 12, 10, 5, -5],
  [-5, 5, 12, 15, 15, 12, 5, -5],
  [-5, 5, 12, 15, 15, 12, 5, -5],
  [-5, 5, 10, 12, 12, 10, 5, -5],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-20, -10, -5, -5, -5, -5, -10, -20]
];

// Initialize Stockfish
async function initializeStockfish() {
  try {
    if (typeof STOCKFISH !== 'undefined') {
      StockfishEngine = await STOCKFISH();
      stockfishReady = true;
      console.log('✓ Stockfish engine initialized successfully');
      
      // Process any queued commands
      processStockfishQueue();
    } else {
      console.warn('⚠ Stockfish not available, using fallback AI');
    }
  } catch (error) {
    console.error('✗ Failed to initialize Stockfish:', error);
    stockfishReady = false;
  }
}

// Send command to Stockfish
function stockfishCommand(cmd) {
  if (!stockfishReady || !StockfishEngine) {
    stockfishQueue.push(cmd);
    return;
  }
  
  try {
    StockfishEngine.postMessage(cmd);
  } catch (error) {
    console.error('Error sending to Stockfish:', error);
  }
}

// Process queued Stockfish commands
function processStockfishQueue() {
  while (stockfishQueue.length > 0 && stockfishReady) {
    const cmd = stockfishQueue.shift();
    stockfishCommand(cmd);
  }
}

// Convert board to FEN notation
function boardToFEN() {
  let fen = '';
  let emptyCount = 0;
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = GameState.board[r][c];
      
      if (!piece) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        fen += piece;
      }
    }
    
    if (emptyCount > 0) {
      fen += emptyCount;
      emptyCount = 0;
    }
    
    if (r < 7) fen += '/';
  }
  
  // Add turn, castling, en passant
  fen += ' ' + (GameState.turn === 'white' ? 'w' : 'b');
  fen += ' KQkq -';
  fen += ' 0 ' + (Math.floor(GameState.history.length / 2) + 1);
  
  return fen;
}

// Make AI move with Stockfish
function makeAIMove() {
  if (GameState.turn !== 'black' || GameState.result) return;
  
  inputLocked = true;
  const moves = generateAllMoves('black');
  
  if (!moves.length) {
    inputLocked = false;
    return finishGame();
  }
  
  const difficulty = AI_DIFFICULTY[GameState.aiDifficulty] || AI_DIFFICULTY.medium;
  
  // Use Stockfish if available, otherwise use fallback
  if (stockfishReady && StockfishEngine) {
    getStockfishMove(moves, difficulty);
  } else {
    getAIMoveFallback(moves, difficulty);
  }
}

// Get best move from Stockfish
function getStockfishMove(moves, difficulty) {
  const fen = boardToFEN();
  let bestMove = null;
  let bestMoveFound = false;
  
  // Create listener for Stockfish response
  const messageHandler = (msg) => {
    const line = msg.data || msg;
    
    if (line && line.startsWith && line.startsWith('bestmove')) {
      // Parse: "bestmove e2e4 ponder d7d5"
      const parts = line.split(' ');
      bestMove = parts[1];
      bestMoveFound = true;
      
      // Convert algebraic notation to move object
      if (bestMove && bestMove.length >= 4) {
        const fromCol = bestMove.charCodeAt(0) - 97;
        const fromRow = 8 - parseInt(bestMove[1]);
        const toCol = bestMove.charCodeAt(2) - 97;
        const toRow = 8 - parseInt(bestMove[3]);
        
        if (isValidMove(fromRow, fromCol, toRow, toCol)) {
          makeMove(fromRow, fromCol, toRow, toCol);
        } else {
          // Fallback if move parsing fails
          const fallbackMove = selectAIMove(generateAllMoves('black'), difficulty);
          if (fallbackMove) {
            makeMove(fallbackMove.from.row, fallbackMove.from.col, fallbackMove.to.row, fallbackMove.to.col);
          }
        }
      }
      
      inputLocked = false;
      
      // Remove listener
      if (StockfishEngine && StockfishEngine.removeEventListener) {
        StockfishEngine.removeEventListener('message', messageHandler);
      }
    }
  };
  
  // Add message listener if available
  if (StockfishEngine && StockfishEngine.addEventListener) {
    StockfishEngine.addEventListener('message', messageHandler);
  }
  
  // Send position and go command
  stockfishCommand('ucinewgame');
  stockfishCommand(`position fen ${fen}`);
  stockfishCommand(`go depth ${difficulty.depth}`);
  
  // Timeout fallback
  setTimeout(() => {
    if (!bestMoveFound && inputLocked) {
      inputLocked = false;
      const fallbackMove = selectAIMove(moves, difficulty);
      if (fallbackMove) {
        makeMove(fallbackMove.from.row, fallbackMove.from.col, fallbackMove.to.row, fallbackMove.to.col);
      }
    }
  }, 3000);
}

// Fallback AI without Stockfish
function getAIMoveFallback(moves, difficulty) {
  setTimeout(() => {
    const bestMove = selectAIMove(moves, difficulty);
    if (bestMove) {
      makeMove(bestMove.from.row, bestMove.from.col, bestMove.to.row, bestMove.to.col);
    }
    inputLocked = false;
  }, 500);
}

// Helper to validate move coordinates
function isValidMove(fromRow, fromCol, toRow, toCol) {
  return (
    fromRow >= 0 && fromRow < 8 &&
    fromCol >= 0 && fromCol < 8 &&
    toRow >= 0 && toRow < 8 &&
    toCol >= 0 && toCol < 8
  );
}

// Select best AI move using minimax
function selectAIMove(moves, difficulty) {
  if (!moves.length) return null;
  
  // Easy: mostly random
  if (difficulty.skillLevel <= 3) {
    return moves[Math.floor(Math.random() * moves.length)];
  }
  
  // Medium/Hard: use evaluation
  let best = null;
  let bestScore = -Infinity;
  
  for (const move of moves) {
    const snapshot = snapshotPosition();
    applyMoveToBoard(move, false);
    
    const score = searchPosition('white', difficulty.depth - 1, -Infinity, Infinity);
    
    restorePosition(snapshot);
    
    if (score > bestScore) {
      bestScore = score;
      best = move;
    }
  }
  
  return best || moves[0];
}

// Minimax search
function searchPosition(color, depth, alpha, beta) {
  const moves = generateAllMoves(color);
  
  if (!moves.length) {
    if (isKingInCheck(color)) {
      return color === 'black' ? 100000 - (20 - depth) * 100 : -100000 + (20 - depth) * 100;
    }
    return 0;
  }
  
  if (depth === 0) {
    return evaluatePosition(color);
  }
  
  if (color === 'black') {
    let maxScore = -Infinity;
    for (const move of moves) {
      const snap = snapshotPosition();
      applyMoveToBoard(move, false);
      const score = searchPosition('white', depth - 1, alpha, beta);
      restorePosition(snap);
      
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of moves) {
      const snap = snapshotPosition();
      applyMoveToBoard(move, false);
      const score = searchPosition('black', depth - 1, alpha, beta);
      restorePosition(snap);
      
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
}

// Evaluate position
function evaluatePosition(forColor = 'black') {
  let score = 0;
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = GameState.board[r][c];
      if (!piece) continue;
      
      const sign = getPieceColor(piece) === forColor ? 1 : -1;
      let value = AI_VALUES[piece[1]] || 0;
      value += AI_CENTER[r][c] * 0.1;
      
      score += sign * value;
    }
  }
  
  return score;
}

// Get best hint move
function getBestHintMove() {
  const moves = generateAllMoves(GameState.turn);
  if (!moves.length) return null;
  
  try {
    return selectAIMove(moves, AI_DIFFICULTY.medium);
  } catch (error) {
    console.error('Chess hint error:', error);
    return moves[0];
  }
}

// Random move selection
function randomMove(moves) {
  return moves[Math.floor(Math.random() * moves.length)];
}

// Helper function
function maybePieceAt(r, c) {
  return GameState.board[r]?.[c] || null;
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeStockfish);
} else {
  initializeStockfish();
}
