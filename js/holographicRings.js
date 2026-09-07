// ============================================
// HOLOGRAPHIC RINGS SYSTEM
// AeroShield AI
// ============================================

const holographicRingState = {
    shields: new Map(),
    enabled: true,
    initialized: false,
    animationFrame: null
};


// ============================================
// CREATE RING CONTAINER
// ============================================

function createRingContainer(shieldElement) {

    if (!shieldElement) {
        return null;
    }

    let container =
        shieldElement.querySelector(
            ".holographic-rings"
        );

    if (container) {
        return container;
    }

    container =
        document.createElement("div");

    container.className =
        "holographic-rings";

    container.style.position = "absolute";
    container.style.inset = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.overflow = "visible";

    shieldElement.appendChild(container);

    return container;
}


// ============================================
// CREATE SVG RINGS
// ============================================

function createHolographicRings(
    shieldElement
) {

    if (!shieldElement) {
        return null;
    }

    const container =
        createRingContainer(
            shieldElement
        );

    if (!container) {
        return null;
    }

    container.innerHTML = "";

    const svgNS =
        "http://www.w3.org/2000/svg";

    const svg =
        document.createElementNS(
            svgNS,
            "svg"
        );

    svg.setAttribute(
        "viewBox",
        "0 0 100 100"
    );

    svg.setAttribute(
        "preserveAspectRatio",
        "none"
    );

    svg.style.position = "absolute";
    svg.style.inset = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.overflow = "visible";

    // ========================================
    // OUTER RING
    // ========================================

    const outerRing =
        document.createElementNS(
            svgNS,
            "circle"
        );

    outerRing.setAttribute(
        "cx",
        "50"
    );

    outerRing.setAttribute(
        "cy",
        "50"
    );

    outerRing.setAttribute(
        "r",
        "46"
    );

    outerRing.classList.add(
        "holo-ring",
        "outer-ring"
    );


    // ========================================
    // SECOND RING
    // ========================================

    const secondRing =
        document.createElementNS(
            svgNS,
            "circle"
        );

    secondRing.setAttribute(
        "cx",
        "50"
    );

    secondRing.setAttribute(
        "cy",
        "50"
    );

    secondRing.setAttribute(
        "r",
        "40"
    );

    secondRing.classList.add(
        "holo-ring",
        "second-ring"
    );


    // ========================================
    // INNER RING
    // ========================================

    const innerRing =
        document.createElementNS(
            svgNS,
            "circle"
        );

    innerRing.setAttribute(
        "cx",
        "50"
    );

    innerRing.setAttribute(
        "cy",
        "50"
    );

    innerRing.setAttribute(
        "r",
        "31"
    );

    innerRing.classList.add(
        "holo-ring",
        "inner-ring"
    );


    // ========================================
    // CORE RING
    // ========================================

    const coreRing =
        document.createElementNS(
            svgNS,
            "circle"
        );

    coreRing.setAttribute(
        "cx",
        "50"
    );

    coreRing.setAttribute(
        "cy",
        "50"
    );

    coreRing.setAttribute(
        "r",
        "17"
    );

    coreRing.classList.add(
        "holo-ring",
        "core-ring"
    );


    svg.appendChild(
        outerRing
    );

    svg.appendChild(
        secondRing
    );

    svg.appendChild(
        innerRing
    );

    svg.appendChild(
        coreRing
    );


    // ========================================
    // SEGMENT RING
    // ========================================

    const segmentRing =
        document.createElementNS(
            svgNS,
            "circle"
        );

    segmentRing.setAttribute(
        "cx",
        "50"
    );

    segmentRing.setAttribute(
        "cy",
        "50"
    );

    segmentRing.setAttribute(
        "r",
        "43"
    );

    segmentRing.setAttribute(
        "stroke-dasharray",
        "4 3"
    );

    segmentRing.classList.add(
        "holo-ring",
        "segment-ring"
    );

    svg.appendChild(
        segmentRing
    );


    // ========================================
    // RADIAL LINES
    // ========================================

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const angle =
            i * 30;

        const line =
            document.createElementNS(
                svgNS,
                "line"
            );

        line.setAttribute(
            "x1",
            "50"
        );

        line.setAttribute(
            "y1",
            "5"
        );

        line.setAttribute(
            "x2",
            "50"
        );

        line.setAttribute(
            "y2",
            "12"
        );

        line.setAttribute(
            "transform",
            `rotate(${angle} 50 50)`
        );

        line.classList.add(
            "holo-radial-line"
        );

        svg.appendChild(
            line
        );
    }


    // ========================================
    // CENTER CORE
    // ========================================

    const core =
        document.createElementNS(
            svgNS,
            "circle"
        );

    core.setAttribute(
        "cx",
        "50"
    );

    core.setAttribute(
        "cy",
        "50"
    );

    core.setAttribute(
        "r",
        "7"
    );

    core.classList.add(
        "holo-core"
    );

    svg.appendChild(
        core
    );


    container.appendChild(
        svg
    );


    // ========================================
    // SAVE SYSTEM
    // ========================================

    holographicRingState.shields.set(
        shieldElement,
        {
            container,
            svg,
            outerRing,
            secondRing,
            innerRing,
            coreRing,
            segmentRing,
            core
        }
    );

    return container;
}


// ============================================
// SHOW RINGS
// ============================================

function showHolographicRings(
    shieldElement
) {

    if (
        !shieldElement ||
        !holographicRingState.enabled
    ) {
        return;
    }

    let system =
        holographicRingState.shields.get(
            shieldElement
        );

    if (!system) {

        createHolographicRings(
            shieldElement
        );

        system =
            holographicRingState.shields.get(
                shieldElement
            );
    }

    if (!system) {
        return;
    }

    system.container.style.display =
        "block";

    system.container.classList.add(
        "active"
    );

    system.container.classList.remove(
        "hidden"
    );

    shieldElement.classList.add(
        "holographic-active"
    );
}


// ============================================
// HIDE RINGS
// ============================================

function hideHolographicRings(
    shieldElement
) {

    if (!shieldElement) {
        return;
    }

    const system =
        holographicRingState.shields.get(
            shieldElement
        );

    if (!system) {
        return;
    }

    system.container.classList.remove(
        "active"
    );

    system.container.classList.add(
        "hidden"
    );

    system.container.style.display =
        "none";

    shieldElement.classList.remove(
        "holographic-active"
    );
}


// ============================================
// ANIMATE RINGS
// ============================================

function animateHolographicRings() {

    if (!holographicRingState.enabled) {

        holographicRingState.animationFrame =
            requestAnimationFrame(
                animateHolographicRings
            );

        return;
    }

    const time =
        performance.now();


    holographicRingState.shields.forEach(
        system => {

            if (
                !system.container ||
                system.container.style.display ===
                    "none"
            ) {
                return;
            }


            // ====================================
            // ROTATING OUTER RING
            // ====================================

            const rotation =
                (time * 0.025) % 360;

            system.outerRing.style.transform =
                `rotate(${rotation}deg)`;

            system.outerRing.style.transformOrigin =
                "50% 50%";


            // ====================================
            // SECOND RING
            // ====================================

            const reverseRotation =
                -(time * 0.018) % 360;

            system.secondRing.style.transform =
                `rotate(${reverseRotation}deg)`;

            system.secondRing.style.transformOrigin =
                "50% 50%";


            // ====================================
            // SEGMENT RING
            // ====================================

            const segmentRotation =
                (time * 0.045) % 360;

            system.segmentRing.style.transform =
                `rotate(${segmentRotation}deg)`;

            system.segmentRing.style.transformOrigin =
                "50% 50%";


            // ====================================
            // CORE PULSE
            // ====================================

            const pulse =
                0.85 +
                Math.sin(
                    time * 0.006
                ) * 0.15;

            system.core.style.opacity =
                pulse;

            system.core.style.transform =
                `scale(${pulse})`;

            system.core.style.transformOrigin =
                "50% 50%";
        }
    );


    holographicRingState.animationFrame =
        requestAnimationFrame(
            animateHolographicRings
        );
}


// ============================================
// START ANIMATION
// ============================================

function startHolographicRingAnimation() {

    if (
        holographicRingState.animationFrame
    ) {
        return;
    }

    holographicRingState.animationFrame =
        requestAnimationFrame(
            animateHolographicRings
        );
}


// ============================================
// STOP ANIMATION
// ============================================

function stopHolographicRingAnimation() {

    if (
        holographicRingState.animationFrame !==
        null
    ) {

        cancelAnimationFrame(
            holographicRingState.animationFrame
        );

        holographicRingState.animationFrame =
            null;
    }
}


// ============================================
// REMOVE RINGS
// ============================================

function removeHolographicRings(
    shieldElement
) {

    if (!shieldElement) {
        return;
    }

    const system =
        holographicRingState.shields.get(
            shieldElement
        );

    if (!system) {
        return;
    }

    if (system.container) {
        system.container.remove();
    }

    holographicRingState.shields.delete(
        shieldElement
    );
}


// ============================================
// REMOVE ALL RINGS
// ============================================

function removeAllHolographicRings() {

    holographicRingState.shields.forEach(
        (_, shieldElement) => {

            removeHolographicRings(
                shieldElement
            );

        }
    );

    holographicRingState.shields.clear();
}


// ============================================
// ENABLE
// ============================================

function enableHolographicRings() {

    holographicRingState.enabled =
        true;

    holographicRingState.shields.forEach(
        (_, shieldElement) => {

            showHolographicRings(
                shieldElement
            );

        }
    );

    console.log(
        "Holographic rings enabled."
    );
}


// ============================================
// DISABLE
// ============================================

function disableHolographicRings() {

    holographicRingState.enabled =
        false;

    holographicRingState.shields.forEach(
        (_, shieldElement) => {

            hideHolographicRings(
                shieldElement
            );

        }
    );

    console.log(
        "Holographic rings disabled."
    );
}


// ============================================
// TOGGLE
// ============================================

function toggleHolographicRings() {

    if (
        holographicRingState.enabled
    ) {

        disableHolographicRings();

    } else {

        enableHolographicRings();

    }

    return holographicRingState.enabled;
}


// ============================================
// INITIALIZE
// ============================================

function initializeHolographicRings() {

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


    if (leftShield) {

        createHolographicRings(
            leftShield
        );

        hideHolographicRings(
            leftShield
        );
    }


    if (rightShield) {

        createHolographicRings(
            rightShield
        );

        hideHolographicRings(
            rightShield
        );
    }


    if (bigShield) {

        createHolographicRings(
            bigShield
        );

        hideHolographicRings(
            bigShield
        );
    }


    startHolographicRingAnimation();

    holographicRingState.initialized =
        true;

    console.log(
        "Holographic Rings initialized."
    );
}


// ============================================
// PAGE LOAD
// ============================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeHolographicRings();

    }
);


console.log(
    "Holographic Rings module loaded successfully."
);