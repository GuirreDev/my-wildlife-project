const turtleCanvas = document.getElementById("turtleCanvas");
const turtleCtx = turtleCanvas.getContext("2d");
const turtleScoreEl = document.getElementById("turtleScore");

let turtleGameLoop;
let turtleAnimationId;
let turtlePlayer;
let nets = [];
let frames = 0;
let turtleTime = 0;

function startTurtleGame() {
    cancelAnimationFrame(turtleAnimationId);
    clearInterval(turtleGameLoop);
    
    turtlePlayer = { x: 300, y: 350, width: 30, height: 30, speed: 5, dx: 0, dy: 0 };
    nets = [];
    frames = 0;
    turtleTime = 0;
    turtleScoreEl.innerText = turtleTime;

    // Timer logic
    turtleGameLoop = setInterval(() => {
        turtleTime++;
        turtleScoreEl.innerText = turtleTime;
    }, 1000);

    updateTurtleGame();
}

function stopTurtleGame() {
    cancelAnimationFrame(turtleAnimationId);
    clearInterval(turtleGameLoop);
}

function updateTurtleGame() {
    // Clear canvas
    turtleCtx.fillStyle = "#3498db"; // Ocean blue
    turtleCtx.fillRect(0, 0, turtleCanvas.width, turtleCanvas.height);

    // Move player
    turtlePlayer.x += turtlePlayer.dx;
    turtlePlayer.y += turtlePlayer.dy;

    // Boundary checks
    if(turtlePlayer.x < 0) turtlePlayer.x = 0;
    if(turtlePlayer.x + turtlePlayer.width > turtleCanvas.width) turtlePlayer.x = turtleCanvas.width - turtlePlayer.width;
    if(turtlePlayer.y < 0) turtlePlayer.y = 0;
    if(turtlePlayer.y + turtlePlayer.height > turtleCanvas.height) turtlePlayer.y = turtleCanvas.height - turtlePlayer.height;

    // Draw Turtle (Placeholder)
    turtleCtx.fillStyle = "#2ecc71"; // Turtle green
    // Tip: Use ctx.drawImage(turtleImg, ...)
    turtleCtx.beginPath();
    turtleCtx.arc(turtlePlayer.x + 15, turtlePlayer.y + 15, 15, 0, Math.PI * 2);
    turtleCtx.fill();

    // Handle Nets (Obstacles)
    if (frames % 40 === 0) {
        let netWidth = Math.random() * 50 + 30;
        let netX = Math.random() * (turtleCanvas.width - netWidth);
        nets.push({ x: netX, y: -50, width: netWidth, height: 20, speed: Math.random() * 2 + 2 });
    }

    for (let i = 0; i < nets.length; i++) {
        nets[i].y += nets[i].speed;
        
        turtleCtx.fillStyle = "#e74c3c"; // Danger net color
        // Tip: Use ctx.drawImage(netImg, ...)
        turtleCtx.fillRect(nets[i].x, nets[i].y, nets[i].width, nets[i].height);

        // Collision Detection
        if (turtlePlayer.x < nets[i].x + nets[i].width &&
            turtlePlayer.x + turtlePlayer.width > nets[i].x &&
            turtlePlayer.y < nets[i].y + nets[i].height &&
            turtlePlayer.y + turtlePlayer.height > nets[i].y) {
            
            stopTurtleGame();
            alert(`Oh no! The turtle was caught in a net. You survived ${turtleTime} seconds.`);
            return;
        }
    }

    // Remove off-screen nets
    nets = nets.filter(net => net.y < turtleCanvas.height);

    frames++;
    turtleAnimationId = requestAnimationFrame(updateTurtleGame);
}

// Controls
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") turtlePlayer.dx = -turtlePlayer.speed;
    if (e.key === "ArrowRight") turtlePlayer.dx = turtlePlayer.speed;
    if (e.key === "ArrowUp") turtlePlayer.dy = -turtlePlayer.speed;
    if (e.key === "ArrowDown") turtlePlayer.dy = turtlePlayer.speed;
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") turtlePlayer.dx = 0;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") turtlePlayer.dy = 0;
});