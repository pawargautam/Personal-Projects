// Enhanced Tanpura Drone functionality for Indian Classical Music
class Tanpura {
    constructor() {
        this.isPlaying = false;
        this.audioContext = null;
        this.oscillators = [];
        this.gainNodes = [];
        this.baseNote = 'C';
        this.octave = 4;
        this.volume = 0.7;
        this.resonance = 1;
        this.currentTuning = 'standard';
        this.currentRaga = 'bhairav';
        this.jhalaEnabled = true;
        this.meendEnabled = false;
        this.isUserInSync = false;
        
        // UI Elements
        this.tanpuraToggle = null;
        this.toggleIcon = null;
        this.baseNoteSelect = null;
        this.octaveSelect = null;
        this.volumeSlider = null;
        this.resonanceSlider = null;
        this.currentNoteEl = null;
        this.currentFreqEl = null;
        this.statusDot = null;
        this.statusText = null;
        this.noteDisplay = null;
        this.visualizationBars = null;
        this.presetButtons = null;
        
        // New elements for Indian classical features
        this.ragaSelect = null;
        this.jhalaToggle = null;
        this.meendToggle = null;
        this.surTestBtn = null;
        this.surTestNote = null;
        this.surTestStatus = null;
        this.syncIndicator = null;
        
        // Audio analysis for sync detection
        this.analyser = null;
        this.microphone = null;
        this.isAnalyzing = false;
        this.syncCheckInterval = null;
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeElements());
        } else {
            this.initializeElements();
        }
    }

    initializeElements() {
        try {
            // Existing elements
            this.tanpuraToggle = document.getElementById('tanpura-toggle');
            this.toggleIcon = document.getElementById('toggle-icon');
            this.baseNoteSelect = document.getElementById('base-note');
            this.octaveSelect = document.getElementById('octave');
            this.volumeSlider = document.getElementById('volume');
            this.resonanceSlider = document.getElementById('resonance');
            this.currentNoteEl = document.getElementById('current-note');
            this.currentFreqEl = document.getElementById('current-freq');
            this.statusDot = document.getElementById('status-dot');
            this.statusText = document.getElementById('status-text');
            this.noteDisplay = document.getElementById('note-display');
            this.visualizationBars = document.getElementById('visualization-bars');
            this.presetButtons = document.querySelectorAll('.preset-btn');

            // Create new elements for Indian classical features
            this.createIndianClassicalUI();

            this.bindEvents();
            this.createVisualizationBars();
            this.updateDisplay();
            
            console.log('Enhanced Tanpura initialized successfully');
        } catch (error) {
            console.error('Error initializing tanpura:', error);
            this.showError('Failed to initialize tanpura controls');
        }
    }

    createIndianClassicalUI() {
        const advancedControls = document.querySelector('.advanced-controls');
        if (!advancedControls) return;

        const indianControlsHTML = `
            <div class="indian-classical-controls">
                <h4><i class="fas fa-star-of-david"></i> Indian Classical Settings</h4>
                
                <div class="control-group-tanpura">
                    <label for="raga-select" class="control-label-tanpura">Raga Preset</label>
                    <select id="raga-select" class="control-select">
                        <option value="bhairav">Bhairav (Sa Re Ga Ma Pa Dha Ni)</option>
                        <option value="yaman">Yaman (Sa Re Ga Ma# Pa Dha Ni)</option>
                        <option value="bhairavi">Bhairavi (Sa Re♭ Ga Ma Pa Dha♭ Ni♭)</option>
                        <option value="malkauns">Malkauns (Sa Ga Ma Dha Ni)</option>
                        <option value="todi">Todi (Sa Re♭ Ga Ma# Pa Dha Ni♭)</option>
                        <option value="custom">Custom Tuning</option>
                    </select>
                </div>

                <div class="control-group-tanpura">
                    <label class="control-label-tanpura">Special Effects</label>
                    <div class="effect-buttons">
                        <button class="effect-btn" id="jhala-toggle">
                            <i class="fas fa-wave-square"></i> Jhala
                        </button>
                        <button class="effect-btn" id="meend-toggle">
                            <i class="fas fa-sliders-h"></i> Meend
                        </button>
                    </div>
                </div>

                <div class="sur-test-section">
                    <h5><i class="fas fa-check-circle"></i> Sur Test (Swar Shuddhata Check)</h5>
                    <p>Play a note and check if it matches the Tanpura</p>
                    <div class="sur-test-controls">
                        <select id="sur-test-note" class="control-select">
                            <option value="Sa">Sa</option>
                            <option value="Re">Re</option>
                            <option value="Ga">Ga</option>
                            <option value="Ma">Ma</option>
                            <option value="Pa">Pa</option>
                            <option value="Dha">Dha</option>
                            <option value="Ni">Ni</option>
                        </select>
                        <button class="btn" id="sur-test-btn">Test Sur</button>
                    </div>
                    <div id="sur-test-status" class="sur-test-status">
                        <div class="sync-indicator">
                            <div class="sync-dot" id="sync-dot"></div>
                            <span id="sync-text">Ready for sync check</span>
                        </div>
                    </div>
                </div>

                <div class="practice-tips">
                    <h5><i class="fas fa-lightbulb"></i> Riyaz Tips</h5>
                    <ul>
                        <li>🎵 Start with Sa (base note) and practice holding it steady</li>
                        <li>🎵 Match each swar perfectly with Tanpura</li>
                        <li>🎵 Practice aaroh (ascending) and avroh (descending)</li>
                        <li>🎵 Focus on sur ki shuddhata (pitch accuracy)</li>
                        <li>🎵 Green waves mean you're in perfect sync! 🟢</li>
                    </ul>
                </div>
            </div>
        `;

        advancedControls.insertAdjacentHTML('beforeend', indianControlsHTML);

        // Initialize new elements
        this.ragaSelect = document.getElementById('raga-select');
        this.jhalaToggle = document.getElementById('jhala-toggle');
        this.meendToggle = document.getElementById('meend-toggle');
        this.surTestBtn = document.getElementById('sur-test-btn');
        this.surTestNote = document.getElementById('sur-test-note');
        this.surTestStatus = document.getElementById('sur-test-status');
        this.syncIndicator = document.getElementById('sync-dot');
        this.syncText = document.getElementById('sync-text');
    }

    bindEvents() {
        try {
            // Existing events
            this.tanpuraToggle.addEventListener('click', () => this.toggleDrone());
            
            if (this.baseNoteSelect) {
                this.baseNoteSelect.addEventListener('change', (e) => {
                    this.baseNote = e.target.value.split(' ')[0];
                    this.updateDisplay();
                    if (this.isPlaying) {
                        this.restartDrone();
                    }
                });
            }

            if (this.octaveSelect) {
                this.octaveSelect.addEventListener('change', (e) => {
                    this.octave = parseInt(e.target.value);
                    this.updateDisplay();
                    if (this.isPlaying) {
                        this.restartDrone();
                    }
                });
            }

            if (this.volumeSlider) {
                this.volumeSlider.addEventListener('input', (e) => {
                    this.volume = parseFloat(e.target.value);
                    this.updateVolume();
                });
            }

            if (this.resonanceSlider) {
                this.resonanceSlider.addEventListener('input', (e) => {
                    this.resonance = parseFloat(e.target.value);
                    if (this.isPlaying) {
                        this.updateResonance();
                    }
                });
            }

            // Preset buttons
            if (this.presetButtons) {
                this.presetButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const tuning = e.target.dataset.tuning;
                        this.setTuningPreset(tuning);
                        
                        this.presetButtons.forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                    });
                });
            }

            // New Indian classical events
            if (this.ragaSelect) {
                this.ragaSelect.addEventListener('change', (e) => {
                    this.currentRaga = e.target.value;
                    this.applyRagaPreset(this.currentRaga);
                    if (this.isPlaying) {
                        this.restartDrone();
                    }
                });
            }

            if (this.jhalaToggle) {
                this.jhalaToggle.addEventListener('click', () => {
                    this.jhalaEnabled = !this.jhalaEnabled;
                    this.jhalaToggle.classList.toggle('active', this.jhalaEnabled);
                    if (this.isPlaying) {
                        this.updateJhalaEffect();
                    }
                    this.showNotification(`Jhala effect ${this.jhalaEnabled ? 'enabled' : 'disabled'}`, 'info');
                });
            }

            if (this.meendToggle) {
                this.meendToggle.addEventListener('click', () => {
                    this.meendEnabled = !this.meendEnabled;
                    this.meendToggle.classList.toggle('active', this.meendEnabled);
                    this.showNotification(`Meend effect ${this.meendEnabled ? 'enabled' : 'disabled'}`, 'info');
                });
            }

            if (this.surTestBtn) {
                this.surTestBtn.addEventListener('click', () => {
                    this.startSurTest();
                });
            }

            this.animateVisualization();

        } catch (error) {
            console.error('Error binding events:', error);
            this.showError('Failed to set up tanpura controls');
        }
    }

    // Indian Classical Music Methods

    applyRagaPreset(raga) {
        const ragaTunings = {
            'bhairav': { baseNote: 'C', tuning: 'standard', description: 'Morning raga - pure notes' },
            'yaman': { baseNote: 'C', tuning: 'yaman', description: 'Evening raga with tivra Ma' },
            'bhairavi': { baseNote: 'C', tuning: 'bhairavi', description: 'Morning raga with komal Re, Dha, Ni' },
            'malkauns': { baseNote: 'C', tuning: 'standard', description: 'Midnight raga - pentatonic scale' },
            'todi': { baseNote: 'C', tuning: 'custom', description: 'Morning raga with unique note combinations' }
        };

        const preset = ragaTunings[raga];
        if (preset) {
            this.baseNote = preset.baseNote;
            this.currentTuning = preset.tuning;
            
            if (this.baseNoteSelect) {
                this.baseNoteSelect.value = this.baseNote;
            }
            
            this.updateDisplay();
            this.showNotification(`Raga ${raga} applied: ${preset.description}`, 'success');
        }
    }

    updateJhalaEffect() {
        if (this.jhalaEnabled && this.isPlaying) {
            this.oscillators.forEach((osc, index) => {
                if (osc.oscillator && osc.oscillator.detune) {
                    const baseDetune = (Math.random() - 0.5) * 20;
                    const jhalaRate = 0.5 + Math.random() * 1.5;
                    
                    osc.oscillator.detune.setValueAtTime(baseDetune, this.audioContext.currentTime);
                    
                    if (index === 0) {
                        const jhalaLFO = this.audioContext.createOscillator();
                        const jhalaGain = this.audioContext.createGain();
                        
                        jhalaLFO.frequency.setValueAtTime(jhalaRate, this.audioContext.currentTime);
                        jhalaGain.gain.setValueAtTime(5, this.audioContext.currentTime);
                        
                        jhalaLFO.connect(jhalaGain);
                        jhalaGain.connect(osc.oscillator.detune);
                        jhalaLFO.start();
                        
                        this.oscillators.push({ oscillator: jhalaLFO, gainNode: jhalaGain });
                    }
                }
            });
        }
    }

    async startSurTest() {
        if (!this.surTestNote || !this.surTestStatus) return;

        const selectedNote = this.surTestNote.value;
        const expectedFreq = this.getFrequencyForIndianNote(selectedNote);
        
        this.surTestStatus.innerHTML = `
            <div class="sur-test-info">
                <p><strong>Testing:</strong> ${selectedNote}</p>
                <p><strong>Expected Frequency:</strong> ${expectedFreq.toFixed(2)} Hz</p>
                <p>🎤 Sing or play ${selectedNote} and check if it matches the Tanpura</p>
            </div>
            <div class="sync-indicator">
                <div class="sync-dot" id="sync-dot"></div>
                <span id="sync-text">Listening for your voice...</span>
            </div>
        `;

        this.syncIndicator = document.getElementById('sync-dot');
        this.syncText = document.getElementById('sync-text');
        
        // Start microphone analysis for sync detection
        await this.startSyncDetection(expectedFreq);
    }

    async startSyncDetection(expectedFreq) {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: false
                } 
            });

            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;

            this.microphone.connect(this.analyser);

            this.isAnalyzing = true;
            this.startSyncCheck(expectedFreq);

            this.showNotification("Microphone activated. Start singing to check your sur!", "info");

        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.showError('Microphone access denied. Please allow microphone access for sync detection.');
        }
    }

    startSyncCheck(expectedFreq) {
        this.syncCheckInterval = setInterval(() => {
            if (!this.isAnalyzing) return;

            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            this.analyser.getByteFrequencyData(dataArray);

            // Find dominant frequency
            const dominantFreq = this.findDominantFrequency(dataArray);
            
            if (dominantFreq > 0) {
                const tolerance = 1.0; // Hz tolerance for being in sync
                const isInSync = Math.abs(dominantFreq - expectedFreq) <= tolerance;
                
                this.updateSyncUI(isInSync, dominantFreq, expectedFreq);
                this.updateVisualizationSync(isInSync);
            }
        }, 200);
    }

    findDominantFrequency(dataArray) {
        let maxVolume = 0;
        let dominantIndex = 0;

        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i] > maxVolume) {
                maxVolume = dataArray[i];
                dominantIndex = i;
            }
        }

        if (maxVolume < 50) return 0; // Too quiet

        const nyquist = this.audioContext.sampleRate / 2;
        return (dominantIndex * nyquist) / dataArray.length;
    }

    updateSyncUI(isInSync, currentFreq, expectedFreq) {
        if (!this.syncIndicator || !this.syncText) return;

        this.isUserInSync = isInSync;

        if (isInSync) {
            this.syncIndicator.style.backgroundColor = '#4CAF50';
            this.syncIndicator.style.animation = 'pulse 0.5s infinite';
            this.syncText.textContent = `Perfect! ${currentFreq.toFixed(1)} Hz (Expected: ${expectedFreq.toFixed(1)} Hz)`;
            this.syncText.style.color = '#4CAF50';
        } else {
            this.syncIndicator.style.backgroundColor = '#f44336';
            this.syncIndicator.style.animation = 'none';
            const diff = currentFreq - expectedFreq;
            const direction = diff > 0 ? 'higher' : 'lower';
            this.syncText.textContent = `Adjust: ${Math.abs(diff).toFixed(1)} Hz ${direction} (${currentFreq.toFixed(1)} Hz)`;
            this.syncText.style.color = '#f44336';
        }
    }

    updateVisualizationSync(isInSync) {
        if (!this.visualizationBars) return;

        const bars = this.visualizationBars.querySelectorAll('.visualization-bar');
        
        if (isInSync) {
            // Green gradient for perfect sync
            bars.forEach(bar => {
                bar.style.background = 'linear-gradient(to top, #4CAF50, #8BC34A)';
                bar.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
            });
        } else {
            // Normal color when not in sync
            bars.forEach(bar => {
                bar.style.background = 'linear-gradient(to top, var(--primary), var(--secondary))';
                bar.style.boxShadow = 'none';
            });
        }
    }

    stopSyncDetection() {
        this.isAnalyzing = false;
        if (this.syncCheckInterval) {
            clearInterval(this.syncCheckInterval);
            this.syncCheckInterval = null;
        }
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone = null;
        }
        if (this.analyser) {
            this.analyser.disconnect();
            this.analyser = null;
        }
    }

    getFrequencyForIndianNote(indianNote) {
        const noteMap = {
            'Sa': this.getFrequencyForNote(this.baseNote, this.octave),
            'Re': this.getFrequencyForNote(this.getNextNote(this.baseNote, 2), this.octave),
            'Ga': this.getFrequencyForNote(this.getNextNote(this.baseNote, 4), this.octave),
            'Ma': this.getFrequencyForNote(this.getNextNote(this.baseNote, 5), this.octave),
            'Pa': this.getFrequencyForNote(this.getNextNote(this.baseNote, 7), this.octave),
            'Dha': this.getFrequencyForNote(this.getNextNote(this.baseNote, 9), this.octave),
            'Ni': this.getFrequencyForNote(this.getNextNote(this.baseNote, 11), this.octave)
        };
        
        return noteMap[indianNote] || this.getFrequencyForNote(this.baseNote, this.octave);
    }

    getNextNote(startNote, semitones) {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const startIndex = notes.indexOf(startNote);
        const nextIndex = (startIndex + semitones) % 12;
        return notes[nextIndex];
    }

    // Core Tanpura Functionality
    createVisualizationBars() {
        if (!this.visualizationBars) return;
        
        this.visualizationBars.innerHTML = '';
        for (let i = 0; i < 12; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualization-bar';
            bar.style.height = '10px';
            this.visualizationBars.appendChild(bar);
        }
    }

    animateVisualization() {
        if (!this.visualizationBars) return;
        
        try {
            const bars = this.visualizationBars.querySelectorAll('.visualization-bar');
            if (bars.length === 0) return;

            if (!this.isPlaying) {
                bars.forEach((bar, index) => {
                    const height = 10 + Math.sin(Date.now() / 1000 + index) * 5;
                    bar.style.height = `${height}px`;
                });
            } else {
                bars.forEach((bar, index) => {
                    const baseHeight = this.isUserInSync ? 40 : 20;
                    const variation = this.isUserInSync ? 60 : 80;
                    const height = baseHeight + Math.random() * variation;
                    bar.style.height = `${height}px`;
                });
            }
            requestAnimationFrame(() => this.animateVisualization());
        } catch (error) {
            console.error('Visualization error:', error);
        }
    }

    getFrequencyForNote(note, octave) {
        const baseFrequencies = {
            'C': 16.35, 'C#': 17.32, 'D': 18.35, 'D#': 19.45,
            'E': 20.60, 'F': 21.83, 'F#': 23.12, 'G': 24.50,
            'G#': 25.96, 'A': 27.50, 'A#': 29.14, 'B': 30.87
        };
        
        const baseFreq = baseFrequencies[note];
        return baseFreq * Math.pow(2, octave);
    }

    getIndianNoteName(note) {
        const noteMap = {
            'C': 'Sa', 'C#': 'Re♭', 'D': 'Re', 'D#': 'Ga♭',
            'E': 'Ga', 'F': 'Ma', 'F#': 'Ma♯', 'G': 'Pa',
            'G#': 'Dha♭', 'A': 'Dha', 'A#': 'Ni♭', 'B': 'Ni'
        };
        return noteMap[note] || 'Sa';
    }

    setTuningPreset(tuning) {
        this.currentTuning = tuning;
        
        const presets = {
            'standard': { note: 'C', octave: 4 },
            'bhairavi': { note: 'C', octave: 4 },
            'yaman': { note: 'C', octave: 4 },
            'custom': { note: 'C', octave: 4 }
        };
        
        const preset = presets[tuning];
        if (preset) {
            this.baseNote = preset.note;
            this.octave = preset.octave;
            
            if (this.baseNoteSelect) {
                this.baseNoteSelect.value = this.baseNote;
            }
            if (this.octaveSelect) {
                this.octaveSelect.value = this.octave.toString();
            }
            
            this.updateDisplay();
            
            if (this.isPlaying) {
                this.restartDrone();
            }
        }
    }

    updateDisplay() {
        const frequency = this.getFrequencyForNote(this.baseNote, this.octave);
        const indianNote = this.getIndianNoteName(this.baseNote);
        
        if (this.currentNoteEl) {
            this.currentNoteEl.textContent = `${indianNote} (${this.baseNote}${this.octave})`;
        }
        if (this.currentFreqEl) {
            this.currentFreqEl.textContent = `${frequency.toFixed(2)} Hz`;
        }
    }

    updateVolume() {
        this.gainNodes.forEach(gainNode => {
            if (gainNode) {
                try {
                    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
                } catch (error) {
                    console.error('Error updating volume:', error);
                }
            }
        });
    }

    updateResonance() {
        console.log('Resonance updated to:', this.resonance);
    }

    createOscillator(frequency, volume, type = 'sine') {
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(volume * this.volume, this.audioContext.currentTime);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            return { oscillator, gainNode };
        } catch (error) {
            console.error('Error creating oscillator:', error);
            return null;
        }
    }

    async startDrone() {
        try {
            if (!window.AudioContext && !window.webkitAudioContext) {
                throw new Error('Web Audio API is not supported in this browser');
            }

            if (!this.audioContext || this.audioContext.state === 'closed') {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            this.stopDrone();

            const baseFreq = this.getFrequencyForNote(this.baseNote, this.octave);
            
            // Authentic Tanpura tuning: 4 strings - Sa (low), Sa (middle), Pa, Sa (high)
            const oscillatorConfigs = [
                this.createOscillator(baseFreq * 0.5, 0.3, 'sawtooth'),  // Mandra Sa (low)
                this.createOscillator(baseFreq, 0.5, 'sawtooth'),       // Madhya Sa (middle)
                this.createOscillator(baseFreq * 1.5, 0.4, 'sine'),     // Pa (fifth)
                this.createOscillator(baseFreq * 2, 0.3, 'sawtooth')    // Tara Sa (high)
            ];

            this.oscillators = oscillatorConfigs.filter(osc => osc !== null);
            
            if (this.oscillators.length === 0) {
                throw new Error('Failed to create audio oscillators');
            }

            // Apply Indian classical effects
            this.oscillators.forEach((osc, index) => {
                const naturalDetune = [-3, 2, -1, 4][index] || 0;
                osc.oscillator.detune.setValueAtTime(naturalDetune, this.audioContext.currentTime);
                
                // Add subtle amplitude modulation for natural sound
                const amLFO = this.audioContext.createOscillator();
                const amGain = this.audioContext.createGain();
                
                amLFO.frequency.setValueAtTime(0.1 + Math.random() * 0.2, this.audioContext.currentTime);
                amGain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
                
                amLFO.connect(amGain);
                amGain.connect(osc.gainNode.gain);
                amLFO.start();
                
                this.oscillators.push({ oscillator: amLFO, gainNode: amGain });
                
                osc.oscillator.start();
                this.gainNodes.push(osc.gainNode);
            });

            // Apply Jhala effect if enabled
            if (this.jhalaEnabled) {
                this.updateJhalaEffect();
            }
            
            this.isPlaying = true;
            this.updateUIForPlayingState(true);
            this.showNotification('Tanpura drone started - Perfect for riyaz!', 'success');
            
        } catch (error) {
            console.error('Error starting tanpura:', error);
            this.showError('Error starting tanpura: ' + error.message);
            this.stopDrone();
        }
    }

    stopDrone() {
        // Stop sync detection if active
        this.stopSyncDetection();
        
        // Stop all oscillators
        this.oscillators.forEach(osc => {
            if (osc && osc.oscillator) {
                try {
                    osc.oscillator.stop();
                    if (osc.oscillator.disconnect) osc.oscillator.disconnect();
                    if (osc.gainNode && osc.gainNode.disconnect) osc.gainNode.disconnect();
                } catch (e) {
                    console.log('Oscillator already stopped');
                }
            }
        });
        
        this.oscillators = [];
        this.gainNodes = [];
        this.isUserInSync = false;
        
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.suspend().catch(console.error);
        }
        
        this.isPlaying = false;
        this.updateUIForPlayingState(false);
        this.showNotification('Tanpura drone stopped', 'info');
    }

    updateUIForPlayingState(isPlaying) {
        if (!this.tanpuraToggle || !this.toggleIcon) return;

        if (isPlaying) {
            this.tanpuraToggle.classList.add('playing');
            this.toggleIcon.textContent = '■';
            if (this.statusDot) this.statusDot.classList.add('playing');
            if (this.statusText) this.statusText.textContent = 'Tanpura playing - Riyaz ready!';
            if (this.noteDisplay) this.noteDisplay.classList.add('playing');
        } else {
            this.tanpuraToggle.classList.remove('playing');
            this.toggleIcon.textContent = '▶';
            if (this.statusDot) this.statusDot.classList.remove('playing');
            if (this.statusText) this.statusText.textContent = 'Ready for riyaz';
            if (this.noteDisplay) this.noteDisplay.classList.remove('playing');
        }
    }

    restartDrone() {
        if (this.isPlaying) {
            this.stopDrone();
            setTimeout(() => this.startDrone(), 100);
        }
    }

    toggleDrone() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                if (this.isPlaying) {
                    this.stopDrone();
                } else {
                    this.startDrone();
                }
            });
        } else {
            if (this.isPlaying) {
                this.stopDrone();
            } else {
                this.startDrone();
            }
        }
    }

    showError(message) {
        if (typeof Utils !== 'undefined' && Utils.showNotification) {
            Utils.showNotification(message, 'error');
        } else {
            console.error(message);
            alert('Error: ' + message);
        }
    }

    showNotification(message, type = 'info') {
        try {
            if (typeof Utils !== 'undefined' && Utils.showNotification) {
                Utils.showNotification(message, type);
            } else {
                console.log(`${type}: ${message}`);
                if (type === 'error') {
                    alert(`Error: ${message}`);
                }
            }
        } catch (error) {
            console.log(`${type}: ${message}`);
        }
    }
}

// Add CSS for new Indian classical features
const indianClassicalCSS = `
.indian-classical-controls {
    margin-top: 20px;
    padding: 20px;
    background: rgba(43, 15, 26, 0.7);
    border-radius: 10px;
    border: 1px solid var(--medium);
}

.indian-classical-controls h4 {
    color: var(--primary);
    margin-bottom: 20px;
    text-align: center;
    font-size: 1.3em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.effect-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.effect-btn {
    background: var(--darker);
    color: var(--light);
    border: 1px solid var(--medium);
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9em;
    flex: 1;
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.effect-btn:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
}

.effect-btn.active {
    background: var(--primary);
    color: var(--darker);
    border-color: var(--primary);
}

.sur-test-section {
    margin-top: 20px;
    padding: 15px;
    background: rgba(43, 15, 26, 0.5);
    border-radius: 8px;
}

.sur-test-section h5 {
    color: var(--primary);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.sur-test-controls {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 15px;
    flex-wrap: wrap;
}

.sur-test-status {
    padding: 10px;
    background: var(--darker);
    border-radius: 5px;
    font-size: 0.9em;
}

.sur-test-info {
    color: var(--light);
    margin-bottom: 10px;
}

.sync-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: rgba(43, 15, 26, 0.7);
    border-radius: 5px;
    margin-top: 10px;
}

.sync-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #666;
    transition: all 0.3s ease;
}

@keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
}

.practice-tips {
    margin-top: 20px;
    padding: 15px;
    background: rgba(212, 175, 55, 0.1);
    border-radius: 8px;
    border-left: 3px solid var(--primary);
}

.practice-tips h5 {
    color: var(--primary);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.practice-tips ul {
    list-style: none;
    padding: 0;
}

.practice-tips li {
    color: var(--light);
    padding: 5px 0;
    font-size: 0.9em;
    line-height: 1.4;
}

/* Green sync visualization */
.visualization-bar.sync-perfect {
    background: linear-gradient(to top, #4CAF50, #8BC34A) !important;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5) !important;
}
`;

// Inject the CSS
const style = document.createElement('style');
style.textContent = indianClassicalCSS;
document.head.appendChild(style);

// Safe initialization
function initializeTanpura() {
    try {
        window.tanpura = new Tanpura();
    } catch (error) {
        console.error('Failed to initialize tanpura:', error);
        const errorElement = document.getElementById('tanpura-toggle');
        if (errorElement) {
            errorElement.textContent = 'Audio Not Supported';
            errorElement.style.backgroundColor = '#666';
            errorElement.disabled = true;
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTanpura);
} else {
    initializeTanpura();
}