// ============================================
// GESTURE DETECTION SYSTEM
// AeroShield AI
// ============================================

const GESTURES = {
    NONE: "NONE",
    OPEN_HAND: "OPEN_HAND",
    FIST: "FIST",
    POINTING: "POINTING",
    PINCH: "PINCH",
    TWO_HANDS: "TWO_HANDS"
};


// ============================================
// CONFIGURATION
// ============================================

const GESTURE_CONFIG = {

    // Thumb + index distance for pinch
    pinchThreshold: 0.08,

    // Minimum ratio required to consider
    // a finger extended
    fingerExtensionRatio: 1.15,

    // Extra margin for very close finger positions
    fingerMargin: 0.015
};


// ============================================
// FINGER LANDMARK INDEXES
// ============================================

const FINGER_DATA = {

    thumb: {
        tip: 4,
        ip: 3,
        mcp: 2
    },

    index: {
        tip: 8,
        pip: 6,
        mcp: 5
    },

    middle: {
        tip: 12,
        pip: 10,
        mcp: 9
    },

    ring: {
        tip: 16,
        pip: 14,
        mcp: 13
    },

    pinky: {
        tip: 20,
        pip: 18,
        mcp: 17
    }
};


// ============================================
// CHECK VALID HAND
// ============================================

function isValidGestureHand(hand) {

    return (
        Array.isArray(hand) &&
        hand.length >= 21
    );
}


// ============================================
// DISTANCE BETWEEN POINTS
// ============================================

function gestureDistance(point1, point2) {

    if (!point1 || !point2) {
        return Infinity;
    }

    const dx =
        point2.x - point1.x;

    const dy =
        point2.y - point1.y;

    const dz =
        (point2.z || 0) -
        (point1.z || 0);

    return Math.sqrt(
        dx * dx +
        dy * dy +
        dz * dz
    );
}


// ============================================
// CHECK FINGER EXTENSION
// ============================================

function isFingerExtended(
    hand,
    fingerName
) {

    if (!isValidGestureHand(hand)) {
        return false;
    }

    const finger =
        FINGER_DATA[fingerName];

    if (!finger) {
        return false;
    }

    const tip =
        hand[finger.tip];

    const pip =
        hand[finger.pip];

    const mcp =
        hand[finger.mcp];

    if (!tip || !pip || !mcp) {
        return false;
    }


    // ----------------------------------------
    // DISTANCE FROM MCP
    // ----------------------------------------

    const tipDistance =
        gestureDistance(
            tip,
            mcp
        );

    const pipDistance =
        gestureDistance(
            pip,
            mcp
        );


    // ----------------------------------------
    // FINGER EXTENSION TEST
    // ----------------------------------------
    //
    // Extended finger:
    //
    // MCP -------- PIP ---------------- TIP
    //
    // Folded finger:
    //
    // MCP ---- TIP/PIP
    //
    // The fingertip should be considerably
    // farther from the MCP than the PIP.
    //

    const distanceExtended =
        tipDistance >
        pipDistance *
        GESTURE_CONFIG.fingerExtensionRatio;


    // ----------------------------------------
    // VERTICAL CHECK
    // ----------------------------------------
    //
    // This additional check is useful for the
    // normal upright webcam position.
    //
    // It is deliberately weaker than before.
    //

    const verticalExtended =
        tip.y <
        pip.y -
        GESTURE_CONFIG.fingerMargin;


    // ----------------------------------------
    // FINAL DECISION
    // ----------------------------------------
    //
    // For a normal pointing gesture, both
    // distance and vertical position should
    // indicate extension.
    //

    return (
        distanceExtended &&
        verticalExtended
    );
}


// ============================================
// CHECK THUMB EXTENSION
// ============================================

function isThumbExtended(hand) {

    if (!isValidGestureHand(hand)) {
        return false;
    }

    const tip =
        hand[FINGER_DATA.thumb.tip];

    const ip =
        hand[FINGER_DATA.thumb.ip];

    const mcp =
        hand[FINGER_DATA.thumb.mcp];

    if (!tip || !ip || !mcp) {
        return false;
    }


    // Thumb mainly moves sideways.

    const tipDistance =
        gestureDistance(
            tip,
            mcp
        );

    const ipDistance =
        gestureDistance(
            ip,
            mcp
        );


    return (
        tipDistance >
        ipDistance *
        1.15
    );
}


// ============================================
// GET FINGER STATES
// ============================================

function getFingerStates(hand) {

    return {

        thumb:
            isThumbExtended(hand),

        index:
            isFingerExtended(
                hand,
                "index"
            ),

        middle:
            isFingerExtended(
                hand,
                "middle"
            ),

        ring:
            isFingerExtended(
                hand,
                "ring"
            ),

        pinky:
            isFingerExtended(
                hand,
                "pinky"
            )
    };
}


// ============================================
// DETECT PINCH
// ============================================

function isPinching(hand) {

    if (!isValidGestureHand(hand)) {
        return false;
    }

    const thumbTip =
        hand[
            FINGER_DATA.thumb.tip
        ];

    const indexTip =
        hand[
            FINGER_DATA.index.tip
        ];

    const distance =
        gestureDistance(
            thumbTip,
            indexTip
        );

    return (
        distance <
        GESTURE_CONFIG.pinchThreshold
    );
}


// ============================================
// DETECT POINTING
// ============================================

function isPointingGesture(hand) {

    if (!isValidGestureHand(hand)) {
        return false;
    }

    const fingers =
        getFingerStates(hand);


    /*
        AIR-WRITING POINTING GESTURE

        INDEX  = EXTENDED
        MIDDLE = FOLDED
        RING   = FOLDED
        PINKY  = FOLDED

        Thumb can be either state.
    */

    return (

        fingers.index === true &&

        fingers.middle === false &&

        fingers.ring === false &&

        fingers.pinky === false
    );
}


// ============================================
// DETECT OPEN HAND
// ============================================

function isOpenHandGesture(hand) {

    if (!isValidGestureHand(hand)) {
        return false;
    }

    const fingers =
        getFingerStates(hand);

    return (

        fingers.index === true &&

        fingers.middle === true &&

        fingers.ring === true &&

        fingers.pinky === true
    );
}


// ============================================
// DETECT FIST
// ============================================

function isFistGesture(hand) {

    if (!isValidGestureHand(hand)) {
        return false;
    }

    const fingers =
        getFingerStates(hand);

    return (

        fingers.index === false &&

        fingers.middle === false &&

        fingers.ring === false &&

        fingers.pinky === false
    );
}


// ============================================
// DETECT SINGLE-HAND GESTURE
// ============================================

function detectSingleHandGesture(hand) {

    if (!isValidGestureHand(hand)) {
        return GESTURES.NONE;
    }


    // ----------------------------------------
    // PINCH HAS HIGHEST PRIORITY
    // ----------------------------------------

    if (isPinching(hand)) {
        return GESTURES.PINCH;
    }


    // ----------------------------------------
    // POINTING
    // ----------------------------------------

    if (isPointingGesture(hand)) {
        return GESTURES.POINTING;
    }


    // ----------------------------------------
    // OPEN HAND
    // ----------------------------------------

    if (isOpenHandGesture(hand)) {
        return GESTURES.OPEN_HAND;
    }


    // ----------------------------------------
    // FIST
    // ----------------------------------------

    if (isFistGesture(hand)) {
        return GESTURES.FIST;
    }


    return GESTURES.NONE;
}


// ============================================
// MAIN GESTURE DETECTOR
// ============================================

function detectHandGesture(hand) {

    if (!isValidGestureHand(hand)) {
        return GESTURES.NONE;
    }

    return detectSingleHandGesture(hand);
}


// ============================================
// DETECT TWO HANDS
// ============================================

function detectTwoHandGesture(results) {

    if (
        !results ||
        !Array.isArray(
            results.multiHandLandmarks
        )
    ) {
        return false;
    }

    return (
        results.multiHandLandmarks.length >= 2
    );
}


// ============================================
// DETECT GESTURE FROM RESULTS
// ============================================

function detectGestureFromResults(results) {

    if (!results) {
        return GESTURES.NONE;
    }

    const hands =
        Array.isArray(
            results.multiHandLandmarks
        )
            ? results.multiHandLandmarks
            : [];


    // ----------------------------------------
    // NO HANDS
    // ----------------------------------------

    if (hands.length === 0) {
        return GESTURES.NONE;
    }


    // ----------------------------------------
    // TWO OR MORE HANDS
    // ----------------------------------------

    if (hands.length >= 2) {
        return GESTURES.TWO_HANDS;
    }


    // ----------------------------------------
    // ONE HAND
    // ----------------------------------------

    return detectHandGesture(
        hands[0]
    );
}


// ============================================
// GET GESTURE INFORMATION
// ============================================

function getGestureInfo(hand) {

    if (!isValidGestureHand(hand)) {

        return {

            gesture:
                GESTURES.NONE,

            fingers: {

                thumb: false,

                index: false,

                middle: false,

                ring: false,

                pinky: false
            },

            pinching: false,

            pointing: false,

            openHand: false,

            fist: false
        };
    }


    const fingers =
        getFingerStates(hand);


    return {

        gesture:
            detectSingleHandGesture(hand),

        fingers,

        pinching:
            isPinching(hand),

        pointing:
            isPointingGesture(hand),

        openHand:
            isOpenHandGesture(hand),

        fist:
            isFistGesture(hand)
    };
}


// ============================================
// GET GESTURE NAME
// ============================================

function getGestureName(gesture) {

    switch (gesture) {

        case GESTURES.NONE:

            return "None";


        case GESTURES.OPEN_HAND:

            return "Open Hand";


        case GESTURES.FIST:

            return "Fist";


        case GESTURES.POINTING:

            return "Pointing";


        case GESTURES.PINCH:

            return "Pinch";


        case GESTURES.TWO_HANDS:

            return "Two Hands";


        default:

            return "Unknown";
    }
}


// ============================================
// DEBUG HELPER
// ============================================

function getGestureDebugInfo(hand) {

    if (!isValidGestureHand(hand)) {

        return {

            valid: false,

            gesture: GESTURES.NONE,

            fingers: null
        };
    }

    const fingers =
        getFingerStates(hand);

    return {

        valid: true,

        gesture:
            detectSingleHandGesture(hand),

        fingers: fingers,

        distances: {

            index:
                gestureDistance(
                    hand[8],
                    hand[5]
                ),

            middle:
                gestureDistance(
                    hand[12],
                    hand[9]
                ),

            ring:
                gestureDistance(
                    hand[16],
                    hand[13]
                ),

            pinky:
                gestureDistance(
                    hand[20],
                    hand[17]
                )
        }
    };
}


// ============================================
// INITIALIZATION
// ============================================

console.log(
    "Gesture Detection module loaded successfully."
);