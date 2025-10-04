// cutter.js
// Audio Cutter Tool functionality
class CutterTool {
    constructor() {
        this.audioBuffer = null;
        this.audioContext = null;
        this.audioSource = null;
        this.currentAudioUrl = null;
        
        this.cutterUpload = null;
        this.startTimeInput = null;
        this.endTimeInput = null;
        this.cutAudioBtn = null;
        this.audioPreview = null;
    }

    init() {
        this.cutterUpload = document.getElementById('cutter-upload');
        this.startTimeInput = document.getElementById('start-time');
        this.endTimeInput = document.getElementById('end-time');
        this.cutAudioBtn = document.getElementById('cut-audio-btn');
        this.audioPreview = document.getElementById('audio-preview');

        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        this.cutterUpload.addEventListener('change', (event) => {
            this.handleFileUpload(event);
        });

        this.startTimeInput.addEventListener('input', () => {
            this.validateTimes();
        });

        this.endTimeInput.addEventListener('input', () => {
            this.validateTimes();
        });

        this.cutAudioBtn.addEventListener('click', () => {
            this.cutAudio();
        });
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('audio/')) {
            Utils.showNotification('Please select an audio file', 'warning');
            return;
        }

        try {
            Utils.showNotification('Loading audio file...', 'info');
            
            // Create object URL for preview
            if (this.currentAudioUrl) {
                URL.revokeObjectURL(this.currentAudioUrl);
            }
            this.currentAudioUrl = URL.createObjectURL(file);
            this.audioPreview.src = this.currentAudioUrl;
            
            // Load audio for processing
            const arrayBuffer = await file.arrayBuffer();
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            // Set default end time to full duration
            const duration = this.audioBuffer.duration;
            this.endTimeInput.value = Math.floor(duration);
            
            Utils.showNotification(`Audio file "${file.name}" loaded successfully! Duration: ${Utils.formatTime(duration)}`, 'success');
            this.updateUI();
            
        } catch (error) {
            console.error('Error loading audio file:', error);
            Utils.showNotification('Error loading audio file. Please try another file.', 'error');
        }
    }

    validateTimes() {
        const startTime = parseFloat(this.startTimeInput.value) || 0;
        const endTime = parseFloat(this.endTimeInput.value) || 0;
        
        if (startTime < 0) {
            this.startTimeInput.value = 0;
        }
        
        if (endTime < 0) {
            this.endTimeInput.value = 0;
        }
        
        if (this.audioBuffer) {
            const duration = this.audioBuffer.duration;
            if (endTime > duration) {
                this.endTimeInput.value = Math.floor(duration);
            }
            
            if (startTime > endTime) {
                this.startTimeInput.value = Math.min(startTime, endTime);
            }
        }
        
        this.updateUI();
    }

    updateUI() {
        const hasAudio = this.audioBuffer !== null;
        const startTime = parseFloat(this.startTimeInput.value) || 0;
        const endTime = parseFloat(this.endTimeInput.value) || 0;
        const isValid = hasAudio && startTime >= 0 && endTime > 0 && startTime < endTime;
        
        this.cutAudioBtn.disabled = !isValid;
        
        if (hasAudio) {
            const duration = this.audioBuffer.duration;
            if (endTime > duration) {
                this.endTimeInput.value = Math.floor(duration);
            }
        }
    }

    async cutAudio() {
        if (!this.audioBuffer) {
            Utils.showNotification('Please upload an audio file first', 'warning');
            return;
        }

        const startTime = parseFloat(this.startTimeInput.value) || 0;
        const endTime = parseFloat(this.endTimeInput.value) || 0;
        const duration = this.audioBuffer.duration;

        if (startTime < 0 || endTime > duration || startTime >= endTime) {
            Utils.showNotification('Invalid time range. Please check start and end times.', 'warning');
            return;
        }

        try {
            Utils.showNotification('Cutting audio...', 'info');
            
            // Calculate the length of the segment in samples
            const startOffset = startTime;
            const endOffset = endTime;
            const segmentLength = endOffset - startOffset;
            
            // Create new audio buffer for the cut segment
            const sampleRate = this.audioBuffer.sampleRate;
            const newBuffer = this.audioContext.createBuffer(
                this.audioBuffer.numberOfChannels,
                segmentLength * sampleRate,
                sampleRate
            );
            
            // Copy the data for each channel
            for (let channel = 0; channel < this.audioBuffer.numberOfChannels; channel++) {
                const channelData = this.audioBuffer.getChannelData(channel);
                const newChannelData = newBuffer.getChannelData(channel);
                
                const startSample = Math.floor(startOffset * sampleRate);
                const endSample = Math.floor(endOffset * sampleRate);
                
                for (let i = startSample, j = 0; i < endSample && j < newChannelData.length; i++, j++) {
                    newChannelData[j] = channelData[i];
                }
            }
            
            // Convert the AudioBuffer to a WAV file
            const wavBlob = this.audioBufferToWav(newBuffer);
            const audioUrl = URL.createObjectURL(wavBlob);
            
            // Update the preview audio element
            this.audioPreview.src = audioUrl;
            
            // Create download link
            this.createDownloadLink(wavBlob, startTime, endTime);
            
            Utils.showNotification(`Audio successfully cut from ${Utils.formatTime(startTime)} to ${Utils.formatTime(endTime)}!`, 'success');
            
        } catch (error) {
            console.error('Error cutting audio:', error);
            Utils.showNotification('Error cutting audio. Please try again.', 'error');
        }
    }

    audioBufferToWav(buffer) {
        const numberOfChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const length = buffer.length;
        
        const interleaved = new Float32Array(length * numberOfChannels);
        
        for (let channel = 0; channel < numberOfChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                interleaved[i * numberOfChannels + channel] = channelData[i];
            }
        }
        
        return this.encodeWAV(interleaved, numberOfChannels, sampleRate);
    }

    encodeWAV(samples, numChannels, sampleRate) {
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);
        
        // WAV header
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + samples.length * 2, true);
        this.writeString(view, 8, 'WAVE');
        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * 2, true);
        view.setUint16(32, numChannels * 2, true);
        view.setUint16(34, 16, true);
        this.writeString(view, 36, 'data');
        view.setUint32(40, samples.length * 2, true);
        
        // Convert to 16-bit PCM
        let offset = 44;
        for (let i = 0; i < samples.length; i++) {
            const s = Math.max(-1, Math.min(1, samples[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            offset += 2;
        }
        
        return new Blob([buffer], { type: 'audio/wav' });
    }

    writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    createDownloadLink(blob, startTime, endTime) {
        // Remove existing download button
        const existingBtn = document.getElementById('download-cut-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        // Create new download button
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'download-cut-btn';
        downloadBtn.className = 'btn mt-20';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Cut Audio';
        
        downloadBtn.addEventListener('click', () => {
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            Utils.downloadFile(url, `cut-audio-${timestamp}.wav`);
            URL.revokeObjectURL(url);
        });
        
        // Insert after the cut button
        this.cutAudioBtn.parentNode.insertBefore(downloadBtn, this.cutAudioBtn.nextSibling);
    }

    destroy() {
        // Clean up
        if (this.currentAudioUrl) {
            URL.revokeObjectURL(this.currentAudioUrl);
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Initialize when the tool is loaded
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CutterTool;
}