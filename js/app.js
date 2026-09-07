// ============================================
// AEROSHIELD AI - MAIN APPLICATION
// ============================================

// ============================================
// APPLICATION STATE
// ============================================

const appState = {
    initialized: false,
    cameraStarted: false,

    airWritingEnabled: true,
    shieldEnabled: true,

    handCount: 0,
    mode: "STANDBY"
};


// ============================================
// DOM ELEMENTS
// ============================================

const appVideo =
    document.getElementById("camera");

const appCanvas =
    document.getElementById("effectCanvas");

const appWritingCanvas =
    document.getElementById("writingCanvas");

const airWriteButton =
    document.getElementById("airWriteButton");

const shieldButton =
    document.getElementById("shieldButton");

const clearButton =
    document.getElementById("clearButton");


// ============================================
// INITIALIZE APPLICATION
// ============================================

function initializeApp() {

    console.log(
        "Initializing AeroShield AI..."
    );


    // ========================================
    // AIR WRITING
    // ========================================

    if (
        typeof initializeAirWriting ===
        "function"
    ) {

        initializeAirWriting();
    }


    // ========================================
    // SMALL SHIELD
    // ========================================

    if (
        typeof initializeSmallShield ===
        "function"
    ) {

        initializeSmallShield();
    }


    // ========================================
    // BIG SHIELD
    // ========================================

    if (
        typeof initializeBigShield ===
        "function"
    ) {

        initializeBigShield();
    }


    // ========================================
    // SHIELD PARTICLES
    // ========================================

    if (
        typeof initializeShieldParticles ===
        "function"
    ) {

        initializeShieldParticles();
    }


    // ========================================
    // REPULSOR
    // ========================================

    if (
        typeof initializeRepulsor ===
        "function"
    ) {

        initializeRepulsor();
    }


    // ========================================
    // HOLOGRAPHIC RINGS
    // ========================================

    if (
        typeof initializeHolographicRings ===
        "function"
    ) {

        initializeHolographicRings();
    }


    // ========================================
    // EFFECT CANVAS
    // ========================================

    if (
        typeof initializeEffects ===
        "function"
    ) {

        initializeEffects();
    }


    // ========================================
    // HUD
    // ========================================

    if (
        typeof initializeHUD ===
        "function"
    ) {

        initializeHUD();
    }


    // ========================================
    // CAMERA
    // ========================================

    if (
        typeof initializeCamera ===
        "function"
    ) {

        initializeCamera();
    }


    // ========================================
    // HAND TRACKING
    // ========================================

    if (
        typeof initializeHandTracking ===
        "function"
    ) {

        initializeHandTracking();
    }


    // ========================================
    // BUTTON EVENTS
    // ========================================

    setupAppControls();


    // ========================================
    // INITIAL STATE
    // ========================================

    appState.initialized =
        true;

    updateAppUI();


    console.log(
        "AeroShield AI initialized successfully."
    );
}


// ============================================
// SETUP CONTROLS
// ============================================

function setupAppControls() {


    // ========================================
    // AIR WRITE BUTTON
    // ========================================

    if (airWriteButton) {

        airWriteButton.addEventListener(
            "click",
            () => {

                toggleAirWritingMode();

            }
        );
    }


    // ========================================
    // SHIELD BUTTON
    // ========================================

    if (shieldButton) {

        shieldButton.addEventListener(
            "click",
            () => {

                toggleShieldMode();

            }
        );
    }


    // ========================================
    // CLEAR BUTTON
    // ========================================

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                clearApplicationCanvas();

            }
        );
    }
}


// ============================================
// TOGGLE AIR WRITING
// ============================================

function toggleAirWritingMode() {

    appState.airWritingEnabled =
        !appState.airWritingEnabled;


    if (
        appState.airWritingEnabled
    ) {

        if (
            typeof enableAirWriting ===
            "function"
        ) {

            enableAirWriting();
        }

    } else {

        if (
            typeof disableAirWriting ===
            "function"
        ) {

            disableAirWriting();
        }
    }


    updateAppUI();


    if (
        typeof playClickSound ===
        "function"
    ) {

        playClickSound();
    }


    console.log(
        "Air Writing:",
        appState.airWritingEnabled
            ? "ON"
            : "OFF"
    );
}


// ============================================
// TOGGLE SHIELD
// ============================================

function toggleShieldMode() {

    appState.shieldEnabled =
        !appState.shieldEnabled;


    if (
        appState.shieldEnabled
    ) {

        if (
            typeof enableShield ===
            "function"
        ) {

            enableShield();
        }

    } else {

        if (
            typeof disableShield ===
            "function"
        ) {

            disableShield();
        }
    }


    updateAppUI();


    if (
        typeof playShieldSound ===
        "function"
    ) {

        playShieldSound();
    }


    console.log(
        "Shield:",
        appState.shieldEnabled
            ? "ON"
            : "OFF"
    );
}


// ============================================
// CLEAR CANVAS
// ============================================

function clearApplicationCanvas() {

    if (
        typeof clearAirWriting ===
        "function"
    ) {

        clearAirWriting();

    } else if (
        appWritingCanvas
    ) {

        const ctx =
            appWritingCanvas.getContext(
                "2d"
            );

        ctx.clearRect(
            0,
            0,
            appWritingCanvas.width,
            appWritingCanvas.height
        );
    }


    if (
        typeof clearEffectsCanvas ===
        "function"
    ) {

        clearEffectsCanvas();

    } else if (
        appCanvas
    ) {

        const ctx =
            appCanvas.getContext(
                "2d"
            );

        ctx.clearRect(
            0,
            0,
            appCanvas.width,
            appCanvas.height
        );
    }


    if (
        typeof playClickSound ===
        "function"
    ) {

        playClickSound();
    }


    console.log(
        "Canvas cleared."
    );
}


// ============================================
// HANDLE HAND RESULTS
// ============================================

function handleHandResults(results) {

    if (!results) {
        return;
    }


    // ========================================
    // UPDATE LANDMARK STATE
    // ========================================

    if (
        typeof updateHandLandmarks ===
        "function"
    ) {

        updateHandLandmarks(
            results
        );
    }


    // ========================================
    // UPDATE APPLICATION HAND COUNT
    // ========================================

    updateAppHandState();


    // ========================================
    // AIR WRITING
    // ========================================

    if (
        appState.airWritingEnabled
    ) {

        if (
            typeof processAirWriting ===
            "function"
        ) {

            processAirWriting(
                results
            );
        }

    } else {

        if (
            typeof stopAirWriting ===
            "function"
        ) {

            stopAirWriting();
        }
    }


    // ========================================
    // SHIELD SYSTEM
    // ========================================

    if (
        appState.shieldEnabled
    ) {

        if (
            typeof updateShieldSystem ===
            "function"
        ) {

            updateShieldSystem(
                results
            );
        }

    } else {

        if (
            typeof hideAllShields ===
            "function"
        ) {

            hideAllShields();
        }
    }


    // ========================================
    // HUD
    // ========================================

    if (
        typeof updateHUD ===
        "function"
    ) {

        updateHUD(
            results
        );
    }


    // ========================================
    // TARGET RETICLE
    // ========================================

    if (
        appState.handCount > 0 &&
        results.multiHandLandmarks &&
        results.multiHandLandmarks.length > 0
    ) {

        if (
            typeof updateHUDTarget ===
            "function"
        ) {

            updateHUDTarget(
                results.multiHandLandmarks[0]
            );
        }

    } else {

        if (
            typeof hideTargetReticle ===
            "function"
        ) {

            hideTargetReticle();
        }
    }


    // ========================================
    // VISUAL EFFECTS
    // ========================================

    if (
        typeof processShieldEffects ===
        "function"
    ) {

        processShieldEffects(
            results
        );

    } else if (
        typeof processVisualEffects ===
        "function"
    ) {

        processVisualEffects(
            results
        );
    }
}


// ============================================
// UPDATE HAND STATE
// ============================================

function updateAppHandState() {

    if (
        typeof getHandCount ===
        "function"
    ) {

        appState.handCount =
            getHandCount();

        return;
    }


    // Fallback
    if (
        typeof getHandLandmarks ===
        "function"
    ) {

        const hands =
            getHandLandmarks();

        appState.handCount =
            Array.isArray(hands)
                ? hands.length
                : 0;

        return;
    }


    appState.handCount = 0;
}


// ============================================
// UPDATE APPLICATION UI
// ============================================

function updateAppUI() {

    if (airWriteButton) {

        airWriteButton.classList.toggle(
            "active",
            appState.airWritingEnabled
        );
    }


    if (shieldButton) {

        shieldButton.classList.toggle(
            "active",
            appState.shieldEnabled
        );
    }


    // ========================================
    // STATUS
    // ========================================

    const systemStatus =
        document.getElementById(
            "systemStatus"
        );


    if (systemStatus) {

        if (
            appState.cameraStarted
        ) {

            systemStatus.textContent =
                "SYSTEM: ONLINE";

            systemStatus.classList.add(
                "online"
            );

        } else {

            systemStatus.textContent =
                "SYSTEM: STANDBY";

            systemStatus.classList.remove(
                "online"
            );
        }
    }
}


// ============================================
// CAMERA STATE
// ============================================

function setCameraState(
    started
) {

    appState.cameraStarted =
        Boolean(started);


    updateAppUI();


    if (
        !appState.cameraStarted
    ) {

        appState.handCount =
            0;

        appState.mode =
            "STANDBY";
    }
}


// ============================================
// SET APPLICATION MODE
// ============================================

function setAppMode(
    mode
) {

    appState.mode =
        mode || "STANDBY";


    const modeElement =
        document.getElementById(
            "mode"
        );


    if (modeElement) {

        modeElement.textContent =
            appState.mode;
    }
}


// ============================================
// GET APPLICATION STATE
// ============================================

function getAppState() {

    return {
        ...appState
    };
}


// ============================================
// RESET APPLICATION
// ============================================

function resetApplication() {

    appState.handCount =
        0;

    appState.mode =
        "STANDBY";


    if (
        typeof hideAllShields ===
        "function"
    ) {

        hideAllShields();
    }


    if (
        typeof hideTargetReticle ===
        "function"
    ) {

        hideTargetReticle();
    }


    if (
        typeof clearAirWriting ===
        "function"
    ) {

        clearAirWriting();
    }


    if (
        typeof clearEffectsCanvas ===
        "function"
    ) {

        clearEffectsCanvas();
    }


    updateAppUI();


    console.log(
        "Application state reset."
    );
}


// ============================================
// PAGE VISIBILITY
// ============================================

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            return;
        }


        // Re-sync UI when returning
        updateAppUI();
    }
);


// ============================================
// START APPLICATION
// ============================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeApp();

    }
);


console.log(
    "AeroShield AI app module loaded successfully."
);