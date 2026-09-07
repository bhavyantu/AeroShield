// ============================================
// AEROSHIELD AI
// HUD SYSTEM - FINAL
// ============================================

const hudState = {

    handCount: 0,

    mode: "STANDBY",

    shieldStatus: "OFFLINE",

    targetVisible: false
};


// ============================================
// DOM ELEMENTS
// ============================================

const hudHandCount =
    document.getElementById(
        "handCount"
    );

const hudMode =
    document.getElementById(
        "mode"
    );

const hudHandsDetected =
    document.getElementById(
        "handsDetected"
    );

const hudCurrentMode =
    document.getElementById(
        "currentMode"
    );

const hudShieldStatus =
    document.getElementById(
        "shieldStatus"
    );

const hudTarget =
    document.getElementById(
        "hudTarget"
    );


// ============================================
// HAND COUNT
// ============================================

function updateHUDHandCount(
    count
) {

    hudState.handCount =
        Number(count) || 0;


    if (hudHandCount) {

        hudHandCount.textContent =
            `HANDS: ${hudState.handCount}`;
    }


    if (hudHandsDetected) {

        hudHandsDetected.textContent =
            hudState.handCount;
    }
}


// ============================================
// MODE
// ============================================

function updateHUDMode(
    mode
) {

    hudState.mode =
        mode || "STANDBY";


    if (hudMode) {

        hudMode.textContent =
            hudState.mode;
    }


    if (hudCurrentMode) {

        hudCurrentMode.textContent =
            hudState.mode;
    }
}


// ============================================
// SHIELD STATUS
// ============================================

function updateHUDShieldStatus(
    status
) {

    hudState.shieldStatus =
        status || "OFFLINE";


    if (hudShieldStatus) {

        hudShieldStatus.textContent =
            hudState.shieldStatus;
    }
}


// ============================================
// MAIN HUD UPDATE
// ============================================

function updateHUD(
    results
) {

    const hands =
        results &&
        Array.isArray(
            results.multiHandLandmarks
        )
            ? results.multiHandLandmarks
            : [];


    const count =
        hands.length;


    // ========================================
    // HAND COUNT
    // ========================================

    updateHUDHandCount(
        count
    );


    // ========================================
    // NO HANDS
    // ========================================

    if (
        count === 0
    ) {

        updateHUDMode(
            "STANDBY"
        );

        updateHUDShieldStatus(
            "OFFLINE"
        );

        hideTargetReticle();

        return;
    }


    // ========================================
    // ONE HAND
    // ========================================

    if (
        count === 1
    ) {

        let gesture =
            "HAND DETECTED";


        if (
            typeof detectHandGesture ===
            "function"
        ) {

            try {

                gesture =
                    detectHandGesture(
                        hands[0]
                    );

            } catch (error) {

                console.warn(
                    "Gesture detection warning:",
                    error
                );
            }
        }


        if (
            typeof GESTURES !==
            "undefined" &&
            gesture ===
            GESTURES.POINTING
        ) {

            updateHUDMode(
                "AIR WRITING"
            );

        } else {

            updateHUDMode(
                "SMALL SHIELD"
            );
        }


        updateHUDShieldStatus(
            "ACTIVE"
        );


        return;
    }


    // ========================================
    // TWO OR MORE HANDS
    // ========================================

    if (
        count >= 2
    ) {

        updateHUDMode(
            "BIG SHIELD"
        );

        updateHUDShieldStatus(
            "ACTIVE"
        );

        hideTargetReticle();
    }
}


// ============================================
// TARGET RETICLE
// ============================================

function updateHUDTarget(
    hand
) {

    if (
        !hudTarget ||
        !hand
    ) {

        return;
    }


    let point =
        null;


    // ========================================
    // INDEX FINGER
    // ========================================

    const indexTip =
        hand[8];


    if (
        indexTip
    ) {

        const video =
            document.getElementById(
                "camera"
            );


        if (video) {

            const rect =
                video.getBoundingClientRect();


            if (
                rect.width > 0 &&
                rect.height > 0
            ) {

                point = {

                    x:
                        rect.left +
                        (1 - indexTip.x) *
                        rect.width,

                    y:
                        rect.top +
                        indexTip.y *
                        rect.height
                };
            }
        }
    }


    // ========================================
    // NO POINT
    // ========================================

    if (!point) {

        hideTargetReticle();

        return;
    }


    // ========================================
    // POSITION
    // ========================================

    hudTarget.style.left =
        `${point.x}px`;

    hudTarget.style.top =
        `${point.y}px`;

    hudTarget.style.display =
        "block";


    hudTarget.classList.remove(
        "hidden"
    );


    hudState.targetVisible =
        true;
}


// ============================================
// HIDE TARGET
// ============================================

function hideTargetReticle() {

    if (!hudTarget) {

        return;
    }


    hudTarget.style.display =
        "none";


    hudTarget.classList.add(
        "hidden"
    );


    hudState.targetVisible =
        false;
}


// ============================================
// SYSTEM STATUS
// ============================================

function updateHUDSystemStatus(
    online
) {

    const status =
        document.getElementById(
            "systemStatus"
        );


    if (!status) {

        return;
    }


    if (online) {

        status.textContent =
            "ONLINE";

        status.classList.add(
            "online"
        );

    } else {

        status.textContent =
            "OFFLINE";

        status.classList.remove(
            "online"
        );
    }
}


// ============================================
// CAMERA STATE
// ============================================
//
// NOTE:
// app.js also contains setCameraState().
// This HUD function is deliberately named
// setHUDCameraState() to avoid a global
// function collision.
// ============================================

function setHUDCameraState(
    isActive
) {

    updateHUDSystemStatus(
        Boolean(isActive)
    );


    if (!isActive) {

        updateHUDHandCount(
            0
        );

        updateHUDMode(
            "STANDBY"
        );

        updateHUDShieldStatus(
            "OFFLINE"
        );

        hideTargetReticle();
    }
}


// ============================================
// GET HUD STATE
// ============================================

function getHUDState() {

    return {

        handCount:
            hudState.handCount,

        mode:
            hudState.mode,

        shieldStatus:
            hudState.shieldStatus,

        targetVisible:
            hudState.targetVisible
    };
}


// ============================================
// INITIALIZE HUD
// ============================================

function initializeHUD() {

    updateHUDHandCount(
        0
    );

    updateHUDMode(
        "STANDBY"
    );

    updateHUDShieldStatus(
        "OFFLINE"
    );

    hideTargetReticle();

    updateHUDSystemStatus(
        false
    );


    console.log(
        "HUD initialized."
    );
}


// ============================================
// DOM READY
// ============================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeHUD();

    }
);


// ============================================
// MODULE LOADED
// ============================================

console.log(
    "HUD module loaded successfully."
);