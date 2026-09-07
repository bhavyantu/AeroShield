// ============================================
// REPULSOR EFFECT SYSTEM
// AeroShield AI
// ============================================

const repulsorState = {
    activeElements: new Set(),
    initialized: false,
    enabled: true
};


// ============================================
// INITIALIZE
// ============================================

function initializeRepulsor() {

    if (repulsorState.initialized) {
        return true;
    }

    repulsorState.initialized = true;

    console.log(
        "Repulsor system initialized."
    );

    return true;
}


// ============================================
// CREATE REPULSOR
// ============================================

function createRepulsor(shieldElement) {

    if (!shieldElement) {
        return null;
    }

    let repulsor =
        shieldElement.querySelector(
            ".repulsor-core"
        );

    if (repulsor) {
        return repulsor;
    }


    // ========================================
    // CORE
    // ========================================

    repulsor =
        document.createElement("div");

    repulsor.className =
        "repulsor-core hidden";


    // ========================================
    // INNER GLOW
    // ========================================

    const inner =
        document.createElement("div");

    inner.className =
        "repulsor-inner";


    // ========================================
    // OUTER RING
    // ========================================

    const ring =
        document.createElement("div");

    ring.className =
        "repulsor-ring";


    // ========================================
    // BUILD
    // ========================================

    repulsor.appendChild(
        inner
    );

    repulsor.appendChild(
        ring
    );

    shieldElement.appendChild(
        repulsor
    );


    return repulsor;
}


// ============================================
// SHOW REPULSOR
// ============================================

function showRepulsor(shieldElement) {

    if (
        !repulsorState.enabled ||
        !shieldElement
    ) {
        return;
    }

    const repulsor =
        createRepulsor(
            shieldElement
        );

    if (!repulsor) {
        return;
    }


    repulsor.classList.remove(
        "hidden"
    );

    repulsor.classList.add(
        "active"
    );

    repulsor.style.display =
        "block";


    repulsorState.activeElements.add(
        shieldElement
    );
}


// ============================================
// HIDE REPULSOR
// ============================================

function hideRepulsor(shieldElement) {

    if (!shieldElement) {
        return;
    }

    const repulsor =
        shieldElement.querySelector(
            ".repulsor-core"
        );

    if (repulsor) {

        repulsor.classList.remove(
            "active"
        );

        repulsor.classList.add(
            "hidden"
        );

        repulsor.style.display =
            "none";
    }


    repulsorState.activeElements.delete(
        shieldElement
    );
}


// ============================================
// UPDATE REPULSOR
// ============================================

function updateRepulsor(
    shieldElement,
    intensity = 1
) {

    if (!shieldElement) {
        return;
    }

    const repulsor =
        shieldElement.querySelector(
            ".repulsor-core"
        );

    if (!repulsor) {
        return;
    }


    const numericIntensity =
        Number(intensity);


    const safeIntensity =
        Number.isFinite(
            numericIntensity
        )
            ? Math.max(
                0.2,
                Math.min(
                    2,
                    numericIntensity
                )
            )
            : 1;


    repulsor.style.setProperty(
        "--repulsor-intensity",
        safeIntensity
    );
}


// ============================================
// PULSE REPULSOR
// ============================================

function pulseRepulsor(
    shieldElement
) {

    if (
        !repulsorState.enabled ||
        !shieldElement
    ) {
        return;
    }

    const repulsor =
        shieldElement.querySelector(
            ".repulsor-core"
        );

    if (!repulsor) {
        return;
    }


    repulsor.classList.remove(
        "pulse"
    );


    // Force animation restart

    void repulsor.offsetWidth;


    repulsor.classList.add(
        "pulse"
    );


    setTimeout(() => {

        if (repulsor) {

            repulsor.classList.remove(
                "pulse"
            );
        }

    }, 500);
}


// ============================================
// REPULSOR BURST
// ============================================

function repulsorBurst(
    shieldElement
) {

    if (
        !repulsorState.enabled ||
        !shieldElement
    ) {
        return;
    }

    const repulsor =
        shieldElement.querySelector(
            ".repulsor-core"
        );

    if (!repulsor) {
        return;
    }


    repulsor.classList.remove(
        "burst"
    );


    // Force animation restart

    void repulsor.offsetWidth;


    repulsor.classList.add(
        "burst"
    );


    setTimeout(() => {

        if (repulsor) {

            repulsor.classList.remove(
                "burst"
            );
        }

    }, 700);
}


// ============================================
// HIDE ALL REPULSORS
// ============================================

function hideAllRepulsors() {

    const elements =
        Array.from(
            repulsorState.activeElements
        );

    elements.forEach(
        shieldElement => {

            hideRepulsor(
                shieldElement
            );
        }
    );

    repulsorState.activeElements.clear();
}


// ============================================
// ENABLE
// ============================================

function enableRepulsor() {

    repulsorState.enabled =
        true;

    initializeRepulsor();

    return true;
}


// ============================================
// DISABLE
// ============================================

function disableRepulsor() {

    repulsorState.enabled =
        false;

    hideAllRepulsors();
}


// ============================================
// TOGGLE
// ============================================

function toggleRepulsor() {

    if (repulsorState.enabled) {

        disableRepulsor();

    } else {

        enableRepulsor();
    }

    return repulsorState.enabled;
}


// ============================================
// RESET
// ============================================

function resetRepulsor() {

    hideAllRepulsors();
}


// ============================================
// GET STATE
// ============================================

function getRepulsorState() {

    return {
        initialized:
            repulsorState.initialized,

        enabled:
            repulsorState.enabled,

        activeCount:
            repulsorState.activeElements.size
    };
}


// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeRepulsor();

    }
);


console.log(
    "Repulsor module loaded successfully."
);