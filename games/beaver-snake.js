const beaverCanvas = document.getElementById("beaverCanvas");
const beaverCtx = beaverCanvas.getContext("2d");
const beaverScoreEl = document.getElementById("beaverScore");

let beaverGameLoop;
const gridSize = 20;
let beaverTail = [];
let beaverLength = 3;
let beaverX = 10;
let beaverY = 10;
let velocityX = 0;
let velocityY = 0;
let logX = 15;
let logY = 15;
let score = 0;

function startBeaverGame() {
    // Reset Variables
    beaverTail = [];
    beaverLength = 3;
    beaverX = 10;
    beaverY = 10;
    velocityX = 1; // Start moving right
    velocityY = 0;
    score = 0;
    beaverScoreEl.innerText = score;
    placeLog();

    // Clear previous loop if any
    if (beaverGameLoop) clearInterval(beaverGameLoop);
    
    // Start Loop (10 frames per second)
    beaverGameLoop = setInterval(drawBeaverGame, 100);
}

function stopBeaverGame() {
    clearInterval(beaverGameLoop);
}

function placeLog() {
    logX = Math.floor(Math.random() * (beaverCanvas.width / gridSize));
    logY = Math.floor(Math.random() * (beaverCanvas.height / gridSize));
}

function drawBeaverGame() {
    // Move beaver
    beaverX += velocityX;
    beaverY += velocityY;

    // Wall collision (Game Over)
    if (beaverX < 0 || beaverX >= beaverCanvas.width / gridSize || 
        beaverY < 0 || beaverY >= beaverCanvas.height / gridSize) {
        stopBeaverGame();
        alert(`Game Over! You collected ${score} logs for your dam.`);
        return;
    }

    // Background
    beaverCtx.fillStyle = "#A3E4D7"; // River water color
    beaverCtx.fillRect(0, 0, beaverCanvas.width, beaverCanvas.height);

    // Draw Log (Food)
    beaverCtx.fillStyle = "#8B4513"; // Wood brown
    // Tip: Replace fillRect with ctx.drawImage(logImage, ...)
    beaverCtx.fillRect(logX * gridSize, logY * gridSize, gridSize - 2, gridSize - 2);

    // Draw Beaver
    beaverCtx.fillStyle = "#D35400"; // Beaver brown
    for (let i = 0; i < beaverTail.length; i++) {
        // Tip: Replace with beaver image sprite
        beaverCtx.fillRect(beaverTail[i].x * gridSize, beaverTail[i].y * gridSize, gridSize - 2, gridSize - 2);
        
        // Self-collision (Game Over)
        if (beaverTail[i].x === beaverX && beaverTail[i].y === beaverY) {
            stopBeaverGame();
            alert(`Game Over! You bumped into your own tail.`);
            return;
        }
    }

    beaverTail.push({ x: beaverX, y: beaverY });
    while (beaverTail.length > beaverLength) {
        beaverTail.shift();
    }

    // Eat Log
    if (beaverX === logX && beaverY === logY) {
        beaverLength++;
        score += 10;
        beaverScoreEl.innerText = score;
        placeLog();
    }
}

// Controls
window.addEventListener("keydown", (e) => {
    // Prevent default scrolling for arrow keys
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
    if (e.key === "ArrowUp" && velocityY !== 1) { velocityX = 0; velocityY = -1; }
    if (e.key === "ArrowDown" && velocityY !== -1) { velocityX = 0; velocityY = 1; }
    if (e.key === "ArrowLeft" && velocityX !== 1) { velocityX = -1; velocityY = 0; }
    if (e.key === "ArrowRight" && velocityX !== -1) { velocityX = 1; velocityY = 0; }
});