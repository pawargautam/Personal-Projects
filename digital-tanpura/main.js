// main.js with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize tools safely
        if (typeof RecorderTool !== 'undefined') {
            window.recorderTool = new RecorderTool();
        }
        
        if (typeof PitcherTool !== 'undefined') {
            window.pitcherTool = new PitcherTool();
        }
        
        // Initialize navigation
        if (typeof Navigation !== 'undefined') {
            window.navigation = new Navigation();
        }
        
        console.log('Audio Studio Pro initialized successfully');
    } catch (error) {
        console.error('Error initializing Audio Studio Pro:', error);
        
        // Show user-friendly error message
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div style="text-align: center; padding: 50px; color: var(--light);">
                    <h2>Audio Studio Pro</h2>
                    <p>There was an error initializing the application.</p>
                    <p>Please refresh the page or check your browser compatibility.</p>
                    <button onclick="location.reload()" class="btn" style="margin-top: 20px;">
                        Reload Application
                    </button>
                </div>
            `;
        }
    }
});