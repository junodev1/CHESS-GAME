function exportPGN(){
    const headers=[
        `[Event "JUNO CHESS"]`,
        `[White "${sanitizePGNValue(GameState.players.white)}"]`,
        `[Black "${sanitizePGNValue(GameState.players.black)}"]`,
        `[Result "${getPGNResult()}"]`,
        `[Opening "${sanitizePGNValue(detectOpening())}"]`
    ];
    const moves=[];
    for(let i=0;i<GameState.history.length;i+=2){
        const moveNumber=Math.floor(i/2)+1;
        const white=GameState.history[i]?.notation||"";
        const black=GameState.history[i+1]?.notation||"";
        moves.push(`${moveNumber}. ${white}${black?" "+black:""}`);
    }
    const result=getPGNResult();
    return headers.join("\n")+"\n\n"+moves.join(" ")+(result!=="*"?" "+result:"");
}
function sanitizePGNValue(value){return String(value??"").replace(/["\\\r\n\[\]]/g,"").slice(0,80);}
function getPGNResult(){return GameState.result==="win"?"1-0":GameState.result==="loss"?"0-1":GameState.result==="draw"?"1/2-1/2":"*";}
function downloadPGN(){const blob=new Blob([exportPGN()],{type:"application/x-chess-pgn"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="juno-chess.pgn";a.click();setTimeout(()=>URL.revokeObjectURL(url),0);}

function parsePGNTokens(text){
    if(typeof text!=="string"||text.length>200000)throw new Error("Invalid PGN file.");
    const cleaned=text
        .replace(/\uFEFF/g,"")
        .replace(/\[[^\]]*\]/g," ")
        .replace(/\{[^}]*\}/g," ")
        .replace(/;[^\r\n]*/g," ")
        .replace(/\([^)]*\)/g," ");
    const tokens=cleaned.split(/\s+/).filter(Boolean);
    const moves=[];
    for(const token of tokens){
        if(/^\d+\.(\.\.)?$/.test(token)||/^\d+\.\.\.$/.test(token))continue;
        if(/^(1-0|0-1|1\/2-1\/2|\*)$/.test(token))continue;
        if(/^[!?+#]+$/.test(token))continue;
        moves.push(token.replace(/[!?]+$/,""));
    }
    if(moves.length>500)throw new Error("PGN contains too many moves.");
    return moves;
}

function findMoveForSAN(san,color){
    const normalized=san.replace(/[+#]+$/,"").replace(/^0-0-0$/i,"O-O-O").replace(/^0-0$/i,"O-O");
    const legal=generateAllMoves(color);
    const candidates=[];
    for(const move of legal){
        const piece=GameState.board[move.from.row][move.from.col];
        const captured=GameState.board[move.to.row][move.to.col];
        const notation=createMoveNotation(piece,move.from.row,move.from.col,move.to.row,move.to.col,captured,move).replace(/[+#]+$/,"");
        if(notation===normalized)candidates.push(move);
    }
    if(candidates.length!==1)throw new Error("Could not resolve PGN move: "+san);
    return candidates[0];
}

function importPGN(text){
    const moves=parsePGNTokens(text);
    if(!moves.length)throw new Error("PGN contains no moves.");
    const original={
        board:structuredClone(GameState.board),turn:GameState.turn,history:structuredClone(GameState.history),
        captured:structuredClone(GameState.captured),castling:{...GameState.castling},
        enPassant:GameState.enPassant?{...GameState.enPassant}:null,result:GameState.result,
        gameStartedAt:GameState.gameStartedAt,gameEndedAt:GameState.gameEndedAt
    };
    try{
        resetGameState();
        GameState.gameMode="pvp";
        for(const san of moves){
            const move=findMoveForSAN(san,GameState.turn);
            const piece=GameState.board[move.from.row][move.from.col];
            const result=applyMoveToBoard(move,true);
            const captured=result?.captured||null;
            if(captured)GameState.captured[GameState.turn].push(captured);
            const notation=createMoveNotation(piece,move.from.row,move.from.col,move.to.row,move.to.col,captured,move);
            GameState.history.push({move:GameState.history.length+1,color:GameState.turn,piece,from:{...move.from},to:{...move.to},captured,notation,timestamp:Date.now()});
            GameState.turn=GameState.turn==="white"?"black":"white";
            if(checkGameEnd())break;
        }
        renderBoard();renderHistory();updateGameStatus();saveGame();
        return true;
    }catch(error){
        Object.assign(GameState,original);
        renderBoard();renderHistory();updateGameStatus();
        throw new Error(error.message||"Could not import PGN.");
    }
}