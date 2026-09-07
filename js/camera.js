// ============================================
// AEROSHIELD AI
// CAMERA SYSTEM - FINAL
// ============================================

const cameraState = {
    stream: null,
    started: false,
    initialized: false,
    facingMode: "user"
};


// ============================================
// DOM ELEMENTS
// ============================================

const cameraVideo =
    document.getElementById("camera");

const startCameraButton =
    document.getElementById("startCamera");


// ============================================
// INITIALIZE CAMERA
// ============================================

function initializeCamera() {

    if (!cameraVideo) {

        console.error(
            "ERROR: Camera video element not found."
        );

        return false;
    }


    cameraVideo.autoplay = true;
    cameraVideo.playsInline = true;
    cameraVideo.muted = true;

    cameraVideo.setAttribute(
        "autoplay",
        ""
    );

    cameraVideo.setAttribute(
        "playsinline",
        ""
    );

    cameraVideo.setAttribute(
        "muted",
        ""
    );


    cameraState.initialized =
        true;


    console.log(
        "Camera initialized."
    );


    return true;
}


// ============================================
// CAMERA CONSTRAINTS
// ============================================

function getCameraConstraints() {

    return {

        audio: false,

        video: {

            facingMode: {
                ideal:
                    cameraState.facingMode
            },

            width: {
                ideal: 1280
            },

            height: {
                ideal: 720
            },

            frameRate: {
                ideal: 30,
                max: 60
            }
        }
    };
}


// ============================================
// CHECK CAMERA API
// ============================================

function cameraAPIAvailable() {

    return Boolean(
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia
    );
}


// ============================================
// START CAMERA
// ============================================

async function startCamera() {

    console.log(
        "Starting AeroShield camera..."
    );


    if (!cameraVideo) {

        console.error(
            "Camera element not found."
        );

        return false;
    }


    // ========================================
    // ALREADY RUNNING
    // ========================================

    if (
        cameraState.started &&
        cameraState.stream
    ) {

        console.log(
            "Camera is already running."
        );

        return true;
    }


    // ========================================
    // CHECK API
    // ========================================

    if (!cameraAPIAvailable()) {

        showCameraError(
            "CAMERA API NOT AVAILABLE"
        );

        return false;
    }


    try {

        // ====================================
        // STOP OLD STREAM
        // ====================================

        stopCameraStream();


        // ====================================
        // UPDATE STATUS
        // ====================================

        setCameraStatus(
            "CAMERA: STARTING..."
        );


        // ====================================
        // REQUEST CAMERA
        // ====================================

        const stream =
            await navigator.mediaDevices
                .getUserMedia(
                    getCameraConstraints()
                );


        console.log(
            "Camera permission granted."
        );


        // ====================================
        // SAVE STREAM
        // ====================================

        cameraState.stream =
            stream;


        // ====================================
        // ATTACH STREAM
        // ====================================

        cameraVideo.srcObject =
            stream;


        cameraVideo.muted =
            true;

        cameraVideo.autoplay =
            true;

        cameraVideo.playsInline =
            true;


        // ====================================
        // WAIT FOR VIDEO
        // ====================================

        await waitForVideoReady();


        // ====================================
        // PLAY VIDEO
        // ====================================

        try {

            await cameraVideo.play();

        } catch (playError) {

            console.warn(
                "Video autoplay warning:",
                playError
            );

            // Try once more
            cameraVideo.muted =
                true;

            await cameraVideo.play();
        }


        // ====================================
        // VERIFY STREAM
        // ====================================

        if (
            !cameraVideo.srcObject ||
            !cameraVideo.srcObject.active
        ) {

            throw new Error(
                "Camera stream is not active."
            );
        }


        // ====================================
        // CAMERA STARTED
        // ====================================

        cameraState.started =
            true;


        console.log(
            "================================"
        );

        console.log(
            "CAMERA STARTED SUCCESSFULLY"
        );

        console.log(
            "Resolution:",
            cameraVideo.videoWidth,
            "x",
            cameraVideo.videoHeight
        );

        console.log(
            "================================"
        );


        // ====================================
        // UPDATE STATUS
        // ====================================

        setCameraStatus(
            "SYSTEM: ONLINE"
        );


        // ====================================
        // APP CAMERA STATE
        // ====================================

        if (
            typeof setCameraState ===
            "function"
        ) {

            setCameraState(
                true
            );
        }


        // ====================================
        // START HAND TRACKING
        // ====================================

        if (
            typeof startHandTracking ===
            "function"
        ) {

            const trackingStarted =
                await startHandTracking();


            if (!trackingStarted) {

                console.warn(
                    "Hand tracking could not start."
                );
            }
        }


        // ====================================
        // AUDIO
        // ====================================

        if (
            typeof initializeAudio ===
            "function"
        ) {

            try {

                initializeAudio();

            } catch (error) {

                console.warn(
                    "Audio initialization warning:",
                    error
                );
            }
        }


        // ====================================
        // SUCCESS SOUND
        // ====================================

        if (
            typeof playStartupSound ===
            "function"
        ) {

            try {

                playStartupSound();

            } catch (_) {}
        }


        return true;

    } catch (error) {

        console.error(
            "================================"
        );

        console.error(
            "CAMERA START ERROR"
        );

        console.error(
            error
        );

        console.error(
            "================================"
        );


        cameraState.started =
            false;


        cameraState.stream =
            null;


        showCameraError(
            getCameraErrorMessage(
                error
            )
        );


        return false;
    }
}


// ============================================
// WAIT FOR VIDEO READY
// ============================================

function waitForVideoReady() {

    return new Promise(
        (resolve, reject) => {

            if (!cameraVideo) {

                reject(
                    new Error(
                        "Camera video element missing."
                    )
                );

                return;
            }


            // ==================================
            // ALREADY READY
            // ==================================

            if (
                cameraVideo.readyState >= 2 &&
                cameraVideo.videoWidth > 0
            ) {

                resolve();

                return;
            }


            let finished =
                false;


            const timeout =
                setTimeout(
                    () => {

                        if (finished) {
                            return;
                        }

                        finished =
                            true;

                        cleanup();


                        // If stream exists,
                        // allow playback attempt
                        if (
                            cameraVideo.srcObject
                        ) {

                            resolve();

                        } else {

                            reject(
                                new Error(
                                    "Camera video did not become ready."
                                )
                            );
                        }

                    },
                    10000
                );


            function loadedMetadata() {

                if (finished) {
                    return;
                }


                if (
                    cameraVideo.videoWidth > 0
                ) {

                    finished =
                        true;

                    cleanup();

                    resolve();
                }
            }


            function loadedData() {

                if (finished) {
                    return;
                }


                finished =
                    true;

                cleanup();

                resolve();
            }


            function errorHandler() {

                if (finished) {
                    return;
                }


                finished =
                    true;

                cleanup();


                reject(
                    new Error(
                        "Camera video failed to load."
                    )
                );
            }


            function cleanup() {

                clearTimeout(
                    timeout
                );


                cameraVideo.removeEventListener(
                    "loadedmetadata",
                    loadedMetadata
                );


                cameraVideo.removeEventListener(
                    "loadeddata",
                    loadedData
                );


                cameraVideo.removeEventListener(
                    "error",
                    errorHandler
                );
            }


            cameraVideo.addEventListener(
                "loadedmetadata",
                loadedMetadata
            );


            cameraVideo.addEventListener(
                "loadeddata",
                loadedData
            );


            cameraVideo.addEventListener(
                "error",
                errorHandler
            );


            // Check again immediately
            setTimeout(
                () => {

                    if (
                        !finished &&
                        cameraVideo.readyState >= 2 &&
                        cameraVideo.videoWidth > 0
                    ) {

                        finished =
                            true;

                        cleanup();

                        resolve();
                    }

                },
                100
            );
        }
    );
}


// ============================================
// CAMERA ERROR MESSAGE
// ============================================

function getCameraErrorMessage(
    error
) {

    if (!error) {

        return "CAMERA ERROR";
    }


    switch (
        error.name
    ) {

        case "NotAllowedError":

            return (
                "CAMERA PERMISSION DENIED"
            );


        case "PermissionDeniedError":

            return (
                "CAMERA PERMISSION DENIED"
            );


        case "NotFoundError":

            return (
                "NO CAMERA FOUND"
            );


        case "DevicesNotFoundError":

            return (
                "NO CAMERA FOUND"
            );


        case "NotReadableError":

            return (
                "CAMERA IS BUSY"
            );


        case "TrackStartError":

            return (
                "CAMERA IS BUSY"
            );


        case "OverconstrainedError":

            return (
                "CAMERA SETTINGS NOT SUPPORTED"
            );


        case "SecurityError":

            return (
                "CAMERA BLOCKED"
            );


        case "AbortError":

            return (
                "CAMERA START ABORTED"
            );


        default:

            return (
                error.message ||
                "CAMERA ERROR"
            );
    }
}


// ============================================
// STATUS
// ============================================

function setCameraStatus(
    message
) {

    const systemStatus =
        document.getElementById(
            "systemStatus"
        );


    if (systemStatus) {

        systemStatus.textContent =
            message;


        if (
            message ===
            "SYSTEM: ONLINE"
        ) {

            systemStatus.classList.add(
                "online"
            );

        } else {

            systemStatus.classList.remove(
                "online"
            );
        }
    }


    console.log(
        message
    );
}


// ============================================
// SHOW ERROR
// ============================================

function showCameraError(
    message
) {

    console.error(
        "CAMERA:",
        message
    );


    setCameraStatus(
        message
    );


    if (
        typeof setCameraState ===
        "function"
    ) {

        setCameraState(
            false
        );
    }
}


// ============================================
// STOP STREAM
// ============================================

function stopCameraStream() {

    if (
        cameraState.stream
    ) {

        const tracks =
            cameraState.stream.getTracks();


        tracks.forEach(
            track => {

                try {

                    track.stop();

                } catch (_) {}

            }
        );
    }


    cameraState.stream =
        null;
}


// ============================================
// STOP CAMERA
// ============================================

function stopCamera() {

    console.log(
        "Stopping camera..."
    );


    // ========================================
    // STOP TRACKING
    // ========================================

    if (
        typeof stopHandTracking ===
        "function"
    ) {

        try {

            stopHandTracking();

        } catch (error) {

            console.warn(
                "Hand tracking stop warning:",
                error
            );
        }
    }


    // ========================================
    // STOP STREAM
    // ========================================

    stopCameraStream();


    // ========================================
    // CLEAR VIDEO
    // ========================================

    if (cameraVideo) {

        cameraVideo.pause();

        cameraVideo.srcObject =
            null;
    }


    cameraState.started =
        false;


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
    // RESET HUD
    // ========================================

    if (
        typeof updateHUD ===
        "function"
    ) {

        updateHUD({
            multiHandLandmarks: [],
            multiHandedness: []
        });
    }


    // ========================================
    // UPDATE APP
    // ========================================

    if (
        typeof setCameraState ===
        "function"
    ) {

        setCameraState(
            false
        );
    }


    setCameraStatus(
        "SYSTEM: STANDBY"
    );


    console.log(
        "Camera stopped."
    );
}


// ============================================
// TOGGLE CAMERA
// ============================================

async function toggleCamera() {

    if (
        cameraState.started
    ) {

        stopCamera();

        return false;
    }


    return await startCamera();
}


// ============================================
// CAMERA STATUS
// ============================================

function isCameraStarted() {

    return cameraState.started;
}


// ============================================
// GET CAMERA STATE
// ============================================

function getCameraState() {

    return {

        initialized:
            cameraState.initialized,

        started:
            cameraState.started,

        facingMode:
            cameraState.facingMode,

        hasStream:
            Boolean(
                cameraState.stream
            )
    };
}


// ============================================
// CHECK CAMERA
// ============================================

async function checkCameraAvailability() {

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.enumerateDevices
    ) {

        return false;
    }


    try {

        const devices =
            await navigator.mediaDevices
                .enumerateDevices();


        return devices.some(
            device =>
                device.kind ===
                "videoinput"
        );

    } catch (error) {

        console.error(
            "Camera device check failed:",
            error
        );

        return false;
    }
}


// ============================================
// CAMERA BUTTON
// ============================================

if (startCameraButton) {

    startCameraButton.addEventListener(
        "click",
        async () => {

            console.log(
                "START SYSTEM button clicked."
            );


            if (
                cameraState.started
            ) {

                stopCamera();

            } else {

                await startCamera();
            }

        }
    );
}


// ============================================
// PAGE LOAD
// ============================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCamera();

        setCameraStatus(
            "SYSTEM: STANDBY"
        );

    }
);


// ============================================
// CLEANUP
// ============================================

window.addEventListener(
    "beforeunload",
    () => {

        stopCameraStream();

    }
);


// ============================================
// MODULE LOADED
// ============================================

console.log(
    "Camera module loaded successfully."
);