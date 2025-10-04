// Recorder Tool functionality
class RecorderTool {
    constructor() {
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.audioContext = null;
        this.analyser = null;
        this.recordingStartTime = 0;
        this.durationInterval = null;
        
        this.recordBtn = null;
        this.stopBtn = null;
        this.playBtn = null;
        this.statusEl = null;
        this.durationEl = null;
        this.visualizationEl = null;
        this.recordingsContainer = null;
    }

    init() {
        this.recordBtn = document.getElementById('record-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.playBtn = document.getElementById('play-btn');
        this.statusEl = document.getElementById('status');
        this.durationEl = document.getElementById('duration');
        this.visualizationEl = document.getElementById('visualization');
        this.recordingsContainer = document.getElementById('recordings-container');

        this.bindEvents();
        this.initVisualization();
    }

    bindEvents() {
        this.recordBtn.addEventListener('click', () => this.startRecording());
        this.stopBtn.addEventListener('click', () => this.stopRecording());
        this.playBtn.addEventListener('click', () => this.playRecording());
    }

    initVisualization() {
        this.visualizationEl.innerHTML = '';
        
        for (let i = 0; i < 64; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualization-bar';
            bar.style.left = `${i * 5}px`;
            bar.style.height = '0px';
            this.visualizationEl.appendChild(bar);
        }
    }

    updateVisualization(dataArray) {
        const bars = this.visualizationEl.querySelectorAll('.visualization-bar');
        bars.forEach((bar, index) => {
            const dataIndex = Math.floor(index * (dataArray.length / 64));
            const value = dataArray[dataIndex] / 255;
            const height = value * 150;
            bar.style.height = `${height}px`;
        });
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            source.connect(this.analyser);
            
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            const update = () => {
                if (this.isRecording) {
                    requestAnimationFrame(update);
                    this.analyser.getByteFrequencyData(dataArray);
                    this.updateVisualization(dataArray);
                }
            };
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                this.addRecordingToList(audioUrl);
                
                stream.getTracks().forEach(track => track.stop());
                if (this.audioContext) {
                    this.audioContext.close();
                }
            };
            
            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordingStartTime = Date.now();
            
            this.recordBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.playBtn.disabled = true;
            this.statusEl.textContent = 'Recording...';
            
            this.startDurationTimer();
            update();
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.statusEl.textContent = 'Error: Could not access microphone';
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            this.recordBtn.disabled = false;
            this.stopBtn.disabled = true;
            this.playBtn.disabled = false;
            this.statusEl.textContent = 'Recording stopped';
            
            clearInterval(this.durationInterval);
        }
    }

    playRecording() {
        if (this.audioChunks.length > 0) {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
            
            this.statusEl.textContent = 'Playing recording...';
            
            audio.onended = () => {
                this.statusEl.textContent = 'Recording finished playing';
            };
        }
    }

    startDurationTimer() {
        this.recordingStartTime = Date.now();
        this.durationInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            this.durationEl.textContent = Utils.formatTime(elapsed);
        }, 1000);
    }

    addRecordingToList(audioUrl) {
        const recordingItem = document.createElement('div');
        recordingItem.className = 'recording-item';
        
        const timestamp = new Date().toLocaleTimeString();
        
        recordingItem.innerHTML = `
            <div>
                <strong>Recording</strong> - ${timestamp}
            </div>
            <div class="recording-actions">
                <button class="btn btn-secondary play-recording">
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn btn-secondary download-recording">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `;
        
        const playBtn = recordingItem.querySelector('.play-recording');
        const downloadBtn = recordingItem.querySelector('.download-recording');
        
        playBtn.addEventListener('click', () => {
            const audio = new Audio(audioUrl);
            audio.play();
        });
        
        downloadBtn.addEventListener('click', () => {
            Utils.downloadFile(audioUrl, `recording-${timestamp}.wav`);
        });
        
        this.recordingsContainer.appendChild(recordingItem);
    }
}