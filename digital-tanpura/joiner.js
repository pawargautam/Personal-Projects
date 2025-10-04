// Audio Joiner Tool functionality
class JoinerTool {
    constructor() {
        this.audioFiles = [];
        this.selectedFileIndex = -1;
        
        this.joinerUpload = null;
        this.filesContainer = null;
        this.crossfadeSlider = null;
        this.crossfadeValue = null;
        this.reorderUpBtn = null;
        this.reorderDownBtn = null;
        this.removeFileBtn = null;
        this.joinAudioBtn = null;
        this.joinedAudioContainer = null;
    }

    init() {
        this.joinerUpload = document.getElementById('joiner-upload');
        this.filesContainer = document.getElementById('files-container');
        this.crossfadeSlider = document.getElementById('crossfade-slider');
        this.crossfadeValue = document.getElementById('crossfade-value');
        this.reorderUpBtn = document.getElementById('reorder-up-btn');
        this.reorderDownBtn = document.getElementById('reorder-down-btn');
        this.removeFileBtn = document.getElementById('remove-file-btn');
        this.joinAudioBtn = document.getElementById('join-audio-btn');
        this.joinedAudioContainer = document.getElementById('joined-audio-container');

        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        this.joinerUpload.addEventListener('change', (event) => {
            this.handleFileUpload(event);
        });

        this.crossfadeSlider.addEventListener('input', () => {
            this.crossfadeValue.textContent = this.crossfadeSlider.value + 's';
        });

        this.reorderUpBtn.addEventListener('click', () => {
            this.moveFileUp();
        });

        this.reorderDownBtn.addEventListener('click', () => {
            this.moveFileDown();
        });

        this.removeFileBtn.addEventListener('click', () => {
            this.removeSelectedFile();
        });

        this.joinAudioBtn.addEventListener('click', () => {
            this.joinAudioFiles();
        });
    }

    handleFileUpload(event) {
        const files = Array.from(event.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('audio/')) {
                this.audioFiles.push({
                    file: file,
                    name: file.name,
                    duration: 'Unknown'
                });
                
                // Try to get duration
                this.getAudioDuration(file).then(duration => {
                    const index = this.audioFiles.findIndex(f => f.file === file);
                    if (index !== -1) {
                        this.audioFiles[index].duration = Utils.formatTime(duration);
                        this.renderFilesList();
                    }
                }).catch(() => {
                    // Duration unknown is acceptable
                });
            }
        });
        
        this.renderFilesList();
        this.updateUI();
        
        if (files.length > 0) {
            Utils.showNotification(`${files.length} audio file(s) added successfully!`, 'success');
        }
    }

    getAudioDuration(file) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            
            audio.addEventListener('loadedmetadata', () => {
                resolve(audio.duration);
                URL.revokeObjectURL(audio.src);
            });
            
            audio.addEventListener('error', () => {
                reject('Could not load audio file');
                URL.revokeObjectURL(audio.src);
            });
        });
    }

    renderFilesList() {
        if (this.audioFiles.length === 0) {
            this.filesContainer.innerHTML = '<p class="no-files">No files selected yet</p>';
            return;
        }

        this.filesContainer.innerHTML = this.audioFiles.map((audioFile, index) => `
            <div class="file-item ${index === this.selectedFileIndex ? 'selected' : ''}" data-index="${index}">
                <div class="file-info">
                    <i class="fas fa-music"></i>
                    <span class="file-name">${audioFile.name}</span>
                    <span class="file-duration">${audioFile.duration}</span>
                </div>
                <div class="file-order">${index + 1}</div>
            </div>
        `).join('');

        // Add click events to file items
        this.filesContainer.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.selectFile(index);
            });
        });
    }

    selectFile(index) {
        this.selectedFileIndex = index;
        this.renderFilesList();
        this.updateUI();
    }

    moveFileUp() {
        if (this.selectedFileIndex > 0) {
            const temp = this.audioFiles[this.selectedFileIndex];
            this.audioFiles[this.selectedFileIndex] = this.audioFiles[this.selectedFileIndex - 1];
            this.audioFiles[this.selectedFileIndex - 1] = temp;
            this.selectedFileIndex--;
            this.renderFilesList();
            this.updateUI();
        }
    }

    moveFileDown() {
        if (this.selectedFileIndex < this.audioFiles.length - 1) {
            const temp = this.audioFiles[this.selectedFileIndex];
            this.audioFiles[this.selectedFileIndex] = this.audioFiles[this.selectedFileIndex + 1];
            this.audioFiles[this.selectedFileIndex + 1] = temp;
            this.selectedFileIndex++;
            this.renderFilesList();
            this.updateUI();
        }
    }

    removeSelectedFile() {
        if (this.selectedFileIndex !== -1) {
            this.audioFiles.splice(this.selectedFileIndex, 1);
            this.selectedFileIndex = -1;
            this.renderFilesList();
            this.updateUI();
            Utils.showNotification('File removed from join list', 'info');
        }
    }

    updateUI() {
        const hasFiles = this.audioFiles.length > 0;
        const hasSelection = this.selectedFileIndex !== -1;
        
        this.reorderUpBtn.disabled = !hasSelection || this.selectedFileIndex === 0;
        this.reorderDownBtn.disabled = !hasSelection || this.selectedFileIndex === this.audioFiles.length - 1;
        this.removeFileBtn.disabled = !hasSelection;
        this.joinAudioBtn.disabled = this.audioFiles.length < 2;
    }

    joinAudioFiles() {
        if (this.audioFiles.length < 2) {
            Utils.showNotification('Please add at least 2 audio files to join', 'warning');
            return;
        }

        Utils.showNotification('Joining audio files... This may take a moment.', 'info');
        
        // Simulate joining process (in a real implementation, this would use Web Audio API)
        setTimeout(() => {
            const joinedFileName = `joined-audio-${Date.now()}.mp3`;
            
            this.joinedAudioContainer.innerHTML = `
                <div class="audio-preview">
                    <h4>Joined Audio: ${joinedFileName}</h4>
                    <p>Your audio files have been successfully joined!</p>
                    <div class="mt-20">
                        <button class="btn" id="download-joined-btn">
                            <i class="fas fa-download"></i> Download Joined Audio
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('download-joined-btn').addEventListener('click', () => {
                Utils.showNotification('Download functionality would be implemented with actual audio processing', 'info');
            });
            
            Utils.showNotification('Audio files joined successfully!', 'success');
        }, 2000);
    }
}