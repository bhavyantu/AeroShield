// ============================================
// SHIELD PARTICLE SYSTEM
// AeroShield AI
// ============================================

const shieldParticleState = {
    systems: new Map(),
    enabled: true,
    animationFrame: null
};


// ============================================
// CREATE PARTICLE CONTAINER
// ============================================

function createShieldParticleContainer(shieldElement) {

    if (!shieldElement) {
        return null;
    }

    let container =
        shieldElement.querySelector(
            ".shield-particles"
        );

    if (container) {
        return container;
    }

    container =
        document.createElement("div");

    container.className =
        "shield-particles";

    container.style.position = "absolute";
    container.style.left = "0";
    container.style.top = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.overflow = "visible";

    shieldElement.appendChild(container);

    return container;
}


// ============================================
// CREATE PARTICLES
// ============================================

function createShieldParticles(
    shieldElement,
    count = 35
) {

    if (!shieldElement) {
        return;
    }

    const container =
        createShieldParticleContainer(
            shieldElement
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const particles = [];

    for (let i = 0; i < count; i++) {

        const particle =
            document.createElement("span");

        particle.className =
            "shield-particle";

        const angle =
            Math.random() *
            Math.PI *
            2;

        const radius =
            35 +
            Math.random() * 60;

        const size =
            1 +
            Math.random() * 3;

        particle.style.position =
            "absolute";

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;

        particle.style.borderRadius =
            "50%";

        particle.style.background =
            "rgba(0, 246, 255, 0.9)";

        particle.style.boxShadow =
            "0 0 8px rgba(0, 246, 255, 0.9)";

        particle.style.left =
            "50%";

        particle.style.top =
            "50%";

        particle.style.pointerEvents =
            "none";

        const particleData = {
            element: particle,
            angle: angle,
            radius: radius,
            speed:
                0.002 +
                Math.random() * 0.006,
            opacity:
                0.3 +
                Math.random() * 0.7,
            size: size
        };

        particle.style.opacity =
            particleData.opacity;

        container.appendChild(
            particle
        );

        particles.push(
            particleData
        );
    }

    shieldParticleState.systems.set(
        shieldElement,
        particles
    );

    container.style.display =
        "block";
}


// ============================================
// SHOW PARTICLES
// ============================================

function showShieldParticles(
    shieldElement
) {

    if (!shieldElement) {
        return;
    }

    if (!shieldParticleState.enabled) {
        return;
    }

    let particles =
        shieldParticleState.systems.get(
            shieldElement
        );

    if (!particles) {

        createShieldParticles(
            shieldElement
        );

        particles =
            shieldParticleState.systems.get(
                shieldElement
            );
    }

    if (!particles) {
        return;
    }

    const container =
        shieldElement.querySelector(
            ".shield-particles"
        );

    if (container) {

        container.style.display =
            "block";

        container.classList.add(
            "active"
        );

        container.classList.remove(
            "hidden"
        );
    }
}


// ============================================
// HIDE PARTICLES
// ============================================

function hideShieldParticles(
    shieldElement
) {

    if (!shieldElement) {
        return;
    }

    const container =
        shieldElement.querySelector(
            ".shield-particles"
        );

    if (container) {

        container.classList.remove(
            "active"
        );

        container.classList.add(
            "hidden"
        );

        container.style.display =
            "none";
    }
}


// ============================================
// UPDATE PARTICLE ANIMATION
// ============================================

function updateShieldParticles() {

    if (!shieldParticleState.enabled) {
        return;
    }

    const currentTime =
        performance.now();

    shieldParticleState.systems.forEach(
        (particles, shieldElement) => {

            if (!shieldElement) {
                return;
            }

            const container =
                shieldElement.querySelector(
                    ".shield-particles"
                );

            if (
                !container ||
                container.style.display === "none"
            ) {
                return;
            }


            particles.forEach(
                particle => {

                    particle.angle +=
                        particle.speed *
                        16;

                    const x =
                        50 +
                        Math.cos(
                            particle.angle
                        ) *
                        particle.radius;

                    const y =
                        50 +
                        Math.sin(
                            particle.angle
                        ) *
                        particle.radius;

                    particle.element.style.left =
                        `${x}%`;

                    particle.element.style.top =
                        `${y}%`;


                    // Slight pulsing

                    const pulse =
                        0.65 +
                        Math.sin(
                            currentTime * 0.004 +
                            particle.angle
                        ) *
                        0.35;

                    particle.element.style.opacity =
                        particle.opacity *
                        pulse;
                }
            );
        }
    );


    shieldParticleState.animationFrame =
        requestAnimationFrame(
            updateShieldParticles
        );
}


// ============================================
// START PARTICLE ANIMATION
// ============================================

function startShieldParticleAnimation() {

    if (
        shieldParticleState.animationFrame
    ) {
        return;
    }

    shieldParticleState.animationFrame =
        requestAnimationFrame(
            updateShieldParticles
        );
}


// ============================================
// STOP PARTICLE ANIMATION
// ============================================

function stopShieldParticleAnimation() {

    if (
        shieldParticleState.animationFrame !==
        null
    ) {

        cancelAnimationFrame(
            shieldParticleState.animationFrame
        );

        shieldParticleState.animationFrame =
            null;
    }
}


// ============================================
// REMOVE PARTICLE SYSTEM
// ============================================

function removeShieldParticles(
    shieldElement
) {

    if (!shieldElement) {
        return;
    }

    const container =
        shieldElement.querySelector(
            ".shield-particles"
        );

    if (container) {
        container.remove();
    }

    shieldParticleState.systems.delete(
        shieldElement
    );
}


// ============================================
// REMOVE ALL PARTICLES
// ============================================

function removeAllShieldParticles() {

    shieldParticleState.systems.forEach(
        (_, shieldElement) => {

            removeShieldParticles(
                shieldElement
            );

        }
    );

    shieldParticleState.systems.clear();
}


// ============================================
// ENABLE PARTICLES
// ============================================

function enableShieldParticles() {

    shieldParticleState.enabled =
        true;

    shieldParticleState.systems.forEach(
        (_, shieldElement) => {

            showShieldParticles(
                shieldElement
            );

        }
    );

    startShieldParticleAnimation();

    console.log(
        "Shield particles enabled."
    );
}


// ============================================
// DISABLE PARTICLES
// ============================================

function disableShieldParticles() {

    shieldParticleState.enabled =
        false;

    shieldParticleState.systems.forEach(
        (_, shieldElement) => {

            hideShieldParticles(
                shieldElement
            );

        }
    );

    console.log(
        "Shield particles disabled."
    );
}


// ============================================
// TOGGLE PARTICLES
// ============================================

function toggleShieldParticles() {

    if (
        shieldParticleState.enabled
    ) {

        disableShieldParticles();

    } else {

        enableShieldParticles();

    }

    return shieldParticleState.enabled;
}


// ============================================
// INITIALIZE
// ============================================

function initializeShieldParticles() {

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

        createShieldParticles(
            leftShield,
            30
        );

        hideShieldParticles(
            leftShield
        );
    }


    if (rightShield) {

        createShieldParticles(
            rightShield,
            30
        );

        hideShieldParticles(
            rightShield
        );
    }


    if (bigShield) {

        createShieldParticles(
            bigShield,
            55
        );

        hideShieldParticles(
            bigShield
        );
    }


    startShieldParticleAnimation();

    console.log(
        "Shield particle system initialized."
    );
}


// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeShieldParticles();

    }
);


console.log(
    "Shield Particles module loaded successfully."
);