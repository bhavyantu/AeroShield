// =========================================
// AEROSHIELD AI
// SMALL SHIELD MODULE - FINAL
// =========================================

const smallShieldState = {
    active: false,

    x: 0,
    y: 0,

    targetX: 0,
    targetY: 0,

    size: 150,
    targetSize: 150,

    rotation: 0,
    opacity: 0
};


// =========================================
// DOM
// =========================================

const smallShieldElement =
    document.getElementById("leftShield");


// =========================================
// SMOOTH VALUE
// =========================================

function smoothSmallShieldValue(
    current,
    target,
    speed = 0.18
) {
    return current +
        (target - current) * speed;
}


// =========================================
// GET CAMERA RECT
// =========================================

function getSmallShieldCameraRect() {

    const video =
        document.getElementById("camera");

    if (video) {

        const rect =
            video.getBoundingClientRect();

        if (
            rect.width > 0 &&
            rect.height > 0
        ) {
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


// =========================================
// CONVERT LANDMARK TO SCREEN
// =========================================

function smallShieldLandmarkToScreen(
    landmark
) {

    if (!landmark) {
        return null;
    }

    const rect =
        getSmallShieldCameraRect();

    // Camera is mirrored with scaleX(-1)
    const mirroredX =
        1 - landmark.x;

    return {
        x:
            rect.left +
            mirroredX * rect.width,

        y:
            rect.top +
            landmark.y * rect.height
    };
}


// =========================================
// UPDATE SMALL SHIELD
// =========================================

function updateSmallShield(hand) {

    if (
        !hand ||
        !smallShieldElement
    ) {
        return;
    }


    // =========================================
    // PALM
    // =========================================

    const palm =
        getPalmCenter(hand);

    if (!palm) {
        return;
    }


    // =========================================
    // SCREEN POSITION
    // =========================================

    const screen =
        smallShieldLandmarkToScreen(
            palm
        );

    if (!screen) {
        return;
    }


    smallShieldState.targetX =
        screen.x;

    smallShieldState.targetY =
        screen.y;


    // =========================================
    // SIZE
    // =========================================

    smallShieldState.targetSize =
        150;


    // =========================================
    // SMOOTH MOVEMENT
    // =========================================

    smallShieldState.x =
        smoothSmallShieldValue(
            smallShieldState.x,
            smallShieldState.targetX,
            0.22
        );

    smallShieldState.y =
        smoothSmallShieldValue(
            smallShieldState.y,
            smallShieldState.targetY,
            0.22
        );

    smallShieldState.size =
        smoothSmallShieldValue(
            smallShieldState.size,
            smallShieldState.targetSize,
            0.15
        );


    // =========================================
    // ROTATION
    // =========================================

    smallShieldState.rotation +=
        0.35;


    // =========================================
    // ACTIVE
    // =========================================

    smallShieldState.active =
        true;

    smallShieldState.opacity =
        smoothSmallShieldValue(
            smallShieldState.opacity,
            1,
            0.2
        );


    // =========================================
    // APPLY STYLE
    // =========================================

    smallShieldElement.style.position =
        "fixed";

    smallShieldElement.style.width =
        `${smallShieldState.size}px`;

    smallShieldElement.style.height =
        `${smallShieldState.size}px`;

    smallShieldElement.style.left =
        `${smallShieldState.x -
          smallShieldState.size / 2}px`;

    smallShieldElement.style.top =
        `${smallShieldState.y -
          smallShieldState.size / 2}px`;

    smallShieldElement.style.opacity =
        smallShieldState.opacity;

    smallShieldElement.style.transform =
        `rotate(${smallShieldState.rotation}deg)`;


    // =========================================
    // VISIBILITY
    // =========================================

    smallShieldElement.classList.remove(
        "hidden"
    );

    smallShieldElement.classList.remove(
        "disabled"
    );

    smallShieldElement.classList.add(
        "active"
    );

    smallShieldElement.style.display =
        "block";
}


// =========================================
// SHOW SMALL SHIELD
// =========================================

function showSmallShieldAnimated() {

    if (!smallShieldElement) {
        return;
    }

    smallShieldState.active =
        true;

    smallShieldElement.classList.remove(
        "hidden"
    );

    smallShieldElement.classList.remove(
        "disabled"
    );

    smallShieldElement.classList.add(
        "active"
    );

    smallShieldElement.style.display =
        "block";
}


// =========================================
// HIDE SMALL SHIELD
// =========================================

function hideSmallShield() {

    if (!smallShieldElement) {
        return;
    }

    smallShieldState.active =
        false;

    smallShieldState.opacity =
        0;

    smallShieldElement.classList.remove(
        "active"
    );

    smallShieldElement.classList.add(
        "disabled"
    );

    smallShieldElement.classList.add(
        "hidden"
    );

    smallShieldElement.style.display =
        "none";
}


// =========================================
// RESET
// =========================================

function resetSmallShield() {

    smallShieldState.active =
        false;

    smallShieldState.x =
        0;

    smallShieldState.y =
        0;

    smallShieldState.targetX =
        0;

    smallShieldState.targetY =
        0;

    smallShieldState.size =
        150;

    smallShieldState.targetSize =
        150;

    smallShieldState.rotation =
        0;

    smallShieldState.opacity =
        0;


    hideSmallShield();
}


// =========================================
// GET STATE
// =========================================

function getSmallShieldState() {

    return {
        ...smallShieldState
    };
}


// =========================================
// ANIMATION LOOP
// =========================================

function animateSmallShield() {

    if (
        smallShieldState.active &&
        smallShieldElement
    ) {

        smallShieldState.x =
            smoothSmallShieldValue(
                smallShieldState.x,
                smallShieldState.targetX,
                0.12
            );

        smallShieldState.y =
            smoothSmallShieldValue(
                smallShieldState.y,
                smallShieldState.targetY,
                0.12
            );

        smallShieldState.size =
            smoothSmallShieldValue(
                smallShieldState.size,
                smallShieldState.targetSize,
                0.10
            );


        smallShieldElement.style.left =
            `${smallShieldState.x -
              smallShieldState.size / 2}px`;

        smallShieldElement.style.top =
            `${smallShieldState.y -
              smallShieldState.size / 2}px`;

        smallShieldElement.style.width =
            `${smallShieldState.size}px`;

        smallShieldElement.style.height =
            `${smallShieldState.size}px`;

        smallShieldElement.style.opacity =
            smallShieldState.opacity;
    }


    requestAnimationFrame(
        animateSmallShield
    );
}


// =========================================
// INITIALIZE
// =========================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        resetSmallShield();

        animateSmallShield();

        console.log(
            "Small shield initialized."
        );
    }
);