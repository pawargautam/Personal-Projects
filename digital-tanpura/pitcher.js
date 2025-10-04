// Pitcher Tool functionality
class PitcherTool {
    constructor() {
        this.pitchSlider = null;
        this.pitchValue = null;
        this.speedSlider = null;
        this.speedValue = null;
        this.applyPitchBtn = null;
        this.applySpeedBtn = null;
        this.audioUpload = null;
    }

    init() {
        this.pitchSlider = document.getElementById('pitch-slider');
        this.pitchValue = document.getElementById('pitch-value');
        this.speedSlider = document.getElementById('speed-slider');
        this.speedValue = document.getElementById('speed-value');
        this.applyPitchBtn = document.getElementById('apply-pitch-btn');
        this.applySpeedBtn = document.getElementById('apply-speed-btn');
        this.audioUpload = document.getElementById('audio-upload');

        this.bindEvents();
    }

    bindEvents() {
        this.pitchSlider.addEventListener('input', () => {
            this.pitchValue.textContent = this.pitchSlider.value;
        });

        this.speedSlider.addEventListener('input', () => {
            this.speedValue.textContent = this.speedSlider.value + '%';
        });

        this.applyPitchBtn.addEventListener('click', () => {
            const pitchValue = this.pitchSlider.value;
            Utils.showNotification(`Pitch adjustment of ${pitchValue} semitones applied!`, 'success');
        });

        this.applySpeedBtn.addEventListener('click', () => {
            const speedValue = this.speedSlider.value;
            Utils.showNotification(`Speed adjustment of ${speedValue}% applied!`, 'success');
        });

        this.audioUpload.addEventListener('change', (event) => {
            this.handleFileUpload(event);
        });
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            Utils.showNotification(`File "${file.name}" uploaded successfully!`, 'success');
            // Here you would typically process the audio file
        }
    }
}