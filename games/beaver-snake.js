const beaverCanvas = document.getElementById("beaverCanvas");
const beaverCtx = beaverCanvas.getContext("2d");
const beaverScoreEl = document.getElementById("beaverScore");

let beaverGameLoop;
const gridSize = 20;
const cols = beaverCanvas.width / gridSize;
const rows = beaverCanvas.height / gridSize;

let beaverTail = [];
let beaverLength = 4;
let beaverX = 10;
let beaverY = 10;
let velocityX = 1;
let velocityY = 0;
let inputQueue = [];

let logX = 15;
let logY = 15;
let rocks = [];
let score = 0;
let frameCount = 0;

function startBeaverGame() {
    if (beaverGameLoop) clearTimeout(beaverGameLoop);
    beaverTail = [];
    beaverLength = 4;
    beaverX = 10;
    beaverY = 10;
    velocityX = 1; velocityY = 0;
    inputQueue = [];
    rocks = [];
    score = 0;
    beaverScoreEl.innerText = score;
    placeItem('log');
    gameTick();
}

function stopBeaverGame() {
    clearTimeout(beaverGameLoop);
}

function placeItem(type) {
    let newX, newY, isValid;
    do {
        isValid = true;
        newX = Math.floor(Math.random() * cols);
        newY = Math.floor(Math.random() * rows);
        if (newX === beaverX && newY === beaverY) isValid = false;
        beaverTail.forEach(p => { if(p.x === newX && p.y === newY) isValid = false; });
        rocks.forEach(r => { if(r.x === newX && r.y === newY) isValid = false; });
    } while (!isValid);

    if (type === 'log') { logX = newX; logY = newY; }
    else { rocks.push({ x: newX, y: newY }); }
}

function gameTick() {
    frameCount++;
    if (inputQueue.length > 0) {
        const next = inputQueue.shift();
        velocityX = next.vx; velocityY = next.vy;
    }

    beaverX += velocityX;
    beaverY += velocityY;

    // Collisions
    if (beaverX < 0 || beaverX >= cols || beaverY < 0 || beaverY >= rows) return gameOver("Hit the bank!");
    if (beaverTail.some(p => p.x === beaverX && p.y === beaverY)) return gameOver("Bit your tail!");
    if (rocks.some(r => r.x === beaverX && r.y === beaverY)) return gameOver("Crashed into a rock!");

    beaverTail.push({ x: beaverX, y: beaverY });
    while (beaverTail.length > beaverLength) beaverTail.shift();

    if (beaverX === logX && beaverY === logY) {
        score += 10;
        beaverLength++;
        beaverScoreEl.innerText = score;
        placeItem('log');
        if (score % 30 === 0) placeItem('rock');
    }

    draw();
    beaverGameLoop = setTimeout(gameTick, Math.max(60, 130 - (score * 0.8)));
}

function draw() {
    // Water
    beaverCtx.fillStyle = "#3498db";
    beaverCtx.fillRect(0, 0, beaverCanvas.width, beaverCanvas.height);
    
    // Draw Rocks
    rocks.forEach(r => {
        beaverCtx.fillStyle = "#7f8c8d";
        beaverCtx.beginPath();
        beaverCtx.moveTo(r.x*gridSize+5, r.y*gridSize+15);
        beaverCtx.lineTo(r.x*gridSize+10, r.y*gridSize+5);
        beaverCtx.lineTo(r.x*gridSize+15, r.y*gridSize+15);
        beaverCtx.fill();
    });

    // Draw Log
    beaverCtx.fillStyle = "#5d4037";
    beaverCtx.fillRect(logX*gridSize+2, logY*gridSize+6, gridSize-4, 8);
    beaverCtx.strokeStyle = "#3e2723";
    beaverCtx.strokeRect(logX*gridSize+2, logY*gridSize+6, gridSize-4, 8);

    // Draw Beaver
    beaverTail.forEach((p, i) => {
        const isHead = i === beaverTail.length - 1;
        beaverCtx.fillStyle = isHead ? "#8d6e63" : "#6d4c41";
        
        // Body segments
        beaverCtx.beginPath();
        beaverCtx.roundRect(p.x*gridSize+2, p.y*gridSize+2, gridSize-4, gridSize-4, 5);
        beaverCtx.fill();

        if (isHead) {
            // Ears
            beaverCtx.fillStyle = "#5d4037";
            beaverCtx.fillRect(p.x*gridSize+2, p.y*gridSize, 5, 5);
            beaverCtx.fillRect(p.x*gridSize+13, p.y*gridSize, 5, 5);
            // Eyes
            beaverCtx.fillStyle = "white";
            beaverCtx.fillRect(p.x*gridSize+5, p.y*gridSize+5, 3, 3);
            beaverCtx.fillRect(p.x*gridSize+12, p.y*gridSize+5, 3, 3);
        }
    });
}

function gameOver(msg) {
    beaverCtx.fillStyle = "rgba(0,0,0,0.7)";
    beaverCtx.fillRect(0,0,beaverCanvas.width,beaverCanvas.height);
    beaverCtx.fillStyle = "white";
    beaverCtx.font = "20px Arial";
    beaverCtx.textAlign = "center";
    beaverCtx.fillText(msg, beaverCanvas.width/2, beaverCanvas.height/2);
}

window.addEventListener("keydown", e => {
    const last = inputQueue.length > 0 ? inputQueue[inputQueue.length-1] : {vx: velocityX, vy: velocityY};
    if (e.key === "ArrowUp" && last.vy !== 1) inputQueue.push({vx:0, vy:-1});
    if (e.key === "ArrowDown" && last.vy !== -1) inputQueue.push({vx:0, vy:1});
    if (e.key === "ArrowLeft" && last.vx !== 1) inputQueue.push({vx:-1, vy:0});
    if (e.key === "ArrowRight" && last.vx !== -1) inputQueue.push({vx:1, vy:0});
});
