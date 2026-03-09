const beaverCanvas = document.getElementById("beaverCanvas");
const beaverCtx = beaverCanvas.getContext("2d");
const beaverScoreEl = document.getElementById("beaverScore");

let beaverGameLoop;
const gridSize = 20;
const cols = 600 / gridSize;
const rows = 400 / gridSize;

let beaverTail = [];
let beaverLength = 3;
let beaverX = 10;
let beaverY = 10;

// Movement and Input Lock
let velocityX = 1;
let velocityY = 0;
let inputQueue = []; // Queue inputs to prevent the classic Snake suicide bug

let logX = 15;
let logY = 15;
let rocks = [];
let score = 0;
let baseSpeed = 130;
let frameCount = 0; // For background animation

function startBeaverGame() {
    if (beaverGameLoop) clearTimeout(beaverGameLoop);
    
    // Reset Variables
    beaverTail = [];
    beaverLength = 3;
    beaverX = 10;
    beaverY = 10;
    velocityX = 1; 
    velocityY = 0;
    inputQueue = [];
    rocks = [];
    score = 0;
    baseSpeed = 130;
    frameCount = 0;
    beaverScoreEl.innerText = score;
    
    placeItem('log');
    gameTick();
}

function stopBeaverGame() {
    if (beaverGameLoop) clearTimeout(beaverGameLoop);
}

// Smart Spawning Logic
function placeItem(type) {
    let newX, newY, isValid;
    do {
        isValid = true;
        newX = Math.floor(Math.random() * cols);
        newY = Math.floor(Math.random() * rows);
        
        // Prevent spawning on head
        if (newX === beaverX && newY === beaverY) isValid = false;
        
        // Prevent spawning on tail
        for (let part of beaverTail) {
            if (part.x === newX && part.y === newY) isValid = false;
        }
        
        // Prevent spawning on existing rocks
        for (let rock of rocks) {
            if (rock.x === newX && rock.y === newY) isValid = false;
        }
        
        // Prevent rocks from spawning on the log
        if (type === 'rock' && newX === logX && newY === logY) isValid = false;
        
    } while (!isValid);

    if (type === 'log') {
        logX = newX;
        logY = newY;
    } else if (type === 'rock') {
        rocks.push({ x: newX, y: newY });
    }
}

function gameTick() {
    frameCount++;
    
    // Process next input from queue
    if (inputQueue.length > 0) {
        const nextInput = inputQueue.shift();
        velocityX = nextInput.vx;
        velocityY = nextInput.vy;
    }

    beaverX += velocityX;
    beaverY += velocityY;

    // 1. Wall Collision
    if (beaverX < 0 || beaverX >= cols || beaverY < 0 || beaverY >= rows) {
        gameOver("You hit the riverbank!");
        return;
    }

    // 2. Self Collision
    for (let i = 0; i < beaverTail.length; i++) {
        if (beaverTail[i].x === beaverX && beaverTail[i].y === beaverY) {
            gameOver("You bit your own tail!");
            return;
        }
    }

    // 3. Rock Collision
    for (let rock of rocks) {
        if (rock.x === beaverX && rock.y === beaverY) {
            gameOver("You smashed into a rock!");
            return;
        }
    }

    // Update tail
    beaverTail.push({ x: beaverX, y: beaverY });
    while (beaverTail.length > beaverLength) {
        beaverTail.shift();
    }

    // 4. Eat Log
    if (beaverX === logX && beaverY === logY) {
        beaverLength++;
        score += 10;
        beaverScoreEl.innerText = score;
        placeItem('log');
        
        // Spawn a rock every 30 points to increase difficulty
        if (score % 30 === 0) {
            placeItem('rock');
        }
    }

    drawBeaverGame();
    
    // Dynamic speed scaling
    let currentSpeed = Math.max(55, baseSpeed - (score * 1.2));
    beaverGameLoop = setTimeout(gameTick, currentSpeed);
}

function gameOver(reason) {
    stopBeaverGame();
    
    // Draw Dark Overlay
    beaverCtx.fillStyle = "rgba(0, 0, 0, 0.6)";
    beaverCtx.fillRect(0, 0, beaverCanvas.width, beaverCanvas.height);
    
    // Draw Text
    beaverCtx.fillStyle = "white";
    beaverCtx.textAlign = "center";
    
    beaverCtx.font = "bold 28px Poppins, Arial";
    beaverCtx.fillText("Game Over!", beaverCanvas.width / 2, beaverCanvas.height / 2 - 25);
    
    beaverCtx.font = "18px Poppins, Arial";
    beaverCtx.fillStyle = "#E74C3C";
    beaverCtx.fillText(reason, beaverCanvas.width / 2, beaverCanvas.height / 2 + 10);
    
    beaverCtx.fillStyle = "white";
    beaverCtx.fillText(`Final Score: ${score}`, beaverCanvas.width / 2, beaverCanvas.height / 2 + 40);
}

function drawBeaverGame() {
    // Animated Water Background
    let waveOffset = Math.sin(frameCount * 0.1) * 30;
    let gradient = beaverCtx.createLinearGradient(0, 0, beaverCanvas.width, beaverCanvas.height + waveOffset);
    gradient.addColorStop(0, "#5DADE2");
    gradient.addColorStop(1, "#2874A6");
    beaverCtx.fillStyle = gradient;
    beaverCtx.fillRect(0, 0, beaverCanvas.width, beaverCanvas.height);

    // Subtle Grid Lines
    beaverCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    beaverCtx.lineWidth = 1;
    for (let i = 0; i < cols; i++) {
        beaverCtx.beginPath(); beaverCtx.moveTo(i * gridSize, 0); beaverCtx.lineTo(i * gridSize, beaverCanvas.height); beaverCtx.stroke();
    }
    for (let i = 0; i < rows; i++) {
        beaverCtx.beginPath(); beaverCtx.moveTo(0, i * gridSize); beaverCtx.lineTo(beaverCanvas.width, i * gridSize); beaverCtx.stroke();
    }

    beaverCtx.textAlign = "center";
    beaverCtx.textBaseline = "middle";
    const offset = gridSize / 2;

    // Draw Log
    beaverCtx.font = "16px Arial";
    beaverCtx.fillText("🪵", logX * gridSize + offset, logY * gridSize + offset);

    // Draw Rocks
    beaverCtx.font = "18px Arial";
    for (let rock of rocks) {
        beaverCtx.fillText("🪨", rock.x * gridSize + offset, rock.y * gridSize + offset);
    }

    // Draw Beaver Tail (Connected Segments)
    if (beaverTail.length > 0) {
        beaverCtx.lineCap = "round";
        beaverCtx.lineJoin = "round";
        
        // Outer dark outline
        beaverCtx.strokeStyle = "#6E2C00";
        beaverCtx.lineWidth = gridSize - 4;
        beaverCtx.beginPath();
        beaverCtx.moveTo(beaverTail[0].x * gridSize + offset, beaverTail[0].y * gridSize + offset);
        for (let i = 1; i < beaverTail.length; i++) {
            beaverCtx.lineTo(beaverTail[i].x * gridSize + offset, beaverTail[i].y * gridSize + offset);
        }
        beaverCtx.stroke();
        
        // Inner lighter color for depth
        beaverCtx.strokeStyle = "#D35400";
        beaverCtx.lineWidth = gridSize - 10;
        beaverCtx.stroke();
    }

    // Draw Beaver Head
    beaverCtx.font = "20px Arial";
    beaverCtx.fillText("🦫", beaverX * gridSize + offset, beaverY * gridSize + offset);
}

// Input handling with queue system
window.addEventListener("keydown", (e) => {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) {
        e.preventDefault();
    }

    // Determine the last planned velocity to prevent self-reversal in the queue
    let lastV = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : { vx: velocityX, vy: velocityY };

    // Max 3 inputs in queue to keep controls responsive
    if (inputQueue.length < 3) {
        if (e.key === "ArrowUp" && lastV.vy !== 1) inputQueue.push({ vx: 0, vy: -1 });
        else if (e.key === "ArrowDown" && lastV.vy !== -1) inputQueue.push({ vx: 0, vy: 1 });
        else if (e.key === "ArrowLeft" && lastV.vx !== 1) inputQueue.push({ vx: -1, vy: 0 });
        else if (e.key === "ArrowRight" && lastV.vx !== -1) inputQueue.push({ vx: 1, vy: 0 });
    }
});
