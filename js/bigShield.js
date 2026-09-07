// ============================================
// BIG SHIELD SYSTEM
// AeroShield AI
// ============================================

const bigShieldState = {
    element: null,
    visible: false,
    x: 0,
    y: 0,
    size: 0,
    targetX: 0,
    targetY: 0,
    targetSize: 0,
    animationFrame: null
};


// ============================================
// INITIALIZE
// ============================================

function initializeBigShield() {

    bigShieldState.element =
        document.getElementById("bigShield");

    if (!bigShieldState.element) {
        console.error("Big shield element not found.");
        return false;
    }

    bigShieldState.element.style.position = "fixed";
    bigShieldState.element.style.pointerEvents = "none";

    hideBigShieldElement();

    startBigShieldAnimation();

    console.log("Big Shield initialized.");

    return true;
}


// ============================================
// GET CAMERA RECTANGLE
// ============================================

function getBigShieldCameraRect() {

    const video =
        document.getElementById("camera");

    if (video) {

        const rect =
            video.getBoundingClientRect();

        if (rect.width > 0 && rect.height > 0) {
            return rect;
        }
    }

    return {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight
    };
}


// ============================================
// CONVERT MEDIAPIPE COORDINATES
// TO SCREEN COORDINATES
// ============================================

function bigShieldLandmarkToScreen(landmark) {

    if (!landmark) {
        return null;
    }

    const rect =
        getBigShieldCameraRect();

    // Camera preview is mirrored.
    const mirroredX = 1 - landmark.x;

    return {
        x: rect.left + mirroredX * rect.width,
        y: rect.top + landmark.y * rect.height
    };
}


// ============================================
// CALCULATE PALM CENTER
// ============================================

function getBigShieldPalmCenter(hand) {

    if (!hand || hand.length < 21) {
        return null;
    }

    const palmIndexes = [
        0,   // wrist
        5,   // index MCP
        9,   // middle MCP
        13,  // ring MCP
        17   // pinky MCP
    ];

    let x = 0;
    let y = 0;

    palmIndexes.forEach(index => {

        x += hand[index].x;
        y += hand[index].y;

    });

    return {
        x: x / palmIndexes.length,
        y: y / palmIndexes.length
    };
}


// ============================================
// CALCULATE DISTANCE BETWEEN TWO PALMS
// ============================================

function calculateBigShieldDistance(point1, point2) {

    if (!point1 || !point2) {
        return 0;
    }

    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;

    return Math.sqrt(
        dx * dx + dy * dy
    );
}


// ============================================
// SHOW BIG SHIELD
// ============================================

function showBigShieldElement() {

    const shield =
        bigShieldState.element;

    if (!shield) {
        return;
    }

    shield.classList.remove("hidden");
    shield.classList.remove("disabled");
    shield.classList.add("active");

    shield.style.display = "block";

    bigShieldState.visible = true;
}


// ============================================
// HIDE BIG SHIELD
// ============================================

function hideBigShieldElement() {

    const shield =
        bigShieldState.element;

    if (!shield) {
        return;
    }

    shield.classList.remove("active");
    shield.classList.add("disabled");
    shield.classList.add("hidden");

    shield.style.display = "none";

    bigShieldState.visible = false;
}


// ============================================
// UPDATE BIG SHIELD POSITION
// ============================================

function setBigShieldPosition(
    x,
    y,
    size
) {

    const shield =
        bigShieldState.element;

    if (!shield) {
        return;
    }

    shield.style.width =
        `${size}px`;

    shield.style.height =
        `${size}px`;

    shield.style.left =
        `${x - size / 2}px`;

    shield.style.top =
        `${y - size / 2}px`;
}


// ============================================
// UPDATE TARGET
// ============================================

function updateBigShieldTarget(
    hand1,
    hand2
) {

    if (!hand1 || !hand2) {
        hideBigShieldElement();
        return;
    }

    const palm1 =
        getBigShieldPalmCenter(hand1);

    const palm2 =
        getBigShieldPalmCenter(hand2);

    if (!palm1 || !palm2) {
        hideBigShieldElement();
        return;
    }

    const screen1 =
        bigShieldLandmarkToScreen(palm1);

    const screen2 =
        bigShieldLandmarkToScreen(palm2);

    if (!screen1 || !screen2) {
        hideBigShieldElement();
        return;
    }


    // ========================================
    // CENTER BETWEEN BOTH HANDS
    // ========================================

    const centerX =
        (screen1.x + screen2.x) / 2;

    const centerY =
        (screen1.y + screen2.y) / 2;


    // ========================================
    // DISTANCE BETWEEN HANDS
    // ========================================

    const distance =
        calculateBigShieldDistance(
            screen1,
            screen2
        );


    // ========================================
    // DYNAMIC SHIELD SIZE
    // ========================================

    let shieldSize =
        distance * 1.45;


    // Minimum size

    shieldSize =
        Math.max(
            shieldSize,
            280
        );


    // Maximum size

    shieldSize =
        Math.min(
            shieldSize,
            650
        );


    // ========================================
    // SAVE TARGET VALUES
    // ========================================

    bigShieldState.targetX =
        centerX;

    bigShieldState.targetY =
        centerY;

    bigShieldState.targetSize =
        shieldSize;


    // ========================================
    // SHOW
    // ========================================

    showBigShieldElement();
}


// ============================================
// SMOOTH ANIMATION
// ============================================

function animateBigShield() {

    const state =
        bigShieldState;

    if (!state.element) {
        return;
    }

    // Smooth X movement

    state.x +=
        (state.targetX - state.x) * 0.18;


    // Smooth Y movement

    state.y +=
        (state.targetY - state.y) * 0.18;


    // Smooth size movement

    state.size +=
        (state.targetSize - state.size) * 0.18;


    if (state.visible && state.size > 0) {

        setBigShieldPosition(
            state.x,
            state.y,
            state.size
        );
    }

    state.animationFrame =
        requestAnimationFrame(
            animateBigShield
        );
}


// ============================================
// START ANIMATION LOOP
// ============================================

function startBigShieldAnimation() {

    if (bigShieldState.animationFrame) {
        return;
    }

    bigShieldState.animationFrame =
        requestAnimationFrame(
            animateBigShield
        );
}


// ============================================
// STOP ANIMATION LOOP
// ============================================

function stopBigShieldAnimation() {

    if (
        bigShieldState.animationFrame !== null
    ) {

        cancelAnimationFrame(
            bigShieldState.animationFrame
        );

        bigShieldState.animationFrame =
            null;
    }
}


// ============================================
// RESET BIG SHIELD
// ============================================

function resetBigShield() {

    bigShieldState.x = 0;
    bigShieldState.y = 0;

    bigShieldState.targetX = 0;
    bigShieldState.targetY = 0;

    bigShieldState.size = 0;
    bigShieldState.targetSize = 0;

    hideBigShieldElement();
}


// ============================================
// WINDOW RESIZE
// ============================================

window.addEventListener(
    "resize",
    () => {

        // Position will automatically
        // update on the next tracking frame.

        if (!bigShieldState.visible) {
            return;
        }

        console.log(
            "Big Shield position recalculated."
        );
    }
);


// ============================================
// INITIALIZE WHEN PAGE LOADS
// ============================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeBigShield();

    }
);


console.log(
    "Big Shield module loaded successfully."
);