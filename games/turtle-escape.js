const turtleCanvas = document.getElementById("turtleCanvas");
const turtleCtx = turtleCanvas.getContext("2d");
const turtleScoreEl = document.getElementById("turtleScore");

let turtleGameLoop;
let turtleAnimationId;
let turtlePlayer;
let nets = [];
let bubbles = [];
let frames = 0;
let turtleTime = 0;
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

// Touch variables
let isTouching = false;
let touchTargetX = 0;
let touchTargetY = 0;

function startTurtleGame() {
    cancelAnimationFrame(turtleAnimationId);
    clearInterval(turtleGameLoop);
    
    turtlePlayer = { x: 300, y: 350, width: 30, height: 30, speed: 1.5, vx: 0, vy: 0, friction: 0.88 };
    nets = [];
    bubbles = [];
    frames = 0;
    turtleTime = 0;
    turtleScoreEl.innerText = turtleTime;
    keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
    isTouching = false;

    for(let i=0; i<15; i++) {
        bubbles.push({x: Math.random()*turtleCanvas.width, y: Math.random()*turtleCanvas.height, size: Math.random()*4+1, speed: Math.random()*2+1});
    }

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
    let oceanGrad = turtleCtx.createLinearGradient(0, 0, 0, turtleCanvas.height);
    oceanGrad.addColorStop(0, "#1ABC9C");
    oceanGrad.addColorStop(1, "#2C3E50");
    turtleCtx.fillStyle = oceanGrad;
    turtleCtx.fillRect(0, 0, turtleCanvas.width, turtleCanvas.height);

    turtleCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
    bubbles.forEach(bubble => {
        bubble.y -= bubble.speed;
        if(bubble.y < -10) bubble.y = turtleCanvas.height + 10;
        turtleCtx.beginPath();
        turtleCtx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        turtleCtx.fill();
    });

    // Apply Keyboard Acceleration
    if (keys.ArrowLeft) turtlePlayer.vx -= turtlePlayer.speed;
    if (keys.ArrowRight) turtlePlayer.vx += turtlePlayer.speed;
    if (keys.ArrowUp) turtlePlayer.vy -= turtlePlayer.speed;
    if (keys.ArrowDown) turtlePlayer.vy += turtlePlayer.speed;

    // Apply Touch Acceleration
    if (isTouching) {
        let dx = touchTargetX - turtlePlayer.x;
        let dy = touchTargetY - turtlePlayer.y;
        let dist = Math.hypot(dx, dy);
        if (dist > 10) { // Slight deadzone so it doesn't vibrate when under the finger
            turtlePlayer.vx += (dx / dist) * turtlePlayer.speed;
            turtlePlayer.vy += (dy / dist) * turtlePlayer.speed;
        }
    }

    turtlePlayer.vx *= turtlePlayer.friction;
    turtlePlayer.vy *= turtlePlayer.friction;
    turtlePlayer.x += turtlePlayer.vx;
    turtlePlayer.y += turtlePlayer.vy;

    if(turtlePlayer.x < 15) turtlePlayer.x = 15;
    if(turtlePlayer.x > turtleCanvas.width - 15) turtlePlayer.x = turtleCanvas.width - 15;
    if(turtlePlayer.y < 15) turtlePlayer.y = 15;
    if(turtlePlayer.y > turtleCanvas.height - 15) turtlePlayer.y = turtleCanvas.height - 15;

    turtleCtx.font = "35px Arial";
    turtleCtx.textAlign = "center";
    turtleCtx.textBaseline = "middle";
    turtleCtx.fillText("🐢", turtlePlayer.x, turtlePlayer.y);

    if (frames % Math.max(15, 40 - Math.floor(turtleTime/5)) === 0) {
        let netX = Math.random() * turtleCanvas.width;
        nets.push({ x: netX, y: -40, size: 40, speed: Math.random() * 3 + 2 + (turtleTime*0.1), rot: 0 });
    }

    for (let i = 0; i < nets.length; i++) {
        nets[i].y += nets[i].speed;
        nets[i].rot += 0.05;
        
        turtleCtx.save();
        turtleCtx.translate(nets[i].x, nets[i].y);
        turtleCtx.rotate(nets[i].rot);
        turtleCtx.font = "35px Arial";
        turtleCtx.fillText("🕸️", 0, 0);
        turtleCtx.restore();

        let dist = Math.hypot(turtlePlayer.x - nets[i].x, turtlePlayer.y - nets[i].y);
        if (dist < 25) { 
            stopTurtleGame();
            keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
            isTouching = false;
            alert(`Oh no! The turtle was caught. You survived ${turtleTime} seconds.`);
            return;
        }
    }

    nets = nets.filter(net => net.y < turtleCanvas.height + 50);
    frames++;
    turtleAnimationId = requestAnimationFrame(updateTurtleGame);
}

// Controls
window.addEventListener("keydown", (e) => {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
        keys[e.key] = true;
    }
});

window.addEventListener("keyup", (e) => {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        keys[e.key] = false;
    }
});

// Mobile Touch Tracking
function updateTouch(e) {
    const rect = turtleCanvas.getBoundingClientRect();
    const scaleX = turtleCanvas.width / rect.width;
    const scaleY = turtleCanvas.height / rect.height;
    touchTargetX = (e.touches[0].clientX - rect.left) * scaleX;
    touchTargetY = (e.touches[0].clientY - rect.top) * scaleY;
}

turtleCanvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isTouching = true;
    updateTouch(e);
}, {passive: false});

turtleCanvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if(isTouching) updateTouch(e);
}, {passive: false});

turtleCanvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    isTouching = false;
}, {passive: false});
