const STORAGE_KEYS={game:"chess_game",settings:"chess_settings",stats:"chess_stats",achievements:"chess_achievements"};
function saveJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
function loadJSON(key,fallback=null){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback;}catch{return fallback;}}
function saveGame(){if(!GameState.settings.autoSave)return;saveJSON(STORAGE_KEYS.game,{board:GameState.board,turn:GameState.turn,history:GameState.history,captured:GameState.captured,gameMode:GameState.gameMode,aiDifficulty:GameState.aiDifficulty,gameStartedAt:GameState.gameStartedAt,players:GameState.players,castling:GameState.castling,enPassant:GameState.enPassant});}
function loadGame(){const d=loadJSON(STORAGE_KEYS.game);if(!validateGameData(d)){localStorage.removeItem(STORAGE_KEYS.game);return false;}Object.assign(GameState,d);return true;}
function deleteSavedGame(){localStorage.removeItem(STORAGE_KEYS.game);}
function saveSettings(){saveJSON(STORAGE_KEYS.settings,GameState.settings);}
function loadSettings(){const s=loadJSON(STORAGE_KEYS.settings);if(s&&validateSettings(s))GameState.settings={...GameState.settings,...s};}
function validateGameData(d){if(!d||typeof d!=="object"||!Array.isArray(d.board)||d.board.length!==8)return false;if(!d.board.every(r=>Array.isArray(r)&&r.length===8&&r.every(p=>p===null||/^[wb][prnbqk]$/.test(p))))return false;if(!["white","black"].includes(d.turn)||!Array.isArray(d.history))return false;if(d.history.some(m=>!m||!m.from||!m.to||typeof m.notation!=="string"))return false;return true;}