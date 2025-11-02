/**
 * Chatbot Module - Interactive AI assistant
 * Loads only when user clicks on chat or help features
 */

class ChatbotModule {
    constructor() {
        this.isInitialized = false;
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.chatHistory = [];

        // UI Elements
        this.chatButton = null;
        this.chatWindow = null;
        this.messageInput = null;
        this.sendButton = null;
        this.closeButton = null;

        console.log('💬 Chatbot module loaded');
    }

    /**
     * Initialize chatbot
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            await this.createChatInterface();
            this.loadChatHistory();
            this.setupEventListeners();

            this.isInitialized = true;
            console.log('✅ Chatbot initialized');

            // Emit initialization event
            window.dispatchEvent(new CustomEvent('chatbot:ready', {
                detail: { module: 'chatbot' }
            }));

        } catch (error) {
            console.error('❌ Failed to initialize chatbot:', error);
        }
    }

    /**
     * Create chat interface
     */
    async createChatInterface() {
        // Create chat button
        this.chatButton = document.createElement('button');
        this.chatButton.id = 'chatbot-button';
        this.chatButton.className = 'chatbot-button';
        this.chatButton.innerHTML = `
            <svg class="chat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span class="chat-badge">AI</span>
        `;
        this.chatButton.setAttribute('aria-label', 'Open AI Chat Assistant');

        // Create chat window
        this.chatWindow = document.createElement('div');
        this.chatWindow.id = 'chatbot-window';
        this.chatWindow.className = 'chatbot-window hidden';
        this.chatWindow.innerHTML = `
            <div class="chatbot-header">
                <h3>AI Career Assistant</h3>
                <button class="chatbot-close" aria-label="Close chat">×</button>
            </div>
            <div class="chatbot-messages">
                <div class="chat-message bot-message">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        <p>Hello! I'm your AI career assistant. I can help you with:</p>
                        <ul>
                            <li>Career path guidance</li>
                            <li>Skill development advice</li>
                            <li>Industry insights</li>
                            <li>Job search tips</li>
                        </ul>
                        <p>What would you like to know today?</p>
                    </div>
                </div>
            </div>
            <div class="chatbot-input">
                <textarea placeholder="Type your message..." rows="1"></textarea>
                <button class="send-button" aria-label="Send message">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
            <div class="chatbot-suggestions">
                <button class="suggestion-btn" data-suggestion="What careers are in high demand?">🔥 What careers are in high demand?</button>
                <button class="suggestion-btn" data-suggestion="How do I switch to tech?">💻 How do I switch to tech?</button>
                <button class="suggestion-btn" data-suggestion="Skills for software engineering">⚡ Skills for software engineering</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(this.chatButton);
        document.body.appendChild(this.chatWindow);

        // Cache elements
        this.messageInput = this.chatWindow.querySelector('textarea');
        this.sendButton = this.chatWindow.querySelector('.send-button');
        this.closeButton = this.chatWindow.querySelector('.chatbot-close');

        // Add CSS styles
        this.addChatStyles();
    }

    /**
     * Add chatbot CSS styles
     */
    addChatStyles() {
        const styleId = 'chatbot-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .chatbot-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
                z-index: 1000;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }

            .chatbot-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
            }

            .chat-badge {
                position: absolute;
                top: 0;
                right: 0;
                background: #ff4757;
                color: white;
                font-size: 10px;
                padding: 2px 4px;
                border-radius: 10px;
                font-weight: bold;
            }

            .chatbot-window {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 380px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                z-index: 1001;
                display: flex;
                flex-direction: column;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                border: 1px solid #e1e8ed;
            }

            .chatbot-window.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .chatbot-window.hidden {
                display: none;
            }

            .chatbot-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px 20px;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chatbot-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .chatbot-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s ease;
            }

            .chatbot-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #f8f9fa;
            }

            .chat-message {
                display: flex;
                margin-bottom: 16px;
                animation: messageSlide 0.3s ease;
            }

            @keyframes messageSlide {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                margin-right: 12px;
                flex-shrink: 0;
            }

            .bot-message .message-avatar {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }

            .user-message .message-avatar {
                background: #28a745;
            }

            .message-content {
                flex: 1;
                background: white;
                padding: 12px 16px;
                border-radius: 12px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }

            .user-message .message-content {
                background: #007bff;
                color: white;
            }

            .message-content p {
                margin: 0 0 8px 0;
            }

            .message-content p:last-child {
                margin-bottom: 0;
            }

            .message-content ul {
                margin: 8px 0;
                padding-left: 16px;
            }

            .message-content li {
                margin-bottom: 4px;
            }

            .chatbot-input {
                padding: 16px 20px;
                background: white;
                border-top: 1px solid #e1e8ed;
                display: flex;
                gap: 12px;
                align-items: flex-end;
            }

            .chatbot-input textarea {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 20px;
                padding: 10px 16px;
                font-size: 14px;
                resize: none;
                max-height: 100px;
                font-family: inherit;
            }

            .chatbot-input textarea:focus {
                outline: none;
                border-color: #667eea;
            }

            .send-button {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s ease;
            }

            .send-button:hover:not(:disabled) {
                transform: scale(1.05);
            }

            .send-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .chatbot-suggestions {
                padding: 12px 20px;
                background: #f8f9fa;
                border-top: 1px solid #e1e8ed;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .suggestion-btn {
                background: white;
                border: 1px solid #ddd;
                padding: 6px 12px;
                border-radius: 16px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
            }

            .suggestion-btn:hover {
                background: #667eea;
                color: white;
                border-color: #667eea;
            }

            .typing-indicator {
                display: flex;
                align-items: center;
                padding: 8px 12px;
                background: white;
                border-radius: 12px;
                margin-bottom: 8px;
            }

            .typing-indicator span {
                width: 8px;
                height: 8px;
                background: #667eea;
                border-radius: 50%;
                margin: 0 2px;
                animation: typing 1.4s infinite;
            }

            .typing-indicator span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-indicator span:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-10px);
                }
            }

            @media (max-width: 480px) {
                .chatbot-window {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                    height: 400px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Chat button click
        this.chatButton.addEventListener('click', () => this.openChat());

        // Close button click
        this.closeButton.addEventListener('click', () => this.closeChat());

        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());

        // Enter key to send message
        this.messageInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 100) + 'px';
        });

        // Suggestion buttons
        this.chatWindow.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const suggestion = btn.dataset.suggestion;
                this.messageInput.value = suggestion;
                this.sendMessage();
            });
        });

        // Click outside to close
        document.addEventListener('click', (event) => {
            if (this.isOpen &&
                !this.chatWindow.contains(event.target) &&
                !this.chatButton.contains(event.target)) {
                this.closeChat();
            }
        });

        // Track interactions
        this.trackChatEvents();
    }

    /**
     * Open chat window
     */
    openChat() {
        if (!this.isInitialized) {
            this.initialize();
        }

        this.isOpen = true;
        this.chatWindow.classList.remove('hidden');
        setTimeout(() => {
            this.chatWindow.classList.add('visible');
        }, 10);

        this.messageInput.focus();

        // Emit open event
        window.dispatchEvent(new CustomEvent('chatbot:opened', {
            detail: { module: 'chatbot' }
        }));
    }

    /**
     * Close chat window
     */
    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.remove('visible');

        setTimeout(() => {
            this.chatWindow.classList.add('hidden');
        }, 300);

        // Emit close event
        window.dispatchEvent(new CustomEvent('chatbot:closed', {
            detail: { module: 'chatbot' }
        }));
    }

    /**
     * Send message
     */
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';

        // Show typing indicator
        this.showTypingIndicator();

        // Generate bot response
        const response = await this.generateResponse(message);

        // Hide typing indicator
        this.hideTypingIndicator();

        // Add bot response
        this.addMessage(response, 'bot');

        // Save to history
        this.saveChatHistory();
    }

    /**
     * Add message to chat
     */
    addMessage(content, sender) {
        const messagesContainer = this.chatWindow.querySelector('.chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'bot' ? '🤖' : '👤';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        // Process markdown-like formatting
        messageContent.innerHTML = this.formatMessage(content);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Store message
        this.messages.push({
            content,
            sender,
            timestamp: Date.now()
        });
    }

    /**
     * Format message with basic markdown
     */
    formatMessage(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        this.isTyping = true;
        const messagesContainer = this.chatWindow.querySelector('.chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = this.chatWindow.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    /**
     * Generate AI response
     */
    async generateResponse(userMessage) {
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        const message = userMessage.toLowerCase();

        // Simple rule-based responses
        if (message.includes('career') || message.includes('job')) {
            return `Based on current market trends, here are some high-demand career paths:

**Technology Sector:**
• Software Development (15% growth projected)
• AI/Machine Learning Engineering (22% growth)
• Cybersecurity Analysis (35% growth)
• Data Science (31% growth)

**How to get started:**
1. Build foundational skills through online courses
2. Work on personal projects to demonstrate skills
3. Network with professionals in your target field
4. Consider internships or entry-level positions

Would you like specific guidance for any of these career paths?`;
        }

        if (message.includes('tech') || message.includes('switch')) {
            return `Switching to tech is absolutely achievable! Here's a roadmap:

**Step 1: Foundation Building (2-3 months)**
- Learn programming fundamentals (Python/JavaScript)
- Understand basic computer science concepts
- Complete online courses (Coursera, edX, freeCodeCamp)

**Step 2: Skill Development (3-6 months)**
- Choose your specialization (web dev, data, mobile, etc.)
- Build real projects for your portfolio
- Contribute to open source projects

**Step 3: Job Preparation (1-2 months)**
- Optimize your resume for tech roles
- Practice technical interviews
- Build professional network

**Key Success Factors:**
• Consistency over intensity
• Project-based learning
• Community engagement
• Continuous learning mindset

What area of tech interests you most?`;
        }

        if (message.includes('skill') || message.includes('learn')) {
            return `**Essential Skills for Software Engineering:**

**Technical Skills:**
- Programming: Python, JavaScript, Java, or C#
- Web: HTML, CSS, React/Vue/Angular
- Databases: SQL, NoSQL (MongoDB, PostgreSQL)
- Cloud: AWS, Azure, or Google Cloud
- Git & GitHub for version control

**Soft Skills:**
- Problem-solving and analytical thinking
- Communication and teamwork
- Adaptability and continuous learning
- Time management and project organization

**Learning Resources:**
- Interactive: freeCodeCamp, Codecademy
- Deep learning: Coursera, edX university courses
- Practice: LeetCode, HackerRank, Codewars
- Documentation: MDN Web Docs, official docs

**Time Investment:**
- Basic proficiency: 3-6 months
- Job-ready: 6-12 months
- Professional level: 1-2 years

Which skill area would you like to focus on first?`;
        }

        // Default response
        return `I'm here to help with your career questions! I can provide guidance on:

🎯 **Career Planning**
- Industry trends and outlook
- Skill requirements for different roles
- Career transition strategies

💡 **Skill Development**
- Learning paths for tech careers
- Recommended resources and courses
- Project ideas for portfolio building

📊 **Job Search**
- Resume and interview preparation
- Networking strategies
- Market insights and salary expectations

🚀 **Professional Growth**
- Advancement opportunities
- Industry specializations
- Work-life balance considerations

What specific area would you like to explore? Feel free to ask about any career-related topic!`;
    }

    /**
     * Load chat history
     */
    loadChatHistory() {
        try {
            const history = localStorage.getItem('chatbot_history');
            if (history) {
                this.chatHistory = JSON.parse(history);
                // Only load recent messages to prevent clutter
                const recentMessages = this.chatHistory.slice(-10);
                recentMessages.forEach(msg => {
                    if (msg.sender !== 'bot' || msg.content !== 'Hello! I\'m your AI career assistant...') {
                        this.addMessage(msg.content, msg.sender);
                    }
                });
            }
        } catch (error) {
            console.warn('Failed to load chat history:', error);
        }
    }

    /**
     * Save chat history
     */
    saveChatHistory() {
        try {
            // Keep only last 50 messages
            this.chatHistory = [...this.chatHistory, ...this.messages].slice(-50);
            localStorage.setItem('chatbot_history', JSON.stringify(this.chatHistory));
        } catch (error) {
            console.warn('Failed to save chat history:', error);
        }
    }

    /**
     * Track chat events for analytics
     */
    trackChatEvents() {
        // Track chat opens
        window.addEventListener('chatbot:opened', () => {
            if (window.analyticsModule) {
                window.analyticsModule.trackInteraction('chatOpen', this.chatButton);
            }
        });

        // Track message sends
        const originalSendMessage = this.sendMessage.bind(this);
        this.sendMessage = async () => {
            if (window.analyticsModule && this.messageInput.value.trim()) {
                window.analyticsModule.trackInteraction('chatMessage', this.messageInput, {
                    messageLength: this.messageInput.value.length
                });
            }
            return originalSendMessage();
        };
    }

    /**
     * Get chat statistics
     */
    getStats() {
        return {
            totalMessages: this.messages.length,
            isInitialized: this.isInitialized,
            isOpen: this.isOpen,
            historySize: this.chatHistory.length
        };
    }

    /**
     * Clear chat history
     */
    clearHistory() {
        this.messages = [];
        this.chatHistory = [];
        localStorage.removeItem('chatbot_history');

        // Clear messages from UI except welcome message
        const messagesContainer = this.chatWindow.querySelector('.chatbot-messages');
        messagesContainer.innerHTML = messagesContainer.querySelector('.chat-message.bot-message').outerHTML;

        console.log('🗑️ Chat history cleared');
    }

    /**
     * Destroy chatbot module
     */
    destroy() {
        // Remove UI elements
        if (this.chatButton) this.chatButton.remove();
        if (this.chatWindow) this.chatWindow.remove();

        // Remove styles
        const styles = document.getElementById('chatbot-styles');
        if (styles) styles.remove();

        // Clear data
        this.messages = [];
        this.chatHistory = [];

        this.isInitialized = false;
        this.isOpen = false;

        // Emit destroy event
        window.dispatchEvent(new CustomEvent('chatbot:destroyed', {
            detail: { module: 'chatbot' }
        }));

        console.log('💀 Chatbot module destroyed');
    }
}

// Create and export singleton instance
const chatbotModule = new ChatbotModule();

export default chatbotModule;