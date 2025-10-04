// Navigation functionality
class Navigation {
    constructor() {
        this.currentTool = 'home';
        this.drawer = document.getElementById('tools-drawer');
        this.mainContent = document.getElementById('main-content');
        this.toggleDrawerBtn = document.getElementById('toggle-drawer');
        this.toolItems = document.querySelectorAll('.tool-item');
        this.pageTitle = document.getElementById('page-title');
        this.toolContentContainer = document.getElementById('tool-content-container');
        this.homeContent = document.getElementById('home-content');
        
        this.init();
    }

    init() {
        this.bindEvents();
        // Home content is already visible by default
    }

    bindEvents() {
        // Drawer toggle
        this.toggleDrawerBtn.addEventListener('click', () => this.toggleDrawer());

        // Tool items in drawer
        this.toolItems.forEach(item => {
            item.addEventListener('click', () => {
                const toolName = item.dataset.tool;
                this.switchTool(toolName);
            });
        });
/*
        // Header navigation (keep existing functionality)
        document.getElementById('support-btn').addEventListener('click', () => {
            alert('Support: For assistance, please contact us at support@audiostudiopro.com');
        });

        document.getElementById('about-btn').addEventListener('click', () => {
            alert('About Audio Studio Pro: A comprehensive web-based audio toolkit for all your audio editing needs.');
        });

        document.getElementById('login-btn').addEventListener('click', () => {
            alert('Login functionality would be implemented here with a proper backend.');
        });
*/
        }

    toggleDrawer() {
        this.drawer.classList.toggle('open');
        this.mainContent.classList.toggle('with-drawer');
        
        const icon = this.toggleDrawerBtn.querySelector('i');
        if (this.drawer.classList.contains('open')) {
            icon.className = 'fas fa-times';
            this.toggleDrawerBtn.innerHTML = '<i class="fas fa-times"></i> Close Menu';
        } else {
            icon.className = 'fas fa-bars';
            this.toggleDrawerBtn.innerHTML = '<i class="fas fa-bars"></i> Tools Menu';
        }
    }

    switchTool(toolName) {
        // Update active tool in drawer
        this.toolItems.forEach(item => {
            if (item.dataset.tool === toolName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update page title
        const toolTitles = {
            'home': 'Audio Studio Pro',
            'recorder': 'Audio Recorder',
            'pitcher': 'Pitcher',
            'splitter': 'Audio Splitter',
            'key-bpm': 'Key & BPM Finder',
            'cutter': 'Audio Cutter',
            'joiner': 'Audio Joiner',
            'remover': 'Noise Remover'
        };
        
        this.pageTitle.textContent = toolTitles[toolName] || 'Audio Studio Pro';
        this.currentTool = toolName;
        
        // Load tool content
        this.loadToolContent(toolName);
        
        // Close drawer on mobile
        if (window.innerWidth <= 768) {
            this.drawer.classList.remove('open');
            this.mainContent.classList.remove('with-drawer');
            const icon = this.toggleDrawerBtn.querySelector('i');
            icon.className = 'fas fa-bars';
            this.toggleDrawerBtn.innerHTML = '<i class="fas fa-bars"></i> Tools Menu';
        }
    }

    loadToolContent(toolName) {
        if (toolName === 'home') {
            // Show tanpura/home content, hide tool content
            this.homeContent.classList.add('active');
            this.toolContentContainer.innerHTML = '';
            this.toolContentContainer.style.display = 'none';
            this.homeContent.style.display = 'block';
            return;
        }

        // Hide home content, show tool content
        this.homeContent.classList.remove('active');
        this.homeContent.style.display = 'none';
        this.toolContentContainer.style.display = 'block';
        
        // Load tool-specific content
        fetch(`${toolName}.html`)
            .then(response => response.text())
            .then(html => {
                this.toolContentContainer.innerHTML = html;
                
                // Initialize tool-specific functionality
                if (toolName === 'recorder') {
                    window.recorderTool.init();
                } else if (toolName === 'pitcher') {
                    window.pitcherTool.init();
                }
                // Add other tool initializations as needed
            })
            .catch(error => {
                console.error('Error loading tool:', error);
                this.toolContentContainer.innerHTML = '<p>Error loading tool. Please try again.</p>';
            });
    }
}