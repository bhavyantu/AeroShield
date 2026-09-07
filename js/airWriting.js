// =========================================
// AEROSHIELD AI
// AIR WRITING MODULE
// INDEX-TIP PEN + COLOR + GLOW
// =========================================


// =========================================
// CANVAS
// =========================================

const writingCanvas =
    document.getElementById("writingCanvas");

const writingContext =
    writingCanvas
        ? writingCanvas.getContext("2d")
        : null;


// =========================================
// AIR WRITING STATE
// =========================================

let isWriting = false;

let previousPoint = null;

let currentWritingColor = "#00f6ff";

let writingLineWidth = 5;


// =========================================
// SMOOTHING
// =========================================

let smoothPoint = null;

const SMOOTHING_FACTOR = 0.35;


// =========================================
// GLOWING PEN TIP
// =========================================

let penTipElement = null;


// =========================================
// CREATE PEN TIP
// =========================================

function createPenTip() {

    if (penTipElement) {
        return;
    }


    penTipElement =
        document.createElement("div");

    penTipElement.id =
        "airWritingPenTip";


    penTipElement.style.position =
        "fixed";

    penTipElement.style.width =
        "18px";

    penTipElement.style.height =
        "18px";

    penTipElement.style.borderRadius =
        "50%";

    penTipElement.style.pointerEvents =
        "none";

    penTipElement.style.zIndex =
        "200";

    penTipElement.style.display =
        "none";

    penTipElement.style.transform =
        "translate(-50%, -50%)";

    penTipElement.style.background =
        currentWritingColor;

    penTipElement.style.boxShadow =
        `
        0 0 5px ${currentWritingColor},
        0 0 12px ${currentWritingColor},
        0 0 25px ${currentWritingColor},
        0 0 45px ${currentWritingColor}
        `;


    document.body.appendChild(
        penTipElement
    );
}


// =========================================
// UPDATE PEN TIP COLOR
// =========================================

function updatePenTipColor() {

    if (!penTipElement) {
        return;
    }


    penTipElement.style.background =
        currentWritingColor;

    penTipElement.style.boxShadow =
        `
        0 0 5px ${currentWritingColor},
        0 0 12px ${currentWritingColor},
        0 0 25px ${currentWritingColor},
        0 0 45px ${currentWritingColor}
        `;
}


// =========================================
// SHOW PEN TIP
// =========================================

function showPenTip(point) {

    if (!penTipElement || !point) {
        return;
    }


    penTipElement.style.display =
        "block";


    penTipElement.style.left =
        `${point.x}px`;

    penTipElement.style.top =
        `${point.y}px`;
}


// =========================================
// HIDE PEN TIP
// =========================================

function hidePenTip() {

    if (!penTipElement) {
        return;
    }


    penTipElement.style.display =
        "none";
}


// =========================================
// SMOOTH POINT
// =========================================

function getSmoothPoint(point) {

    if (!point) {
        return null;
    }


    if (!smoothPoint) {

        smoothPoint = {
            x: point.x,
            y: point.y
        };

        return {
            x: point.x,
            y: point.y
        };
    }


    smoothPoint.x +=
        (
            point.x -
            smoothPoint.x
        ) * SMOOTHING_FACTOR;


    smoothPoint.y +=
        (
            point.y -
            smoothPoint.y
        ) * SMOOTHING_FACTOR;


    return {
        x: smoothPoint.x,
        y: smoothPoint.y
    };
}


// =========================================
// START WRITING
// =========================================

function startAirWriting(point) {

    if (!writingContext || !point) {
        return;
    }


    isWriting = true;


    previousPoint = {
        x: point.x,
        y: point.y
    };
}


// =========================================
// DRAW AIR LINE
// =========================================

function drawAirLine(
    point1,
    point2
) {

    if (
        !writingContext ||
        !point1 ||
        !point2
    ) {
        return;
    }


    writingContext.beginPath();


    writingContext.moveTo(
        point1.x,
        point1.y
    );


    writingContext.lineTo(
        point2.x,
        point2.y
    );


    // =====================================
    // PEN STYLE
    // =====================================

    writingContext.strokeStyle =
        currentWritingColor;


    writingContext.lineWidth =
        writingLineWidth;


    writingContext.lineCap =
        "round";


    writingContext.lineJoin =
        "round";


    // =====================================
    // HOLOGRAPHIC GLOW
    // =====================================

    writingContext.shadowBlur =
        18;

    writingContext.shadowColor =
        currentWritingColor;


    writingContext.stroke();


    writingContext.closePath();


    // Reset shadow
    writingContext.shadowBlur = 0;
}


// =========================================
// STOP WRITING
// =========================================

function stopAirWriting() {

    isWriting = false;

    previousPoint = null;

    smoothPoint = null;
}


// =========================================
// CONVERT MEDIAPIPE → CANVAS
// =========================================

function convertToCanvasPoint(
    landmark
) {

    if (
        !landmark ||
        !writingCanvas
    ) {
        return null;
    }


    return {

        // Camera preview is mirrored
        x:
            (1 - landmark.x) *
            writingCanvas.width,

        y:
            landmark.y *
            writingCanvas.height
    };
}


// =========================================
// CONVERT CANVAS → SCREEN
// =========================================

function convertCanvasToScreen(
    point
) {

    if (
        !point ||
        !writingCanvas
    ) {
        return null;
    }


    const rect =
        writingCanvas.getBoundingClientRect();


    const scaleX =
        rect.width /
        writingCanvas.width;

    const scaleY =
        rect.height /
        writingCanvas.height;


    return {

        x:
            rect.left +
            point.x * scaleX,

        y:
            rect.top +
            point.y * scaleY
    };
}


// =========================================
// PROCESS AIR WRITING
// =========================================

function processAirWriting(results) {

    if (
        !writingCanvas ||
        !writingContext
    ) {
        return;
    }


    const hands =
        results &&
        Array.isArray(
            results.multiHandLandmarks
        )
            ? results.multiHandLandmarks
            : [];


    // =====================================
    // NO HAND
    // =====================================

    if (hands.length === 0) {

        stopAirWriting();

        hidePenTip();

        return;
    }


    // =====================================
    // FIRST HAND
    // =====================================

    const hand =
        hands[0];


    // =====================================
    // GET GESTURE
    // =====================================

    const gesture =
        detectHandGesture(hand);


    // =====================================
    // INDEX FINGER ONLY
    // =====================================

    if (
        gesture !==
        GESTURES.POINTING
    ) {

        stopAirWriting();

        hidePenTip();

        return;
    }


    // =====================================
    // INDEX FINGERTIP
    // MEDIAPIPE LANDMARK 8
    // =====================================

    const indexTip =
        hand[
            HAND_LANDMARKS.INDEX_TIP
        ];


    if (!indexTip) {

        stopAirWriting();

        hidePenTip();

        return;
    }


    // =====================================
    // RAW CANVAS POINT
    // =====================================

    const rawPoint =
        convertToCanvasPoint(
            indexTip
        );


    if (!rawPoint) {
        return;
    }


    // =====================================
    // SMOOTH INDEX TIP
    // =====================================

    const currentPoint =
        getSmoothPoint(
            rawPoint
        );


    if (!currentPoint) {
        return;
    }


    // =====================================
    // GLOWING PEN TIP
    // =====================================

    const screenPoint =
        convertCanvasToScreen(
            currentPoint
        );


    if (screenPoint) {

        showPenTip(
            screenPoint
        );
    }


    // =====================================
    // FIRST WRITING POINT
    // =====================================

    if (!isWriting) {

        startAirWriting(
            currentPoint
        );

        return;
    }


    // =====================================
    // DRAW
    // =====================================

    if (previousPoint) {

        drawAirLine(
            previousPoint,
            currentPoint
        );
    }


    // =====================================
    // SAVE POINT
    // =====================================

    previousPoint = {

        x: currentPoint.x,

        y: currentPoint.y
    };
}


// =========================================
// CLEAR WRITING
// =========================================

function clearAirWriting() {

    if (
        !writingCanvas ||
        !writingContext
    ) {
        return;
    }


    writingContext.clearRect(
        0,
        0,
        writingCanvas.width,
        writingCanvas.height
    );


    stopAirWriting();


    console.log(
        "Air writing cleared."
    );
}


// =========================================
// SET WRITING COLOR
// =========================================

function setWritingColor(color) {

    if (!color) {
        return;
    }


    currentWritingColor =
        color;


    updatePenTipColor();


    console.log(
        "Writing color:",
        currentWritingColor
    );
}


// =========================================
// SET LINE WIDTH
// =========================================

function setWritingLineWidth(width) {

    if (
        typeof width !== "number" ||
        width <= 0
    ) {
        return;
    }


    writingLineWidth =
        width;
}


// =========================================
// GET WRITING STATE
// =========================================

function getWritingState() {

    return {

        isWriting:
            isWriting,

        color:
            currentWritingColor,

        lineWidth:
            writingLineWidth,

        previousPoint:
            previousPoint
    };
}


// =========================================
// COLOR PICKER
// =========================================

function initializeWritingColorPicker() {

    const colorPicker =
        document.getElementById(
            "writingColor"
        );


    if (!colorPicker) {
        return;
    }


    // Initial color
    colorPicker.value =
        currentWritingColor;


    colorPicker.addEventListener(
        "input",
        function () {

            setWritingColor(
                this.value
            );
        }
    );
}


// =========================================
// QUICK COLORS
// =========================================

function initializeQuickColors() {

    const colorButtons =
        document.querySelectorAll(
            "[data-writing-color]"
        );


    colorButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const color =
                        this.dataset.writingColor;


                    setWritingColor(
                        color
                    );


                    const colorPicker =
                        document.getElementById(
                            "writingColor"
                        );


                    if (colorPicker) {

                        colorPicker.value =
                            color;
                    }


                    colorButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "selected"
                            );
                        }
                    );


                    button.classList.add(
                        "selected"
                    );
                }
            );
        }
    );
}


// =========================================
// CLEAR BUTTON
// =========================================

function initializeClearButton() {

    const clearButton =
        document.getElementById(
            "clearButton"
        );


    if (!clearButton) {
        return;
    }


    clearButton.addEventListener(
        "click",
        clearAirWriting
    );
}


// =========================================
// INITIALIZE
// =========================================

window.addEventListener(
    "DOMContentLoaded",
    function () {

        createPenTip();

        initializeWritingColorPicker();

        initializeQuickColors();

        initializeClearButton();


        console.log(
            "Air Writing initialized."
        );

        console.log(
            "Index fingertip writing enabled."
        );
    }
);