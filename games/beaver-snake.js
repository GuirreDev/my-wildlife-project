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
let baseSpeed = 120; // Starting interval in ms

function startBeaverGame() {
    beaverTail = [];
    beaverLength = 3;
    beaverX = 10;
    beaverY = 10;
    velocityX = 1; 
    velocityY = 0;
    score = 0;
    baseSpeed = 120;
    beaverScoreEl.innerText = score;
    placeLog();

    if (beaverGameLoop) clearTimeout(beaverGameLoop);
    gameTick();
}

function stopBeaverGame() {
    if (beaverGameLoop) clearTimeout(beaverGameLoop);
}

function placeLog() {
    logX = Math.floor(Math.random() * (beaverCanvas.width / gridSize));
    logY = Math.floor(Math.random() * (beaverCanvas.height / gridSize));
}

function gameTick() {
    drawBeaverGame();
    // Speed up slightly as score increases
    let currentSpeed = Math.max(50, baseSpeed - (score * 1.5));
    beaverGameLoop = setTimeout(gameTick, currentSpeed);
}

function drawBeaverGame() {
    beaverX += velocityX;
    beaverY += velocityY;

    if (beaverX < 0 || beaverX >= beaverCanvas.width / gridSize || 
        beaverY < 0 || beaverY >= beaverCanvas.height / gridSize) {
        stopBeaverGame();
        alert(`Game Over! You collected ${score} logs for your dam.`);
        return;
    }

    // Aesthetic: Water Gradient
    let gradient = beaverCtx.createLinearGradient(0, 0, beaverCanvas.width, beaverCanvas.height);
    gradient.addColorStop(0, "#85C1E9");
    gradient.addColorStop(1, "#3498DB");
    beaverCtx.fillStyle = gradient;
    beaverCtx.fillRect(0, 0, beaverCanvas.width, beaverCanvas.height);

    beaverCtx.textAlign = "center";
    beaverCtx.textBaseline = "middle";

    // Draw Log (Food)
    beaverCtx.font = "18px Arial";
    beaverCtx.fillText("🪵", logX * gridSize + gridSize / 2, logY * gridSize + gridSize / 2);

    // Draw Beaver Tail
    beaverCtx.fillStyle = "#873600";
    for (let i = 0; i < beaverTail.length; i++) {
        beaverCtx.beginPath();
        beaverCtx.arc(beaverTail[i].x * gridSize + gridSize/2, beaverTail[i].y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
        beaverCtx.fill();
        
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

    // Draw Beaver Head
    beaverCtx.font = "22px Arial";
    beaverCtx.fillText("🦫", beaverX * gridSize + gridSize / 2, beaverY * gridSize + gridSize / 2);

    if (beaverX === logX && beaverY === logY) {
        beaverLength++;
        score += 10;
        beaverScoreEl.innerText = score;
        placeLog();
    }
}

window.addEventListener("keydown", (e) => {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
    if (e.key === "ArrowUp" && velocityY !== 1) { velocityX = 0; velocityY = -1; }
    if (e.key === "ArrowDown" && velocityY !== -1) { velocityX = 0; velocityY = 1; }
    if (e.key === "ArrowLeft" && velocityX !== 1) { velocityX = -1; velocityY = 0; }
    if (e.key === "ArrowRight" && velocityX !== -1) { velocityX = 1; velocityY = 0; }
});
