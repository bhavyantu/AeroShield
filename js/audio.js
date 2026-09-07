// ========================================
// AUDIO SYSTEM - AIRWRITE IRON MAN
// ========================================

const audioState = {
    initialized: false,
    enabled: true,
    volume: 0.35,
    context: null
};

// ========================================
// AUDIO FILES
// ========================================

const shieldActivateAudio = new Audio(
    "sounds/shield-activate.mp3"
);

const shieldDeactivateAudio = new Audio(
    "sounds/shield-deactivate.mp3"
);

const repulsorAudio = new Audio(
    "sounds/repulsor.mp3"
);

// Preload audio
shieldActivateAudio.preload = "auto";
shieldDeactivateAudio.preload = "auto";
repulsorAudio.preload = "auto";

// ========================================
// INITIALIZE AUDIO
// ========================================

function initializeAudio() {

    if (audioState.initialized) return;

    try {

        audioState.context =
            new (window.AudioContext || window.webkitAudioContext)();

        audioState.initialized = true;

        setAudioVolume(audioState.volume);

        console.log("Audio system initialized.");

    } catch (error) {

        console.error("Audio initialization failed:", error);

    }
}

// ========================================
// RESUME AUDIO CONTEXT
// ========================================

function resumeAudio() {

    if (!audioState.context) return;

    if (audioState.context.state === "suspended") {
        audioState.context.resume();
    }
}

// ========================================
// PLAY MP3
// ========================================

function playMP3(audio) {

    if (!audioState.enabled || !audio) return;

    try {

        resumeAudio();

        audio.pause();

        audio.currentTime = 0;

        audio.volume = audioState.volume;

        const playPromise = audio.play();

        if (playPromise !== undefined) {

            playPromise.catch(error => {
                console.log("Audio playback blocked:", error);
            });

        }

    } catch (error) {

        console.error("MP3 playback error:", error);

    }
}

// ========================================
// SHIELD ACTIVATION
// ========================================

function playShieldActivationSound() {

    playMP3(shieldActivateAudio);

}

// ========================================
// SHIELD DEACTIVATION
// ========================================

function playShieldDeactivationSound() {

    playMP3(shieldDeactivateAudio);

}

// ========================================
// BIG SHIELD
// ========================================

function playBigShieldSound() {

    playMP3(shieldActivateAudio);

}

// ========================================
// REPULSOR
// ========================================

function playRepulsorSound() {

    if (!audioState.enabled) return;

    // Don't restart if already playing
    if (!repulsorAudio.paused) return;

    try {

        resumeAudio();

        repulsorAudio.currentTime = 0;

        repulsorAudio.volume = audioState.volume;

        const playPromise = repulsorAudio.play();

        if (playPromise !== undefined) {

            playPromise.catch(error => {
                console.log("Repulsor audio blocked:", error);
            });

        }

    } catch (error) {

        console.error("Repulsor audio error:", error);

    }

}

// ========================================
// STOP REPULSOR
// ========================================

function stopRepulsorSound() {

    try {

        repulsorAudio.pause();

        repulsorAudio.currentTime = 0;

    } catch (error) {

        console.error("Repulsor stop error:", error);

    }

}

// ========================================
// WEB AUDIO TONE
// ========================================

function playTone(
    frequency = 440,
    duration = 0.15,
    type = "sine"
) {

    if (!audioState.enabled || !audioState.context) return;

    try {

        resumeAudio();

        const oscillator =
            audioState.context.createOscillator();

        const gain =
            audioState.context.createGain();

        oscillator.type = type;

        oscillator.frequency.setValueAtTime(
            frequency,
            audioState.context.currentTime
        );

        gain.gain.setValueAtTime(
            0.0001,
            audioState.context.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            audioState.volume,
            audioState.context.currentTime + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            audioState.context.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(audioState.context.destination);

        oscillator.start();

        oscillator.stop(
            audioState.context.currentTime + duration
        );

    } catch (error) {

        console.error("Tone playback error:", error);

    }

}

// ========================================
// DUAL TONE
// ========================================

function playDualTone(
    frequency1,
    frequency2,
    duration = 0.2
) {

    playTone(frequency1, duration, "sine");

    setTimeout(() => {
        playTone(frequency2, duration, "sine");
    }, duration * 500);

}

// ========================================
// AIR WRITING SOUND
// ========================================

function playAirWritingSound() {

    playTone(520, 0.08, "sine");

}

// ========================================
// CLICK SOUND
// ========================================

function playClickSound() {

    playTone(700, 0.08, "square");

}

// ========================================
// ERROR SOUND
// ========================================

function playErrorSound() {

    playDualTone(180, 120, 0.15);

}

// ========================================
// STARTUP SOUND
// ========================================

function playStartupSound() {

    playDualTone(400, 800, 0.2);

}

// ========================================
// HAND DETECTED SOUND
// ========================================

function playHandDetectedSound() {

    playTone(900, 0.08, "sine");

}

// ========================================
// VOLUME
// ========================================

function setAudioVolume(volume) {

    if (typeof volume !== "number") return;

    audioState.volume =
        Math.max(0, Math.min(1, volume));

    shieldActivateAudio.volume =
        audioState.volume;

    shieldDeactivateAudio.volume =
        audioState.volume;

    repulsorAudio.volume =
        audioState.volume;

}

// ========================================
// ENABLE / DISABLE AUDIO
// ========================================

function setAudioEnabled(enabled) {

    audioState.enabled = Boolean(enabled);

    if (!audioState.enabled) {

        shieldActivateAudio.pause();
        shieldDeactivateAudio.pause();
        repulsorAudio.pause();

    }

}

// ========================================
// GET AUDIO STATE
// ========================================

function getAudioState() {

    return {
        initialized: audioState.initialized,
        enabled: audioState.enabled,
        volume: audioState.volume
    };

}

// ========================================
// USER INTERACTION
// Browser audio permission
// ========================================

document.addEventListener("click", () => {

    if (!audioState.initialized) {
        initializeAudio();
    }

    resumeAudio();

}, { once: true });

document.addEventListener("keydown", () => {

    if (!audioState.initialized) {
        initializeAudio();
    }

    resumeAudio();

}, { once: true });


// ========================================
// INITIALIZE
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeAudio();

    console.log("Audio.js loaded successfully.");

});