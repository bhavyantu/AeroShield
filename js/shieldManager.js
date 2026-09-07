// =========================================
// AEROSHIELD AI
// SHIELD MANAGER - FINAL + AUDIO
// =========================================

const shieldState = {

    enabled: true,

    handCount: 0,

    mode: "NONE",

    leftHand: null,

    rightHand: null,

    leftPalm: null,

    rightPalm: null,

    center: null,

    palmDistance: 0,

    shieldSize: 0
};


// =========================================
// SHIELD AUDIO STATE
// =========================================

let shieldWasActive = false;


// =========================================
// SHIELD AUDIO HANDLER
// =========================================

function handleShieldAudio(isActive) {

    // ========================================
    // SHIELD ACTIVATED
    // ========================================

    if (
        isActive &&
        !shieldWasActive
    ) {

        if (
            typeof playShieldActivationSound ===
            "function"
        ) {

            playShieldActivationSound();

            console.log(
                "Shield activation sound played."
            );
        }
    }


    // ========================================
    // SHIELD DEACTIVATED
    // ========================================

    if (
        !isActive &&
        shieldWasActive
    ) {

        if (
            typeof playShieldDeactivationSound ===
            "function"
        ) {

            playShieldDeactivationSound();

            console.log(
                "Shield deactivation sound played."
            );
        }
    }


    shieldWasActive = isActive;
}


// =========================================
// DOM
// =========================================

const shieldContainer =
    document.getElementById(
        "shieldContainer"
    );

const leftShield =
    document.getElementById(
        "leftShield"
    );

const rightShield =
    document.getElementById(
        "rightShield"
    );

const bigShield =
    document.getElementById(
        "bigShield"
    );

const shieldVideo =
    document.getElementById(
        "camera"
    );


// =========================================
// CAMERA RECT
// =========================================

function getShieldCameraRect() {

    if (shieldVideo) {

        const rect =
            shieldVideo.getBoundingClientRect();


        if (
            rect.width > 0 &&
            rect.height > 0
        ) {

            return rect;
        }
    }


    if (shieldContainer) {

        const rect =
            shieldContainer.getBoundingClientRect();


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

        width:
            window.innerWidth,

        height:
            window.innerHeight
    };
}


// =========================================
// LANDMARK → SCREEN
// =========================================

function normalizedToScreen(
    point
) {

    if (!point) {

        return null;
    }


    const rect =
        getShieldCameraRect();


    // Camera is mirrored
    const mirroredX =
        1 - point.x;


    return {

        x:
            rect.left +
            mirroredX *
            rect.width,

        y:
            rect.top +
            point.y *
            rect.height
    };
}


// =========================================
// POSITION SHIELD
// =========================================

function positionShield(
    element,
    x,
    y,
    size
) {

    if (!element) {

        return;
    }


    element.style.position =
        "fixed";


    element.style.width =
        `${size}px`;


    element.style.height =
        `${size}px`;


    element.style.left =
        `${x - size / 2}px`;


    element.style.top =
        `${y - size / 2}px`;


    // IMPORTANT:
    // Do not use translate(-50%, -50%)
    // because x/y already contain the
    // center position.

    element.style.transform =
        "translate3d(0, 0, 0)";
}


// =========================================
// ACTIVATE SHIELD
// =========================================

function activateShieldElement(
    element
) {

    if (!element) {

        return;
    }


    element.classList.remove(
        "hidden"
    );


    element.classList.remove(
        "disabled"
    );


    element.classList.add(
        "active"
    );


    element.style.display =
        "block";


    element.style.visibility =
        "visible";
}


// =========================================
// DEACTIVATE SHIELD
// =========================================

function deactivateShieldElement(
    element
) {

    if (!element) {

        return;
    }


    element.classList.remove(
        "active"
    );


    element.classList.add(
        "disabled"
    );


    element.classList.add(
        "hidden"
    );


    element.style.display =
        "none";


    element.style.visibility =
        "hidden";
}


// =========================================
// HIDE ALL
// =========================================

function hideAllShields() {

    deactivateShieldElement(
        leftShield
    );

    deactivateShieldElement(
        rightShield
    );

    deactivateShieldElement(
        bigShield
    );


    shieldState.handCount =
        0;


    shieldState.mode =
        "NONE";


    shieldState.leftHand =
        null;


    shieldState.rightHand =
        null;


    shieldState.leftPalm =
        null;


    shieldState.rightPalm =
        null;


    shieldState.center =
        null;


    shieldState.palmDistance =
        0;


    shieldState.shieldSize =
        0;


    // ========================================
    // REPULSORS
    // ========================================

    if (
        typeof hideRepulsor ===
        "function"
    ) {

        try {

            hideRepulsor(
                leftShield
            );

            hideRepulsor(
                rightShield
            );

            hideRepulsor(
                bigShield
            );

        } catch (error) {

            console.warn(
                "Repulsor hide warning:",
                error
            );
        }
    }


    // ========================================
    // PARTICLES
    // ========================================

    if (
        typeof hideShieldParticles ===
        "function"
    ) {

        try {

            hideShieldParticles(
                leftShield
            );

            hideShieldParticles(
                rightShield
            );

            hideShieldParticles(
                bigShield
            );

        } catch (error) {

            console.warn(
                "Particle hide warning:",
                error
            );
        }
    }


    // ========================================
    // HOLOGRAPHIC RINGS
    // ========================================

    if (
        typeof hideHolographicRings ===
        "function"
    ) {

        try {

            hideHolographicRings(
                leftShield
            );

            hideHolographicRings(
                rightShield
            );

            hideHolographicRings(
                bigShield
            );

        } catch (error) {

            console.warn(
                "Ring hide warning:",
                error
            );
        }
    }
}


// =========================================
// SHOW SMALL SHIELD
// =========================================

function showSmallShield(
    hand,
    shieldElement
) {

    if (
        !hand ||
        !shieldElement
    ) {

        return;
    }


    if (
        typeof getPalmCenter !==
        "function"
    ) {

        console.error(
            "getPalmCenter() is unavailable."
        );

        return;
    }


    const palm =
        getPalmCenter(
            hand
        );


    if (!palm) {

        return;
    }


    const position =
        normalizedToScreen(
            palm
        );


    if (!position) {

        return;
    }


    // ========================================
    // SIZE
    // ========================================

    const shieldSize =
        150;


    // ========================================
    // POSITION
    // ========================================

    positionShield(
        shieldElement,
        position.x,
        position.y,
        shieldSize
    );


    // ========================================
    // ACTIVATE
    // ========================================

    activateShieldElement(
        shieldElement
    );


    // ========================================
    // REPULSOR
    // ========================================

    if (
        typeof showRepulsor ===
        "function"
    ) {

        try {

            showRepulsor(
                shieldElement
            );

        } catch (_) {}
    }


    // ========================================
    // PARTICLES
    // ========================================

    if (
        typeof showShieldParticles ===
        "function"
    ) {

        try {

            showShieldParticles(
                shieldElement
            );

        } catch (_) {}
    }


    // ========================================
    // HOLOGRAPHIC RINGS
    // ========================================

    if (
        typeof showHolographicRings ===
        "function"
    ) {

        try {

            showHolographicRings(
                shieldElement
            );

        } catch (_) {}
    }
}


// =========================================
// SHOW BIG SHIELD
// =========================================

function showBigShield(
    hand1,
    hand2
) {

    if (
        !hand1 ||
        !hand2 ||
        !bigShield
    ) {

        return;
    }


    if (
        typeof getPalmCenter !==
        "function"
    ) {

        return;
    }


    const palm1 =
        getPalmCenter(
            hand1
        );


    const palm2 =
        getPalmCenter(
            hand2
        );


    if (
        !palm1 ||
        !palm2
    ) {

        return;
    }


    const screen1 =
        normalizedToScreen(
            palm1
        );


    const screen2 =
        normalizedToScreen(
            palm2
        );


    if (
        !screen1 ||
        !screen2
    ) {

        return;
    }


    // ========================================
    // CENTER
    // ========================================

    const centerX =
        (
            screen1.x +
            screen2.x
        ) / 2;


    const centerY =
        (
            screen1.y +
            screen2.y
        ) / 2;


    shieldState.center = {

        x:
            centerX,

        y:
            centerY
    };


    // ========================================
    // PALM DISTANCE
    // ========================================

    const dx =
        screen2.x -
        screen1.x;


    const dy =
        screen2.y -
        screen1.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    shieldState.palmDistance =
        distance;


    // ========================================
    // DYNAMIC SIZE
    // ========================================

    let shieldSize =
        distance * 1.45;


    shieldSize =
        Math.max(
            shieldSize,
            280
        );


    shieldSize =
        Math.min(
            shieldSize,
            650
        );


    shieldState.shieldSize =
        shieldSize;


    // ========================================
    // POSITION
    // ========================================

    positionShield(
        bigShield,
        centerX,
        centerY,
        shieldSize
    );


    // ========================================
    // ACTIVATE
    // ========================================

    activateShieldElement(
        bigShield
    );


    // ========================================
    // REPULSOR
    // ========================================

    if (
        typeof showRepulsor ===
        "function"
    ) {

        try {

            showRepulsor(
                bigShield
            );

        } catch (_) {}
    }


    // ========================================
    // PARTICLES
    // ========================================

    if (
        typeof showShieldParticles ===
        "function"
    ) {

        try {

            showShieldParticles(
                bigShield
            );

        } catch (_) {}
    }


    // ========================================
    // HOLOGRAPHIC RINGS
    // ========================================

    if (
        typeof showHolographicRings ===
        "function"
    ) {

        try {

            showHolographicRings(
                bigShield
            );

        } catch (_) {}
    }
}


// =========================================
// UPDATE SHIELD SYSTEM
// =========================================

function updateShieldSystem(
    results
) {

    // ========================================
    // SHIELD OFF
    // ========================================

    if (
        !shieldState.enabled
    ) {

        hideAllShields();

        handleShieldAudio(false);

        return;
    }


    // ========================================
    // HANDS
    // ========================================

    const hands =
        results &&
        Array.isArray(
            results.multiHandLandmarks
        )
            ? results.multiHandLandmarks
            : [];


    shieldState.handCount =
        hands.length;


    // ========================================
    // NO HANDS
    // ========================================

    if (
        hands.length === 0
    ) {

        hideAllShields();

        handleShieldAudio(false);

        return;
    }


    // ========================================
    // ONE HAND
    // ========================================

    if (
        hands.length === 1
    ) {

        shieldState.mode =
            "SMALL";


        shieldState.leftHand =
            hands[0];


        shieldState.rightHand =
            null;


        shieldState.leftPalm =
            getPalmCenter(
                hands[0]
            );


        shieldState.rightPalm =
            null;


        // Hide big
        deactivateShieldElement(
            bigShield
        );


        // Hide right
        deactivateShieldElement(
            rightShield
        );


        // Show small
        showSmallShield(
            hands[0],
            leftShield
        );


        // ========================================
        // AUDIO
        // ========================================

        handleShieldAudio(true);


        return;
    }


    // ========================================
    // TWO HANDS
    // ========================================

    if (
        hands.length >= 2
    ) {

        shieldState.mode =
            "BIG";


        shieldState.leftHand =
            hands[0];


        shieldState.rightHand =
            hands[1];


        shieldState.leftPalm =
            getPalmCenter(
                hands[0]
            );


        shieldState.rightPalm =
            getPalmCenter(
                hands[1]
            );


        // Hide small shields
        deactivateShieldElement(
            leftShield
        );


        deactivateShieldElement(
            rightShield
        );


        // Show big shield
        showBigShield(
            hands[0],
            hands[1]
        );


        // ========================================
        // AUDIO
        // ========================================

        handleShieldAudio(true);
    }
}


// =========================================
// ENABLE
// =========================================

function enableShield() {

    shieldState.enabled =
        true;


    console.log(
        "Shield system enabled."
    );
}


// =========================================
// DISABLE
// =========================================

function disableShield() {

    shieldState.enabled =
        false;


    hideAllShields();


    handleShieldAudio(false);


    console.log(
        "Shield system disabled."
    );
}


// =========================================
// TOGGLE
// =========================================

function toggleShield() {

    if (
        shieldState.enabled
    ) {

        disableShield();

    } else {

        enableShield();
    }


    return shieldState.enabled;
}


// =========================================
// GET STATE
// =========================================

function getShieldState() {

    return {
        ...shieldState
    };
}


// =========================================
// INITIALIZATION
// =========================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        hideAllShields();

        shieldWasActive =
            false;

        console.log(
            "Shield Manager initialized."
        );

    }
);


// =========================================
// MODULE LOADED
// =========================================

console.log(
    "Shield Manager loaded successfully."
);