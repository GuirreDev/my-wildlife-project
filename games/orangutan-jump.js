const orangCanvas = document.getElementById("orangutanCanvas");
const orangCtx = orangCanvas.getContext("2d");
const orangScoreEl = document.getElementById("orangutanScore");

let orangAnimationId;
let orangutan;
let machines = [];
let orangFrames = 0;
let orangDistance = 0;

function startOrangutanGame() {
    cancelAnimationFrame(orangAnimationId);
    
    orangutan = { 
        x: 50, y: 300, width: 40, height: 40, 
        dy: 0, gravity: 0.6, jumpPower: -12, grounded: false 
    };
    machines = [];
    orangFrames = 0;
    orangDistance = 0;
    orangScoreEl.innerText = orangDistance;

    updateOrangutanGame();
}

function stopOrangutanGame() {
    cancelAnimationFrame(orangAnimationId);
}

function updateOrangutanGame() {
    // Background
    orangCtx.fillStyle = "#A9DFBF"; // Jungle sky
    orangCtx.fillRect(0, 0, orangCanvas.width, orangCanvas.height);
    
    // Ground
    orangCtx.fillStyle = "#8B4513";
    orangCtx.fillRect(0, 340, orangCanvas.width, 60);

    // Gravity
    orangutan.dy += orangutan.gravity;
    orangutan.y += orangutan.dy;

    // Floor collision
    if (orangutan.y + orangutan.height >= 340) {
        orangutan.y = 340 - orangutan.height;
        orangutan.dy = 0;
        orangutan.grounded = true;
    } else {
        orangutan.grounded = false;
    }

    // Draw Orangutan
    orangCtx.fillStyle = "#d35400"; // Orange-brown
    // Tip: Use ctx.drawImage(orangutanImg, ...)
    orangCtx.fillRect(orangutan.x, orangutan.y, orangutan.width, orangutan.height);

    // Handle Deforestation Machines (Obstacles)
    if (orangFrames % 90 === 0) {
        machines.push({ x: orangCanvas.width, y: 300, width: 40, height: 40, speed: 4 });
    }

    for (let i = 0; i < machines.length; i++) {
        machines[i].x -= machines[i].speed;
        
        orangCtx.fillStyle = "#2c3e50"; // Dark machine color
        // Tip: Use ctx.drawImage(machineImg, ...)
        orangCtx.fillRect(machines[i].x, machines[i].y, machines[i].width, machines[i].height);

        // Collision detection
        if (orangutan.x < machines[i].x + machines[i].width &&
            orangutan.x + orangutan.width > machines[i].x &&
            orangutan.y < machines[i].y + machines[i].height &&
            orangutan.y + orangutan.height > machines[i].y) {
            
            stopOrangutanGame();
            alert(`Game Over! The forest is shrinking. You traveled ${Math.floor(orangDistance / 10)} meters.`);
            return;
        }
    }

    // Remove off-screen machines
    machines = machines.filter(m => m.x + m.width > 0);

    // Score
    orangDistance++;
    if (orangDistance % 10 === 0) {
        orangScoreEl.innerText = Math.floor(orangDistance / 10);
    }

    orangFrames++;
    orangAnimationId = requestAnimationFrame(updateOrangutanGame);
}

// Jump Control
window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && orangutan.grounded) {
        e.preventDefault(); // Stop page scrolling
        orangutan.dy = orangutan.jumpPower;
        orangutan.grounded = false;
    }
});

// Touch control for mobile
orangCanvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (orangutan.grounded) {
        orangutan.dy = orangutan.jumpPower;
        orangutan.grounded = false;
    }
});