// Utility functions
const Utils = {
    // Format time in seconds to MM:SS
    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    },

    // Generate random ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Download file
    downloadFile: (url, filename) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },

    // Show notification
    showNotification: (message, type = 'info') => {
        // Simple notification implementation
        alert(`${type.toUpperCase()}: ${message}`);
    }
};