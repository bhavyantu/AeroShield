// ============================================
// HAND TRACKING SYSTEM
// AeroShield AI
// ============================================

let handsDetector = null;
let handTrackingReady = false;
let handTrackingRunning = false;
let animationFrameId = null;

const trackingVideo =
    document.getElementById("camera");


// ============================================
// INITIALIZE MEDIAPIPE HANDS
// ============================================

function initializeHandTracking() {

    if (typeof Hands === "undefined") {

        console.error(
            "MediaPipe Hands library not loaded."
        );

        return false;
    }

    if (!trackingVideo) {

        console.error(
            "Camera video element not found."
        );

        return false;
    }


    // Prevent duplicate initialization
    if (handsDetector) {

        return true;
    }


    try {

        handsDetector = new Hands({
            locateFile: file => {

                return (
                    "https://cdn.jsdelivr.net/npm/@mediapipe/hands/" +
                    file
                );

            }
        });


        handsDetector.setOptions({

            maxNumHands: 2,

            modelComplexity: 1,

            minDetectionConfidence: 0.6,

            minTrackingConfidence: 0.6

        });


        handsDetector.onResults(
            onHandTrackingResults
        );


        handTrackingReady = true;


        console.log(
            "MediaPipe Hands initialized."
        );


        return true;

    } catch (error) {

        console.error(
            "Hand tracking initialization failed:",
            error
        );

        handTrackingReady = false;

        return false;
    }
}


// ============================================
// HANDLE MEDIAPIPE RESULTS
// ============================================

function onHandTrackingResults(results) {

    if (!results) {
        return;
    }


    if (
        typeof handleHandResults ===
        "function"
    ) {

        handleHandResults(
            results
        );

    } else {

        console.warn(
            "handleHandResults() is not available."
        );
    }
}


// ============================================
// PROCESS VIDEO FRAME
// ============================================

async function processVideoFrame() {

    if (
        !handTrackingRunning
    ) {

        return;
    }


    if (
        !handsDetector ||
        !trackingVideo
    ) {

        return;
    }


    try {

        if (
            trackingVideo.readyState >= 2
        ) {

            await handsDetector.send({
                image: trackingVideo
            });
        }

    } catch (error) {

        console.error(
            "Hand tracking frame error:",
            error
        );
    }


    if (
        handTrackingRunning
    ) {

        animationFrameId =
            requestAnimationFrame(
                processVideoFrame
            );
    }
}


// ============================================
// START HAND TRACKING
// ============================================

async function startHandTracking() {

    if (
        !trackingVideo
    ) {

        console.error(
            "Camera video element not found."
        );

        return false;
    }


    // Initialize if necessary
    if (
        !handsDetector ||
        !handTrackingReady
    ) {

        const initialized =
            initializeHandTracking();

        if (!initialized) {

            return false;
        }
    }


    // Already running
    if (
        handTrackingRunning
    ) {

        return true;
    }


    // Camera must be ready
    if (
        !trackingVideo.srcObject
    ) {

        console.warn(
            "Camera stream is not available."
        );

        return false;
    }


    try {

        await trackingVideo.play();

    } catch (error) {

        console.warn(
            "Video play warning:",
            error
        );
    }


    handTrackingRunning =
        true;


    console.log(
        "Hand tracking started."
    );


    // Process immediately
    animationFrameId =
        requestAnimationFrame(
            processVideoFrame
        );


    return true;
}


// ============================================
// START TRACKING AFTER CAMERA
// ============================================

function startTrackingAfterCamera() {

    if (
        !trackingVideo
    ) {

        return false;
    }


    if (
        !trackingVideo.srcObject
    ) {

        console.warn(
            "Cannot start tracking: camera not ready."
        );

        return false;
    }


    return startHandTracking();
}


// ============================================
// STOP HAND TRACKING
// ============================================

function stopHandTracking() {

    handTrackingRunning =
        false;


    if (
        animationFrameId !== null
    ) {

        cancelAnimationFrame(
            animationFrameId
        );

        animationFrameId =
            null;
    }


    // Clear current hand state
    if (
        typeof updateHandLandmarks ===
        "function"
    ) {

        updateHandLandmarks({

            multiHandLandmarks: [],

            multiHandedness: []

        });
    }


    // Hide shields
    if (
        typeof hideAllShields ===
        "function"
    ) {

        hideAllShields();
    }


    // Hide HUD target
    if (
        typeof hideTargetReticle ===
        "function"
    ) {

        hideTargetReticle();
    }


    console.log(
        "Hand tracking stopped."
    );
}


// ============================================
// RESTART HAND TRACKING
// ============================================

async function restartHandTracking() {

    stopHandTracking();

    await new Promise(
        resolve =>
            setTimeout(
                resolve,
                100
            )
    );


    return await startHandTracking();
}


// ============================================
// CHECK STATUS
// ============================================

function isHandTrackingRunning() {

    return handTrackingRunning;
}


function isHandTrackingReady() {

    return handTrackingReady;
}


function getHandTrackingState() {

    return {

        ready:
            handTrackingReady,

        running:
            handTrackingRunning,

        detector:
            !!handsDetector

    };
}


// ============================================
// RESET HAND TRACKING
// ============================================

function resetHandTracking() {

    stopHandTracking();


    if (
        handsDetector
    ) {

        handsDetector.close();

        handsDetector =
            null;
    }


    handTrackingReady =
        false;


    console.log(
        "Hand tracking reset."
    );
}


// ============================================
// PAGE VISIBILITY
// ============================================

document.addEventListener(
    "visibilitychange",
    async () => {

        // Browser tab hidden
        if (
            document.hidden
        ) {

            if (
                handTrackingRunning
            ) {

                if (
                    animationFrameId !==
                    null
                ) {

                    cancelAnimationFrame(
                        animationFrameId
                    );

                    animationFrameId =
                        null;
                }
            }

            return;
        }


        // Browser tab visible again
        if (
            !handTrackingRunning
        ) {

            return;
        }


        animationFrameId =
            requestAnimationFrame(
                processVideoFrame
            );
    }
);


// ============================================
// INITIALIZE AFTER PAGE LOAD
// ============================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        // MediaPipe may already be loaded
        // because the CDN scripts appear before
        // this project script.

        if (
            typeof Hands !== "undefined"
        ) {

            initializeHandTracking();

        } else {

            console.warn(
                "MediaPipe Hands is not loaded yet."
            );
        }

    }
);


console.log(
    "Hand Tracking module loaded successfully."
);