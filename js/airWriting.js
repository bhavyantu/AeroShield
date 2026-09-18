/* =========================================================
   AEROSHIELD AI
   AIR WRITING SYSTEM
   NORMAL / NON-REVERSED WRITING
   ========================================================= */

const writingCanvas = document.getElementById("writingCanvas");

const writingContext = writingCanvas
    ? writingCanvas.getContext("2d")
    : null;

let isWriting = false;
let previousPoint = null;

let currentWritingColor = "#00f6ff";
let writingLineWidth = 5;


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeWritingCanvas() {

    if (!writingCanvas || !writingContext) {
        console.warn("Writing canvas not found.");
        return;
    }

    resizeWritingCanvas();

    writingContext.lineCap = "round";
    writingContext.lineJoin = "round";
    writingContext.lineWidth = writingLineWidth;
    writingContext.strokeStyle = currentWritingColor;
    writingContext.shadowColor = currentWritingColor;
    writingContext.shadowBlur = 12;

    console.log("Air Writing initialized.");
}


/* =========================================================
   RESIZE
   ========================================================= */

function resizeWritingCanvas() {

    if (!writingCanvas || !writingContext) {
        return;
    }

    const rect = writingCanvas.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
        return;
    }

    /*
       Save existing drawing before resizing.
    */

    const oldCanvas = document.createElement("canvas");

    oldCanvas.width = writingCanvas.width;
    oldCanvas.height = writingCanvas.height;

    const oldContext = oldCanvas.getContext("2d");

    if (
        writingCanvas.width > 0 &&
        writingCanvas.height > 0
    ) {
        oldContext.drawImage(
            writingCanvas,
            0,
            0
        );
    }

    /*
       Set new canvas size.
    */

    writingCanvas.width = rect.width;
    writingCanvas.height = rect.height;

    /*
       Restore drawing settings.
    */

    writingContext.lineCap = "round";
    writingContext.lineJoin = "round";
    writingContext.lineWidth = writingLineWidth;
    writingContext.strokeStyle = currentWritingColor;
    writingContext.shadowColor = currentWritingColor;
    writingContext.shadowBlur = 12;

    /*
       Restore old drawing.
    */

    if (
        oldCanvas.width > 0 &&
        oldCanvas.height > 0
    ) {

        writingContext.drawImage(
            oldCanvas,
            0,
            0,
            oldCanvas.width,
            oldCanvas.height,
            0,
            0,
            writingCanvas.width,
            writingCanvas.height
        );
    }
}


/* =========================================================
   CONVERT MEDIAPIPE POSITION TO CANVAS
   =========================================================

   IMPORTANT:

   We are NOT using:

       scaleX(-1)

   on the writing canvas.

   We also do NOT flip the MediaPipe X coordinate here.

   MediaPipe coordinates are used directly.

   This prevents double mirroring.
   ========================================================= */

function convertToCanvasPoint(landmark) {

    if (!landmark || !writingCanvas) {
        return null;
    }

    return {
        x: landmark.x * writingCanvas.width,
        y: landmark.y * writingCanvas.height
    };
}


/* =========================================================
   START WRITING
   ========================================================= */

function startAirWriting(point) {

    if (!writingContext || !point) {
        return;
    }

    isWriting = true;

    previousPoint = {
        x: point.x,
        y: point.y
    };

    writingContext.beginPath();

    writingContext.moveTo(
        point.x,
        point.y
    );

    writingContext.lineWidth =
        writingLineWidth;

    writingContext.strokeStyle =
        currentWritingColor;

    writingContext.shadowColor =
        currentWritingColor;

    writingContext.shadowBlur = 14;

    if (
        typeof playAirWritingSound === "function"
    ) {
        playAirWritingSound();
    }
}


/* =========================================================
   DRAW LINE
   ========================================================= */

function drawAirLine(point1, point2) {

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

    writingContext.lineWidth =
        writingLineWidth;

    writingContext.strokeStyle =
        currentWritingColor;

    writingContext.shadowColor =
        currentWritingColor;

    writingContext.shadowBlur = 14;

    writingContext.stroke();

    writingContext.closePath();
}


/* =========================================================
   STOP WRITING
   ========================================================= */

function stopAirWriting() {

    isWriting = false;

    previousPoint = null;

    if (writingContext) {
        writingContext.closePath();
    }
}


/* =========================================================
   PROCESS AIR WRITING
   ========================================================= */

function processAirWriting(results) {

    if (
        !writingCanvas ||
        !writingContext
    ) {
        return;
    }

    if (
        !results ||
        !results.multiHandLandmarks
    ) {
        stopAirWriting();
        return;
    }

    const hands =
        results.multiHandLandmarks;

    /*
       No hand.
    */

    if (hands.length === 0) {
        stopAirWriting();
        return;
    }

    /*
       Use first detected hand.
    */

    const hand = hands[0];

    if (!hand) {
        stopAirWriting();
        return;
    }


    /* =====================================================
       GESTURE CHECK
       ===================================================== */

    if (
        typeof detectHandGesture === "function"
    ) {

        const gesture =
            detectHandGesture(hand);

        /*
           Only pointing gesture writes.
        */

        if (
            typeof GESTURES !== "undefined" &&
            gesture !== GESTURES.POINTING
        ) {
            stopAirWriting();
            return;
        }
    }


    /* =====================================================
       INDEX FINGERTIP
       MediaPipe landmark 8
       ===================================================== */

    const indexTip = hand[8];

    if (!indexTip) {
        stopAirWriting();
        return;
    }


    /* =====================================================
       GET CANVAS POSITION
       ===================================================== */

    const currentPoint =
        convertToCanvasPoint(indexTip);

    if (!currentPoint) {
        stopAirWriting();
        return;
    }


    /* =====================================================
       START
       ===================================================== */

    if (!isWriting) {

        startAirWriting(
            currentPoint
        );

        return;
    }


    /* =====================================================
       CONTINUE DRAWING
       ===================================================== */

    if (previousPoint) {

        drawAirLine(
            previousPoint,
            currentPoint
        );
    }

    previousPoint = {
        x: currentPoint.x,
        y: currentPoint.y
    };
}


/* =========================================================
   CLEAR
   ========================================================= */

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

    if (
        typeof playClickSound === "function"
    ) {
        playClickSound();
    }

    console.log("Air writing cleared.");
}


/* =========================================================
   SET COLOR
   ========================================================= */

function setWritingColor(color) {

    if (!color) {
        return;
    }

    currentWritingColor = color;

    if (writingContext) {

        writingContext.strokeStyle =
            currentWritingColor;

        writingContext.shadowColor =
            currentWritingColor;
    }

    console.log(
        "Writing color:",
        currentWritingColor
    );
}


/* =========================================================
   GET COLOR
   ========================================================= */

function getWritingColor() {

    return currentWritingColor;
}


/* =========================================================
   SET LINE WIDTH
   ========================================================= */

function setWritingLineWidth(width) {

    const value = Number(width);

    if (
        !Number.isFinite(value) ||
        value <= 0
    ) {
        return;
    }

    writingLineWidth = value;

    if (writingContext) {
        writingContext.lineWidth =
            writingLineWidth;
    }
}


/* =========================================================
   GET STATE
   ========================================================= */

function getWritingState() {

    return {
        isWriting: isWriting,
        color: currentWritingColor,
        lineWidth: writingLineWidth
    };
}


/* =========================================================
   WINDOW RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {
        resizeWritingCanvas();
    }
);


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeWritingCanvas();
    }
);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.startAirWriting =
    startAirWriting;

window.stopAirWriting =
    stopAirWriting;

window.processAirWriting =
    processAirWriting;

window.clearAirWriting =
    clearAirWriting;

window.setWritingColor =
    setWritingColor;

window.getWritingColor =
    getWritingColor;

window.setWritingLineWidth =
    setWritingLineWidth;

window.getWritingState =
    getWritingState;

window.convertToCanvasPoint =
    convertToCanvasPoint;