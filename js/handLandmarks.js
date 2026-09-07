// ============================================
// HAND LANDMARKS SYSTEM
// AeroShield AI
// ============================================

const HAND_LANDMARKS = {
    WRIST: 0,

    THUMB_CMC: 1,
    THUMB_MCP: 2,
    THUMB_IP: 3,
    THUMB_TIP: 4,

    INDEX_MCP: 5,
    INDEX_PIP: 6,
    INDEX_DIP: 7,
    INDEX_TIP: 8,

    MIDDLE_MCP: 9,
    MIDDLE_PIP: 10,
    MIDDLE_DIP: 11,
    MIDDLE_TIP: 12,

    RING_MCP: 13,
    RING_PIP: 14,
    RING_DIP: 15,
    RING_TIP: 16,

    PINKY_MCP: 17,
    PINKY_PIP: 18,
    PINKY_DIP: 19,
    PINKY_TIP: 20
};


// ============================================
// HAND STATE
// ============================================

const handLandmarkState = {
    hands: [],
    handedness: [],
    count: 0,
    timestamp: 0
};


// ============================================
// UPDATE HAND LANDMARKS
// ============================================

function updateHandLandmarks(results) {

    if (!results) {
        clearHandLandmarks();
        return;
    }

    if (
        Array.isArray(results.multiHandLandmarks)
    ) {

        handLandmarkState.hands =
            results.multiHandLandmarks;

    } else {

        handLandmarkState.hands = [];
    }


    if (
        Array.isArray(results.multiHandedness)
    ) {

        handLandmarkState.handedness =
            results.multiHandedness;

    } else {

        handLandmarkState.handedness = [];
    }


    handLandmarkState.count =
        handLandmarkState.hands.length;

    handLandmarkState.timestamp =
        Date.now();
}


// ============================================
// CLEAR HAND DATA
// ============================================

function clearHandLandmarks() {

    handLandmarkState.hands = [];

    handLandmarkState.handedness = [];

    handLandmarkState.count = 0;

    handLandmarkState.timestamp =
        Date.now();
}


// ============================================
// GET ALL HANDS
// ============================================

function getHandLandmarks() {

    return handLandmarkState.hands;
}


// ============================================
// GET HAND COUNT
// ============================================

function getHandCount() {

    return handLandmarkState.count;
}


// ============================================
// GET SINGLE HAND
// ============================================

function getHand(index) {

    if (
        index < 0 ||
        index >= handLandmarkState.hands.length
    ) {
        return null;
    }

    return handLandmarkState.hands[index];
}


// ============================================
// GET HANDEDNESS
// ============================================

function getHandedness(index) {

    if (
        index < 0 ||
        index >= handLandmarkState.handedness.length
    ) {
        return null;
    }

    return handLandmarkState.handedness[index];
}


// ============================================
// GET PALM CENTER
// ============================================

function getPalmCenter(hand) {

    if (!hand || hand.length < 21) {
        return null;
    }

    const palmPoints = [
        HAND_LANDMARKS.WRIST,
        HAND_LANDMARKS.INDEX_MCP,
        HAND_LANDMARKS.MIDDLE_MCP,
        HAND_LANDMARKS.RING_MCP,
        HAND_LANDMARKS.PINKY_MCP
    ];

    let x = 0;
    let y = 0;
    let z = 0;

    for (const index of palmPoints) {

        const point = hand[index];

        if (!point) {
            continue;
        }

        x += point.x;
        y += point.y;
        z += point.z || 0;
    }

    return {
        x: x / palmPoints.length,
        y: y / palmPoints.length,
        z: z / palmPoints.length
    };
}


// ============================================
// GET INDEX FINGER TIP
// ============================================

function getIndexTip(hand) {

    if (!hand || hand.length < 21) {
        return null;
    }

    return hand[
        HAND_LANDMARKS.INDEX_TIP
    ];
}


// ============================================
// GET THUMB TIP
// ============================================

function getThumbTip(hand) {

    if (!hand || hand.length < 21) {
        return null;
    }

    return hand[
        HAND_LANDMARKS.THUMB_TIP
    ];
}


// ============================================
// DISTANCE BETWEEN TWO LANDMARKS
// ============================================

function landmarkDistance(
    point1,
    point2
) {

    if (!point1 || !point2) {
        return 0;
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
// 2D DISTANCE
// ============================================

function landmarkDistance2D(
    point1,
    point2
) {

    if (!point1 || !point2) {
        return 0;
    }

    const dx =
        point2.x - point1.x;

    const dy =
        point2.y - point1.y;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


// ============================================
// GET CAMERA RECTANGLE
// ============================================

function getLandmarkCameraRect() {

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


// ============================================
// LANDMARK → SCREEN POSITION
// ============================================

function landmarkToScreen(
    landmark
) {

    if (!landmark) {
        return null;
    }

    const rect =
        getLandmarkCameraRect();


    /*
        The camera preview is mirrored
        using CSS scaleX(-1).

        Therefore X must also be mirrored.
    */

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


// ============================================
// PALM → SCREEN POSITION
// ============================================

function palmToScreen(hand) {

    const palm =
        getPalmCenter(hand);

    if (!palm) {
        return null;
    }

    return landmarkToScreen(palm);
}


// ============================================
// GET INDEX TIP SCREEN POSITION
// ============================================

function getIndexTipScreen(hand) {

    const tip =
        getIndexTip(hand);

    if (!tip) {
        return null;
    }

    return landmarkToScreen(tip);
}


// ============================================
// GET HAND CENTER
// ============================================

function getHandCenter(hand) {

    if (!hand || hand.length < 21) {
        return null;
    }

    let x = 0;
    let y = 0;
    let z = 0;

    for (const point of hand) {

        x += point.x;
        y += point.y;
        z += point.z || 0;
    }

    return {
        x: x / hand.length,
        y: y / hand.length,
        z: z / hand.length
    };
}


// ============================================
// GET HAND CENTER ON SCREEN
// ============================================

function getHandCenterScreen(hand) {

    const center =
        getHandCenter(hand);

    if (!center) {
        return null;
    }

    return landmarkToScreen(center);
}


// ============================================
// GET TWO-HAND CENTER
// ============================================

function getTwoHandCenter(
    hand1,
    hand2
) {

    const palm1 =
        getPalmCenter(hand1);

    const palm2 =
        getPalmCenter(hand2);

    if (!palm1 || !palm2) {
        return null;
    }

    return {
        x:
            (palm1.x + palm2.x) / 2,

        y:
            (palm1.y + palm2.y) / 2,

        z:
            (palm1.z + palm2.z) / 2
    };
}


// ============================================
// GET TWO-HAND CENTER ON SCREEN
// ============================================

function getTwoHandCenterScreen(
    hand1,
    hand2
) {

    const center =
        getTwoHandCenter(
            hand1,
            hand2
        );

    if (!center) {
        return null;
    }

    return landmarkToScreen(center);
}


// ============================================
// GET PALM DISTANCE
// ============================================

function getPalmDistance(
    hand1,
    hand2
) {

    const palm1 =
        getPalmCenter(hand1);

    const palm2 =
        getPalmCenter(hand2);

    if (!palm1 || !palm2) {
        return 0;
    }

    return landmarkDistance2D(
        palm1,
        palm2
    );
}


// ============================================
// GET PALM DISTANCE ON SCREEN
// ============================================

function getPalmDistanceOnScreen(
    hand1,
    hand2
) {

    const palm1 =
        palmToScreen(hand1);

    const palm2 =
        palmToScreen(hand2);

    if (!palm1 || !palm2) {
        return 0;
    }

    return landmarkDistance2D(
        palm1,
        palm2
    );
}


// ============================================
// CHECK VALID HAND
// ============================================

function isValidHand(hand) {

    return (
        Array.isArray(hand) &&
        hand.length >= 21
    );
}


// ============================================
// GET COMPLETE STATE
// ============================================

function getHandLandmarkState() {

    return {
        hands:
            handLandmarkState.hands,

        handedness:
            handLandmarkState.handedness,

        count:
            handLandmarkState.count,

        timestamp:
            handLandmarkState.timestamp
    };
}


// ============================================
// RESET ON CAMERA STOP
// ============================================

function resetHandLandmarks() {

    clearHandLandmarks();

    console.log(
        "Hand landmarks reset."
    );
}


// ============================================
// RESIZE HANDLING
// ============================================

window.addEventListener(
    "resize",
    () => {

        /*
            Screen coordinates are calculated
            dynamically, so no stored positions
            need to be updated here.
        */

    }
);


console.log(
    "Hand Landmarks module loaded successfully."
);