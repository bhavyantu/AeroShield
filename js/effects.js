/* ============================================
   AEROSHIELD AI
   VISUAL EFFECTS ENGINE
   ============================================ */

const effectsState = {
    initialized: false,
    enabled: true,
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    particles: [],
    lastFrame: 0
};


/* ============================================
   INITIALIZE
   ============================================ */

function initializeEffects() {

    if (effectsState.initialized) {
        return true;
    }

    effectsState.canvas =
        document.getElementById("effectCanvas");

    if (!effectsState.canvas) {
        console.warn(
            "Effects: effectCanvas not found."
        );

        return false;
    }

    effectsState.ctx =
        effectsState.canvas.getContext("2d");

    if (!effectsState.ctx) {
        console.warn(
            "Effects: Canvas 2D context unavailable."
        );

        return false;
    }

    resizeEffectsCanvas();

    window.addEventListener(
        "resize",
        resizeEffectsCanvas
    );

    effectsState.initialized = true;

    return true;
}


/* ============================================
   RESIZE CANVAS
   ============================================ */

function resizeEffectsCanvas() {

    if (!effectsState.canvas) {
        return;
    }

    const dpr =
        Math.min(window.devicePixelRatio || 1, 2);

    effectsState.width =
        window.innerWidth;

    effectsState.height =
        window.innerHeight;

    effectsState.canvas.width =
        Math.floor(
            effectsState.width * dpr
        );

    effectsState.canvas.height =
        Math.floor(
            effectsState.height * dpr
        );

    effectsState.canvas.style.width =
        effectsState.width + "px";

    effectsState.canvas.style.height =
        effectsState.height + "px";

    if (effectsState.ctx) {

        effectsState.ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }
}


/* ============================================
   CLEAR EFFECT CANVAS
   ============================================ */

function clearEffects() {

    if (!effectsState.ctx) {
        return;
    }

    effectsState.ctx.clearRect(
        0,
        0,
        effectsState.width,
        effectsState.height
    );
}


/* ============================================
   NORMALIZED → SCREEN
   ============================================ */

function effectPointToScreen(point) {

    if (!point) {
        return null;
    }

    return {
        x:
            (1 - point.x) *
            effectsState.width,

        y:
            point.y *
            effectsState.height
    };
}


/* ============================================
   DISTANCE
   ============================================ */

function effectDistance(a, b) {

    if (!a || !b) {
        return 0;
    }

    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


/* ============================================
   DRAW GLOW
   ============================================ */

function drawGlow(
    x,
    y,
    radius = 40,
    intensity = 1
) {

    if (!effectsState.ctx) {
        return;
    }

    const ctx =
        effectsState.ctx;

    const gradient =
        ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            radius
        );

    gradient.addColorStop(
        0,
        `rgba(80, 240, 255, ${0.22 * intensity})`
    );

    gradient.addColorStop(
        0.35,
        `rgba(30, 190, 255, ${0.12 * intensity})`
    );

    gradient.addColorStop(
        1,
        "rgba(0, 0, 0, 0)"
    );

    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    ctx.fillStyle =
        gradient;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}


/* ============================================
   HAND ENERGY EFFECT
   ============================================ */

function showHandEffect(
    landmark
) {

    if (
        !effectsState.enabled ||
        !effectsState.ctx ||
        !landmark
    ) {
        return;
    }

    const point =
        effectPointToScreen(landmark);

    if (!point) {
        return;
    }

    drawGlow(
        point.x,
        point.y,
        45,
        1
    );

    drawEnergyRing(
        point.x,
        point.y,
        18
    );
}


/* ============================================
   ENERGY RING
   ============================================ */

function drawEnergyRing(
    x,
    y,
    radius
) {

    const ctx =
        effectsState.ctx;

    const time =
        performance.now() / 1000;

    const animatedRadius =
        radius +
        Math.sin(time * 5) * 3;

    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    ctx.strokeStyle =
        "rgba(80, 235, 255, 0.65)";

    ctx.lineWidth =
        1.2;

    ctx.shadowBlur =
        10;

    ctx.shadowColor =
        "rgba(50, 220, 255, 0.8)";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        animatedRadius,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}


/* ============================================
   TARGET RETICLE
   ============================================ */

function drawTargetReticle(
    landmark
) {

    if (
        !effectsState.enabled ||
        !landmark
    ) {
        return;
    }

    const point =
        effectPointToScreen(landmark);

    if (!point) {
        return;
    }

    const ctx =
        effectsState.ctx;

    const time =
        performance.now() / 1000;

    const rotation =
        time * 1.5;

    const radius =
        26 +
        Math.sin(time * 4) * 2;

    ctx.save();

    ctx.translate(
        point.x,
        point.y
    );

    ctx.rotate(rotation);

    ctx.globalCompositeOperation =
        "lighter";

    ctx.strokeStyle =
        "rgba(100, 240, 255, 0.75)";

    ctx.lineWidth =
        1;

    /* Outer ring */

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        radius,
        0.2,
        Math.PI * 1.4
    );

    ctx.stroke();


    /* Second ring */

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        radius - 6,
        Math.PI * 1.5,
        Math.PI * 2.7
    );

    ctx.stroke();


    /* Target crosshair */

    ctx.beginPath();

    ctx.moveTo(
        -radius - 8,
        0
    );

    ctx.lineTo(
        -radius + 3,
        0
    );

    ctx.moveTo(
        radius - 3,
        0
    );

    ctx.lineTo(
        radius + 8,
        0
    );

    ctx.moveTo(
        0,
        -radius - 8
    );

    ctx.lineTo(
        0,
        -radius + 3
    );

    ctx.moveTo(
        0,
        radius - 3
    );

    ctx.lineTo(
        0,
        radius + 8
    );

    ctx.stroke();

    ctx.restore();
}


/* ============================================
   PARTICLE
   ============================================ */

function createEffectParticle(
    x,
    y
) {

    return {
        x,
        y,

        vx:
            (Math.random() - 0.5) * 0.8,

        vy:
            (Math.random() - 0.5) * 0.8,

        size:
            Math.random() * 2 + 0.5,

        life:
            1,

        decay:
            Math.random() * 0.025 + 0.01
    };
}


/* ============================================
   SPAWN PARTICLES
   ============================================ */

function spawnEffectParticles(
    x,
    y,
    count = 3
) {

    for (let i = 0; i < count; i++) {

        effectsState.particles.push(
            createEffectParticle(
                x,
                y
            )
        );
    }


    /*
       Prevent unlimited particle growth.
    */

    if (
        effectsState.particles.length >
        250
    ) {

        effectsState.particles.splice(
            0,
            effectsState.particles.length - 250
        );
    }
}


/* ============================================
   UPDATE PARTICLES
   ============================================ */

function updateEffectParticles() {

    const ctx =
        effectsState.ctx;

    if (!ctx) {
        return;
    }

    for (
        let i = effectsState.particles.length - 1;
        i >= 0;
        i--
    ) {

        const particle =
            effectsState.particles[i];

        particle.x +=
            particle.vx;

        particle.y +=
            particle.vy;

        particle.life -=
            particle.decay;

        if (particle.life <= 0) {

            effectsState.particles.splice(
                i,
                1
            );

            continue;
        }


        ctx.save();

        ctx.globalAlpha =
            particle.life;

        ctx.globalCompositeOperation =
            "lighter";

        ctx.fillStyle =
            "rgba(90, 235, 255, 1)";

        ctx.shadowBlur =
            8;

        ctx.shadowColor =
            "rgba(40, 220, 255, 0.8)";

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }
}


/* ============================================
   HAND PARTICLES
   ============================================ */

function createHandParticles(
    landmarks
) {

    if (
        !effectsState.enabled ||
        !landmarks ||
        landmarks.length === 0
    ) {
        return;
    }

    const indexTip =
        landmarks[8];

    if (!indexTip) {
        return;
    }

    const point =
        effectPointToScreen(indexTip);

    if (!point) {
        return;
    }

    spawnEffectParticles(
        point.x,
        point.y,
        2
    );
}


/* ============================================
   TWO-HAND ENERGY CONNECTION
   ============================================ */

function drawTwoHandEnergy(
    firstHand,
    secondHand
) {

    if (
        !effectsState.enabled ||
        !firstHand ||
        !secondHand
    ) {
        return;
    }

    const p1 =
        effectPointToScreen(
            firstHand[9]
        );

    const p2 =
        effectPointToScreen(
            secondHand[9]
        );

    if (!p1 || !p2) {
        return;
    }

    const ctx =
        effectsState.ctx;

    const time =
        performance.now() / 1000;

    const pulse =
        0.35 +
        Math.sin(time * 5) * 0.15;

    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    ctx.strokeStyle =
        `rgba(70, 225, 255, ${pulse})`;

    ctx.lineWidth =
        1.5;

    ctx.shadowBlur =
        12;

    ctx.shadowColor =
        "rgba(50, 220, 255, 0.7)";

    ctx.setLineDash([
        8,
        8
    ]);

    ctx.lineDashOffset =
        -time * 30;

    ctx.beginPath();

    ctx.moveTo(
        p1.x,
        p1.y
    );

    ctx.lineTo(
        p2.x,
        p2.y
    );

    ctx.stroke();

    ctx.restore();
}


/* ============================================
   SHIELD ENERGY EFFECT
   ============================================ */

function drawShieldEnergy(
    x,
    y,
    radius
) {

    if (
        !effectsState.enabled ||
        !effectsState.ctx
    ) {
        return;
    }

    const ctx =
        effectsState.ctx;

    const time =
        performance.now() / 1000;

    const pulse =
        Math.sin(time * 4) * 0.08;

    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

    ctx.strokeStyle =
        `rgba(70, 225, 255, ${0.22 + pulse})`;

    ctx.lineWidth =
        1;

    ctx.shadowBlur =
        18;

    ctx.shadowColor =
        "rgba(40, 220, 255, 0.55)";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius + Math.sin(time * 3) * 4,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}


/* ============================================
   PROCESS VISUAL EFFECTS
   ============================================ */

function processVisualEffects(
    results
) {

    if (
        !effectsState.enabled ||
        !results
    ) {
        clearEffects();
        return;
    }

    clearEffects();

    const hands =
        results.multiHandLandmarks || [];


    /* ========================================
       NO HANDS
       ======================================== */

    if (hands.length === 0) {

        updateEffectParticles();

        return;
    }


    /* ========================================
       FIRST HAND
       ======================================== */

    const firstHand =
        hands[0];

    if (firstHand) {

        const palm =
            firstHand[9];

        if (palm) {

            const point =
                effectPointToScreen(
                    palm
                );

            if (point) {

                drawGlow(
                    point.x,
                    point.y,
                    55,
                    0.7
                );

                drawEnergyRing(
                    point.x,
                    point.y,
                    22
                );
            }
        }


        createHandParticles(
            firstHand
        );


        /*
           Index finger target.
        */

        if (firstHand[8]) {

            drawTargetReticle(
                firstHand[8]
            );
        }
    }


    /* ========================================
       SECOND HAND
       ======================================== */

    if (hands.length >= 2) {

        const secondHand =
            hands[1];

        createHandParticles(
            secondHand
        );

        drawTwoHandEnergy(
            firstHand,
            secondHand
        );


        /*
           Draw energy around second palm.
        */

        if (secondHand[9]) {

            const point =
                effectPointToScreen(
                    secondHand[9]
                );

            if (point) {

                drawGlow(
                    point.x,
                    point.y,
                    55,
                    0.7
                );
            }
        }
    }


    /* ========================================
       UPDATE PARTICLES
       ======================================== */

    updateEffectParticles();
}


/* ============================================
   COMPATIBILITY ALIAS
   ============================================ */

function processShieldEffects(
    results
) {

    processVisualEffects(
        results
    );
}


/* ============================================
   ENABLE
   ============================================ */

function enableEffects() {

    effectsState.enabled =
        true;

    initializeEffects();

    return true;
}


/* ============================================
   DISABLE
   ============================================ */

function disableEffects() {

    effectsState.enabled =
        false;

    effectsState.particles = [];

    clearEffects();
}


/* ============================================
   TOGGLE
   ============================================ */

function toggleEffects() {

    if (effectsState.enabled) {

        disableEffects();

    } else {

        enableEffects();
    }

    return effectsState.enabled;
}


/* ============================================
   GET STATE
   ============================================ */

function getEffectsState() {

    return {
        initialized:
            effectsState.initialized,

        enabled:
            effectsState.enabled,

        width:
            effectsState.width,

        height:
            effectsState.height,

        particleCount:
            effectsState.particles.length
    };
}


/* ============================================
   RESET
   ============================================ */

function resetEffects() {

    effectsState.particles = [];

    clearEffects();
}


/* ============================================
   VISIBILITY HANDLING
   ============================================ */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            resetEffects();
        }
    }
);


/* ============================================
   INITIALIZE ON DOM READY
   ============================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeEffects();
    }
);