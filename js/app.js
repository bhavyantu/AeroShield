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


// IMPORTANT:
// Do NOT declare startCameraButton here.
// camera.js already handles the START SYSTEM button.


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
    // EFFECTS
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
    // APPLICATION CONTROLS
    // ========================================

    setupAppControls();


    // ========================================
    // WRITING COLOR CONTROLS
    // ========================================

    setupWritingColorControls();


    // ========================================
    // APPLICATION READY
    // ========================================

    appState.initialized = true;

    updateAppUI();


    console.log(
        "AeroShield AI initialized successfully."
    );
}


// ============================================
// SETUP APPLICATION CONTROLS
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
// WRITING COLOR CONTROLS
// ============================================

function setupWritingColorControls() {

    const colorButtons =
        document.querySelectorAll(
            ".writing-color"
        );


    const customColor =
        document.getElementById(
            "writingColor"
        );


    // ========================================
    // PRESET COLORS
    // ========================================

    colorButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const color =
                        button.getAttribute(
                            "data-writing-color"
                        );


                    if (!color) {

                        return;

                    }


                    // Send color to airWriting.js

                    if (
                        typeof setWritingColor ===
                        "function"
                    ) {

                        setWritingColor(
                            color
                        );

                    }


                    // Update custom color picker

                    if (customColor) {

                        customColor.value =
                            color;

                    }


                    // Remove selected class

                    colorButtons.forEach(
                        (item) => {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                    // Select current color

                    button.classList.add(
                        "selected"
                    );


                    console.log(
                        "Writing color selected:",
                        color
                    );

                }
            );

        }
    );


    // ========================================
    // CUSTOM COLOR
    // ========================================

    if (customColor) {

        customColor.addEventListener(
            "input",
            () => {

                const color =
                    customColor.value;


                if (
                    typeof setWritingColor ===
                    "function"
                ) {

                    setWritingColor(
                        color
                    );

                }


                // Remove preset selection

                colorButtons.forEach(
                    (button) => {

                        button.classList.remove(
                            "selected"
                        );

                    }
                );


                console.log(
                    "Custom writing color:",
                    color
                );

            }
        );

    }


    // ========================================
    // DEFAULT COLOR
    // ========================================

    if (
        typeof setWritingColor ===
        "function"
    ) {

        setWritingColor(
            "#00f6ff"
        );

    }

}


// ============================================
// TOGGLE AIR WRITING
// ============================================

function toggleAirWritingMode() {

    appState.airWritingEnabled =
        !appState.airWritingEnabled;


    // ========================================
    // ENABLE
    // ========================================

    if (
        appState.airWritingEnabled
    ) {

        if (
            typeof enableAirWriting ===
            "function"
        ) {

            enableAirWriting();

        }

    }


    // ========================================
    // DISABLE
    // ========================================

    else {

        if (
            typeof disableAirWriting ===
            "function"
        ) {

            disableAirWriting();

        }


        if (
            typeof stopAirWriting ===
            "function"
        ) {

            stopAirWriting();

        }

    }


    updateAppUI();


    // ========================================
    // CLICK SOUND
    // ========================================

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


    // ========================================
    // ENABLE SHIELD
    // ========================================

    if (
        appState.shieldEnabled
    ) {

        if (
            typeof enableShield ===
            "function"
        ) {

            enableShield();

        }

    }


    // ========================================
    // DISABLE SHIELD
    // ========================================

    else {

        if (
            typeof disableShield ===
            "function"
        ) {

            disableShield();

        }


        if (
            typeof hideAllShields ===
            "function"
        ) {

            hideAllShields();

        }

    }


    updateAppUI();


    console.log(
        "Shield:",
        appState.shieldEnabled
            ? "ON"
            : "OFF"
    );

}


// ============================================
// CLEAR APPLICATION CANVAS
// ============================================

function clearApplicationCanvas() {


    // ========================================
    // CLEAR AIR WRITING
    // ========================================

    if (
        typeof clearAirWriting ===
        "function"
    ) {

        clearAirWriting();

    }

    else if (
        appWritingCanvas
    ) {

        const ctx =
            appWritingCanvas.getContext(
                "2d"
            );


        if (ctx) {

            ctx.clearRect(
                0,
                0,
                appWritingCanvas.width,
                appWritingCanvas.height
            );

        }

    }


    // ========================================
    // CLEAR EFFECTS
    // ========================================

    if (
        typeof clearEffectsCanvas ===
        "function"
    ) {

        clearEffectsCanvas();

    }

    else if (
        appCanvas
    ) {

        const ctx =
            appCanvas.getContext(
                "2d"
            );


        if (ctx) {

            ctx.clearRect(
                0,
                0,
                appCanvas.width,
                appCanvas.height
            );

        }

    }


    // ========================================
    // SOUND
    // ========================================

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
// IMPORTANT:
// handTracking.js calls this function.
// This function MUST exist globally.
// ============================================

function handleHandResults(results) {

    if (!results) {

        return;

    }


    // ========================================
    // UPDATE HAND LANDMARKS
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
    // UPDATE HAND COUNT
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

    }

    else {

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

    }

    else {

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

    }

    else {

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

    }

    else if (
        typeof processVisualEffects ===
        "function"
    ) {

        processVisualEffects(
            results
        );

    }

}


// ============================================
// UPDATE APPLICATION HAND STATE
// ============================================

function updateAppHandState() {


    // ========================================
    // PRIMARY METHOD
    // ========================================

    if (
        typeof getHandCount ===
        "function"
    ) {

        appState.handCount =
            getHandCount();

        return;

    }


    // ========================================
    // FALLBACK METHOD
    // ========================================

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


    // ========================================
    // AIR WRITE BUTTON
    // ========================================

    if (airWriteButton) {

        airWriteButton.classList.toggle(
            "active",
            appState.airWritingEnabled
        );

    }


    // ========================================
    // SHIELD BUTTON
    // ========================================

    if (shieldButton) {

        shieldButton.classList.toggle(
            "active",
            appState.shieldEnabled
        );

    }


    // ========================================
    // SYSTEM STATUS
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

        }

        else {

            systemStatus.textContent =
                "SYSTEM: STANDBY";


            systemStatus.classList.remove(
                "online"
            );

        }

    }


    // ========================================
    // HAND COUNT
    // ========================================

    const handCountElement =
        document.getElementById(
            "handCount"
        );


    if (handCountElement) {

        handCountElement.textContent =
            `HANDS: ${appState.handCount}`;

    }


    // ========================================
    // HANDS DETECTED
    // ========================================

    const handsDetected =
        document.getElementById(
            "handsDetected"
        );


    if (handsDetected) {

        handsDetected.textContent =
            appState.handCount;

    }


    // ========================================
    // CURRENT MODE
    // ========================================

    const currentMode =
        document.getElementById(
            "currentMode"
        );


    if (currentMode) {

        currentMode.textContent =
            appState.mode;

    }


    // ========================================
    // MODE
    // ========================================

    const modeElement =
        document.getElementById(
            "mode"
        );


    if (modeElement) {

        modeElement.textContent =
            appState.mode;

    }


    // ========================================
    // SHIELD STATUS
    // ========================================

    const shieldStatus =
        document.getElementById(
            "shieldStatus"
        );


    if (shieldStatus) {

        shieldStatus.textContent =
            appState.shieldEnabled
                ? "ON"
                : "OFF";

    }

}


// ============================================
// CAMERA STATE
// ============================================
// camera.js can call this.
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


        updateAppUI();

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


    const currentMode =
        document.getElementById(
            "currentMode"
        );


    if (currentMode) {

        currentMode.textContent =
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


    // ========================================
    // HIDE SHIELDS
    // ========================================

    if (
        typeof hideAllShields ===
        "function"
    ) {

        hideAllShields();

    }


    // ========================================
    // HIDE TARGET
    // ========================================

    if (
        typeof hideTargetReticle ===
        "function"
    ) {

        hideTargetReticle();

    }


    // ========================================
    // CLEAR WRITING
    // ========================================

    if (
        typeof clearAirWriting ===
        "function"
    ) {

        clearAirWriting();

    }


    // ========================================
    // CLEAR EFFECTS
    // ========================================

    if (
        typeof clearEffectsCanvas ===
        "function"
    ) {

        clearEffectsCanvas();

    }


    // ========================================
    // UPDATE UI
    // ========================================

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


// ============================================
// GLOBAL EXPORTS
// ============================================
// Explicit exports make sure other modules
// such as handTracking.js can access them.
// ============================================

window.handleHandResults =
    handleHandResults;

window.getAppState =
    getAppState;

window.setAppMode =
    setAppMode;

window.setCameraState =
    setCameraState;

window.resetApplication =
    resetApplication;

window.toggleAirWritingMode =
    toggleAirWritingMode;

window.toggleShieldMode =
    toggleShieldMode;

window.clearApplicationCanvas =
    clearApplicationCanvas;


// ============================================
// MODULE LOADED
// ============================================

console.log(
    "AeroShield AI app module loaded successfully."
);