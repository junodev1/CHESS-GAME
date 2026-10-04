const STORAGE_KEYS={game:"chess_game",settings:"chess_settings",stats:"chess_stats",achievements:"chess_achievements"};

function saveJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
function loadJSON(key,fallback=null){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback;}catch{return fallback;}}

function saveGame(){
    if(!GameState.settings.autoSave)return;
    saveJSON(STORAGE_KEYS.game,{
        board:GameState.board,
        turn:GameState.turn,
        history:GameState.history,
        captured:GameState.captured,
        gameMode:GameState.gameMode,
        aiDifficulty:GameState.aiDifficulty,
        gameStartedAt:GameState.gameStartedAt,
        players:GameState.players,
        castling:GameState.castling,
        enPassant:GameState.enPassant
    });
}

function loadGame(){
    const d=loadJSON(STORAGE_KEYS.game);
    if(!validateGameData(d)){
        try{localStorage.removeItem(STORAGE_KEYS.game);}catch{}
        return false;
    }
    Object.assign(GameState,d);
    return true;
}

function deleteSavedGame(){try{localStorage.removeItem(STORAGE_KEYS.game);}catch{}}
function saveSettings(){saveJSON(STORAGE_KEYS.settings,GameState.settings);}
function loadSettings(){const s=loadJSON(STORAGE_KEYS.settings);if(s&&validateSettings(s))GameState.settings={...GameState.settings,...s};}

function validateGameData(d){
    if(!d||typeof d!=="object"||!Array.isArray(d.board)||d.board.length!==8)return false;
    if(!d.board.every(r=>Array.isArray(r)&&r.length===8&&r.every(p=>p===null||/^[wb][prnbqk]$/.test(p))))return false;
    if(!["white","black"].includes(d.turn)||!Array.isArray(d.history)||d.history.length>500)return false;
    if(d.history.some(m=>!m||!m.from||!m.to||typeof m.notation!=="string"||!["white","black"].includes(m.color)))return false;
    if(!d.captured||!Array.isArray(d.captured.white)||!Array.isArray(d.captured.black))return false;
    if(d.castling&&typeof d.castling!=="object")return false;
    if(d.enPassant!==null&&d.enPassant!==undefined&&(!Number.isInteger(d.enPassant.row)||!Number.isInteger(d.enPassant.col)||!isInsideBoard(d.enPassant.row,d.enPassant.col)))return false;
    if(d.gameMode!==undefined&&!["ai","pvp"].includes(d.gameMode))return false;
    if(d.aiDifficulty!==undefined&&!["easy","medium","hard"].includes(d.aiDifficulty))return false;
    if(d.gameStartedAt!==undefined&&d.gameStartedAt!==null&&!Number.isFinite(d.gameStartedAt))return false;
    return true;
}
