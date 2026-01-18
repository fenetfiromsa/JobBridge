document.addEventListener("DOMContentLoaded", () => {
    // AUTHENTICATION SYSTEM 
    class Auth {
        static setUser(userData) {
            localStorage.setItem('currentUser', JSON.stringify(userData));
        }

        static getUser() {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        }

        static logout() {
            localStorage.removeItem('currentUser');
        }

        static isLoggedIn() {
            return this.getUser() !== null;
        }
    }

    //  CONNECTIONS SYSTEM
    class Connections {
        static getConnectedUsers(email) {
            const userConnections = localStorage.getItem(`connections_${email}`);
            return userConnections ? JSON.parse(userConnections) : [];
        }

        static saveConnectedUsers(email, users) {
            localStorage.setItem(`connections_${email}`, JSON.stringify(users));
        }

        static connectUser(currentUserEmail, userData) {
            const connectedUsers = this.getConnectedUsers(currentUserEmail);
            
            // Check if user is already connected
            const existingUser = connectedUsers.find(user => user.email === userData.email);
            if (!existingUser) {
                connectedUsers.push(userData);
                this.saveConnectedUsers(currentUserEmail, connectedUsers);
                return true;
            }
            return false;
        }

        static disconnectUser(currentUserEmail, targetUserEmail) {
            let connectedUsers = this.getConnectedUsers(currentUserEmail);
            const initialLength = connectedUsers.length;
            connectedUsers = connectedUsers.filter(user => user.email !== targetUserEmail);
            
            if (connectedUsers.length < initialLength) {
                this.saveConnectedUsers(currentUserEmail, connectedUsers);
                return true;
            }
            return false;
        }

        static isConnected(currentUserEmail, targetUserEmail) {
            const connectedUsers = this.getConnectedUsers(currentUserEmail);
            return connectedUsers.some(user => user.email === targetUserEmail);
        }
    }

    //  MESSAGES SYSTEM 
    class Messages {
        static getMessages(currentUserEmail, otherUserEmail) {
            const messages = localStorage.getItem(`messages_${currentUserEmail}_${otherUserEmail}`);
            return messages ? JSON.parse(messages) : [];
        }

        static saveMessage(currentUserEmail, otherUserEmail, senderEmail, text) {
            const messages = this.getMessages(currentUserEmail, otherUserEmail);
            messages.push({
                senderEmail,
                text,
                timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            });
            localStorage.setItem(`messages_${currentUserEmail}_${otherUserEmail}`, JSON.stringify(messages));
        }

        static getConversationList(currentUserEmail) {
            const connectedUsers = Connections.getConnectedUsers(currentUserEmail);
            return connectedUsers.map(user => ({
                name: user.name,
                email: user.email,
                title: user.title || 'Professional',
                location: user.location || '',
                lastMessage: this.getMessages(currentUserEmail, user.email).slice(-1)[0] || null
            }));
        }
    }

    //  JOB RECOMMENDATION SYSTEM 
    class SimpleJobRecommender {
        // Education keywords for matching
        static educationKeywords = {
            "Computer Science": ["software developer", "developer", "programmer", "engineer", "it support", "data analyst", "cybersecurity"],
            "Software Engineering": ["software", "developer", "engineer", "full stack", "backend", "frontend"],
            "Information Technology": ["it support", "system admin", "network", "help desk", "technical support"],
            "Data Science": ["data analyst", "data scientist", "analyst", "business intelligence"],
            "Business": ["business analyst", "project manager", "marketing", "sales", "account manager"],
            "Marketing": ["marketing", "digital marketing", "social media", "content writer", "seo"],
            "Design": ["ux designer", "ui designer", "graphic designer", "designer"]
        };

        // Get jobs that match user's education
        static getRecommendedJobs(userEducation) {
            if (!userEducation || userEducation.length === 0) {
                return []; // No recommendations if no education
            }

            const recommendedJobs = [];
            const allJobs = this.getAllJobs();
            
            // Extracts education fields from user's education text
            const userFields = this.extractEducationFields(userEducation);
            
            // Score each job based on education match
            allJobs.forEach(job => {
                let matchScore = 0;
                
                userFields.forEach(field => {
                    const keywords = this.educationKeywords[field] || [];
                    keywords.forEach(keyword => {
                        if (job.title.toLowerCase().includes(keyword) || 
                            job.skills.some(skill => skill.toLowerCase().includes(keyword))) {
                            matchScore += 2;
                        }
                    });
                });
                
                if (matchScore > 0) {
                    recommendedJobs.push({
                        ...job,
                        matchScore: matchScore,
                        isRecommended: true
                    });
                }
            });
            
            // Sort by match score (highest first) and return top 4
            return recommendedJobs
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, 4);
        }

        static extractEducationFields(educationText) {
            const fields = [];
            const text = educationText.toLowerCase();
            
            // Check for each education field
            Object.keys(this.educationKeywords).forEach(field => {
                if (text.includes(field.toLowerCase())) {
                    fields.push(field);
                }
            });
            
            return fields;
        }

        static getAllJobs() {
            return [
                {
                    title: "Frontend Developer",
                    company: "TechNova Solutions",
                    location: "Remote",
                    skills: ["HTML", "CSS", "JavaScript", "React"]
                },
                {
                    title: "Data Analyst",
                    company: "InsightAnalytics",
                    location: "New York, USA",
                    skills: ["SQL", "Python", "Excel", "Power BI"]
                },
                {
                    title: "IT Support Technician",
                    company: "CloudNet Systems",
                    location: "Toronto, Canada",
                    skills: ["Troubleshooting", "Networking", "Customer Support"]
                },
                {
                    title: "Backend Developer",
                    company: "DevCore Labs",
                    location: "London, UK",
                    skills: ["Node.js", "Express", "MongoDB"]
                },
                {
                    title: "UX Designer",
                    company: "Creative Minds",
                    location: "Berlin, Germany",
                    skills: ["Figma", "Adobe XD", "Prototyping"]
                },
                {
                    title: "Mobile App Developer",
                    company: "AppWorks",
                    location: "San Francisco, USA",
                    skills: ["React Native", "Flutter"]
                },
                {
                    title: "Full Stack Developer",
                    company: "TechFusion",
                    location: "Remote",
                    skills: ["JavaScript", "Node.js", "React", "SQL"]
                },
                {
                    title: "Project Manager",
                    company: "AgileWorks",
                    location: "Sydney, Australia",
                    skills: ["Agile", "Scrum", "Leadership"]
                },
                {
                    title: "SEO Specialist",
                    company: "MarketBoost",
                    location: "New York, USA",
                    skills: ["SEO", "Google Analytics", "Content Strategy"]
                },
                {
                    title: "Cloud Engineer",
                    company: "CloudNet Systems",
                    location: "Toronto, Canada",
                    skills: ["AWS", "Azure", "Docker"]
                },
                {
                    title: "Content Writer",
                    company: "WordSmith Media",
                    location: "Remote",
                    skills: ["Copywriting", "SEO", "Editing"]
                },
                {
                    title: "Graphic Designer",
                    company: "PixelWorks",
                    location: "Berlin, Germany",
                    skills: ["Adobe Photoshop", "Illustrator", "Branding"]
                },
                {
                    title: "Cybersecurity Analyst",
                    company: "SecureTech",
                    location: "London, UK",
                    skills: ["Network Security", "Penetration Testing"]
                },
                {
                    title: "AI Engineer",
                    company: "NeuralNet Labs",
                    location: "Remote",
                    skills: ["Python", "Machine Learning", "TensorFlow"]
                },
                {
                    title: "Marketing Specialist",
                    company: "BrandWave",
                    location: "New York, USA",
                    skills: ["Marketing Strategy", "Social Media", "Analytics"]
                }
            ];
        }

        // Display recommendations on jobs page
        static showJobRecommendations() {
            if (!window.location.pathname.includes('jobs.html')) return;
            
            const currentUser = Auth.getUser();
            const jobListingsContainer = document.querySelector('.job-listings');
            
            if (!jobListingsContainer) return;
            
        
            jobListingsContainer.innerHTML = '';
            
            // If user is not logged in, show all jobs normally
            if (!currentUser) {
                this.showAllJobs();
                return;
            }
            
            // Get user's education
            const userEducation = currentUser.education ? 
                currentUser.education.join(' ') : 
                (currentUser.about || '');
            
            // Get recommended jobs
            const recommendedJobs = this.getRecommendedJobs(userEducation);
            const allJobs = this.getAllJobs();
            
            // Show recommended jobs first 
            if (recommendedJobs.length > 0) {
                const recommendationsSection = document.createElement('div');
                recommendationsSection.className = 'recommendations-section';
                
                recommendationsSection.innerHTML = `
                    <div class="recommendations-header">
                        <h2>🎯 Recommended For You</h2>
                        <p class="recommendation-subtitle">Based on your education profile</p>
                    </div>
                    <div class="recommended-jobs">
                        ${recommendedJobs.map(job => `
                            <div class="job-card recommended">
                                <div class="recommendation-badge">Recommended</div>
                                <h3>${job.title}</h3>
                                <p><strong>Company:</strong> ${job.company}</p>
                                <p><strong>Location:</strong> ${job.location}</p>
                                <p><strong>Skills:</strong> ${job.skills.join(', ')}</p>
                                <a href="applications.html" class="details-link">Apply Now</a>
                            </div>
                        `).join('')}
                    </div>
                `;
                
                jobListingsContainer.appendChild(recommendationsSection);
            }
            
            // Show all other jobs
            const regularJobsSection = document.createElement('div');
            regularJobsSection.className = 'all-jobs-section';
            
            // Filter out already recommended jobs
            const regularJobs = allJobs.filter(job => 
                !recommendedJobs.some(recJob => recJob.title === job.title)
            );
            
            regularJobsSection.innerHTML = `
                <h2>All Job Opportunities</h2>
                <div class="regular-jobs">
                    ${regularJobs.map(job => `
                        <div class="job-card">
                            <h3>${job.title}</h3>
                            <p><strong>Company:</strong> ${job.company}</p>
                            <p><strong>Location:</strong> ${job.location}</p>
                            <p><strong>Skills:</strong> ${job.skills.join(', ')}</p>
                            <a href="applications.html" class="details-link">View Details</a>
                        </div>
                    `).join('')}
                </div>
            `;
            
            jobListingsContainer.appendChild(regularJobsSection);
        }

        static showAllJobs() {
            const jobListingsContainer = document.querySelector('.job-listings');
            if (!jobListingsContainer) return;
            
            const allJobs = this.getAllJobs();
            
            jobListingsContainer.innerHTML = `
                <h2>All Job Listings</h2>
                <div class="regular-jobs">
                    ${allJobs.map(job => `
                        <div class="job-card">
                            <h3>${job.title}</h3>
                            <p><strong>Company:</strong> ${job.company}</p>
                            <p><strong>Location:</strong> ${job.location}</p>
                            <p><strong>Skills:</strong> ${job.skills.join(', ')}</p>
                            <a href="applications.html" class="details-link">View Details</a>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // NAVIGATION UPDATE 
    function updateNavigation() {
        const navLinks = document.querySelector(".nav-links");
        if (!navLinks) return;

        const isLoggedIn = Auth.isLoggedIn();
        const user = Auth.getUser();

        // Find all auth-related buttons and list items
        const loginButtons = navLinks.querySelectorAll('a[href="login.html"]');
        const signupButtons = navLinks.querySelectorAll('a[href="signup.html"]');
        
        // Find existing logout button
        const existingLogoutBtn = navLinks.querySelector('#logoutBtn');
        
        if (isLoggedIn && user) {
            // User is logged in - hide login/signup buttons
            loginButtons.forEach(link => {
                const button = link.closest('button');
                const li = link.closest('li');
                if (button) button.style.display = 'none';
                if (li) li.style.display = 'none';
            });
            
            signupButtons.forEach(link => {
                const button = link.closest('button');
                const li = link.closest('li');
                if (button) button.style.display = 'none';
                if (li) li.style.display = 'none';
            });
            
            // Add logout button if it doesn't exist
            if (!existingLogoutBtn) {
                const logoutLi = document.createElement('li');
                logoutLi.style.listStyle = 'none';
                logoutLi.style.display = 'flex';
                logoutLi.style.alignItems = 'center';
                logoutLi.innerHTML = `
                    <button id="logoutBtn" style="background: linear-gradient(to right, #ef4444, #dc2626); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Logout (${user.name.split(' ')[0]})
                    </button>
                `;
                navLinks.appendChild(logoutLi);
                
                logoutLi.querySelector('#logoutBtn').addEventListener('click', function(e) {
                    e.preventDefault();
                    Auth.logout();
                    window.location.href = 'index.html';
                });
            }
        } else {
            // User is not logged in - show login/signup buttons
            loginButtons.forEach(link => {
                const button = link.closest('button');
                const li = link.closest('li');
                if (button) button.style.display = 'inline-block';
                if (li) li.style.display = 'flex';
            });
            
            signupButtons.forEach(link => {
                const button = link.closest('button');
                const li = link.closest('li');
                if (button) button.style.display = 'inline-block';
                if (li) li.style.display = 'flex';
            });
            
            // Ensure button text is visible
            document.querySelectorAll('button a').forEach(link => {
                link.style.color = 'white';
                link.style.textDecoration = 'none';
                link.style.display = 'block';
                link.style.width = '100%';
                link.style.height = '100%';
                link.style.display = 'flex';
                link.style.alignItems = 'center';
                link.style.justifyContent = 'center';
            });
            
            // Remove logout button if exists
            if (existingLogoutBtn) {
                existingLogoutBtn.closest('li').remove();
            }
        }
    }

    //  NETWORK PAGE 
    function updateNetworkPage() {
        if (!window.location.pathname.includes('network.html')) return;
        
        // Check login first
        if (!Auth.isLoggedIn()) {
            alert("Please login to view network");
            window.location.href = "login.html";
            return;
        }
        
        const currentUser = Auth.getUser();
        const connectedContainer = document.getElementById('connected-users');
        const suggestedContainer = document.getElementById('suggested-users');
        
        // Update connected users section
        if (connectedContainer) {
            const connectedUsers = Connections.getConnectedUsers(currentUser.email);
            
            if (connectedUsers.length === 0) {
                connectedContainer.innerHTML = '<div class="empty-state"><p>No connections yet. Connect with people below!</p></div>';
            } else {
                connectedContainer.innerHTML = connectedUsers.map(user => `
                    <div class="connection-card connected">
                        <div class="connection-header">
                            <div class="connection-avatar">${user.name.split(' ').map(n => n[0]).join('')}</div>
                            <div class="connection-info">
                                <h3>${user.name}</h3>
                                <p class="connection-title">${user.title || 'Professional'}</p>
                            </div>
                        </div>
                        <p class="connection-location">📍 ${user.location || 'Not specified'}</p>
                        <p class="connection-bio">${user.bio || 'Ready to connect!'}</p>
                        <button class="disconnect-btn" data-email="${user.email}">Disconnect</button>
                    </div>
                `).join('');
                
                // Add disconnect event listeners
                document.querySelectorAll('.disconnect-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const userEmail = this.dataset.email;
                        const userName = this.closest('.connection-card').querySelector('h3').textContent;
                        
                        if (confirm(`Are you sure you want to disconnect from ${userName}?`)) {
                            if (Connections.disconnectUser(currentUser.email, userEmail)) {
                                showToast(`Disconnected from ${userName}`);
                                setTimeout(() => {
                                    window.location.reload();
                                }, 500);
                            }
                        }
                    });
                });
            }
        }
        
        // Define suggested users data
        const allSuggestedUsers = [
            {
                name: "Sarah Johnson",
                email: "sarah@example.com",
                title: "Frontend Developer",
                location: "Austin, USA",
                bio: "Specializes in React and modern web applications"
            },
            {
                name: "Michael Brown",
                email: "michael@example.com",
                title: "Data Analyst",
                location: "Toronto, Canada",
                bio: "Expert in data visualization and business intelligence"
            },
            {
                name: "Anna Williams",
                email: "anna@example.com",
                title: "UI/UX Designer",
                location: "Berlin, Germany",
                bio: "Focused on creating intuitive user experiences"
            },
            {
                name: "David Lee",
                email: "david@example.com",
                title: "Backend Developer",
                location: "Seoul, South Korea",
                bio: "Specialized in Node.js and microservices architecture"
            },
            {
                name: "Emily Clark",
                email: "emily@example.com",
                title: "Product Manager",
                location: "London, UK",
                bio: "Experienced in agile project management and strategy"
            },
            {
                name: "James Rodriguez",
                email: "james@example.com",
                title: "Fullstack Developer",
                location: "Mexico City, Mexico",
                bio: "Passionate about full-stack JavaScript development"
            }
        ];
        
        if (suggestedContainer) {
            // Filter out current user and already connected users
            const connectedUsers = Connections.getConnectedUsers(currentUser.email);
            const connectedEmails = connectedUsers.map(u => u.email);
            const suggestedUsers = allSuggestedUsers.filter(user => 
                user.email !== currentUser.email && !connectedEmails.includes(user.email)
            );
            
            if (suggestedUsers.length === 0) {
                suggestedContainer.innerHTML = '<div class="empty-state"><p>No more suggestions at the moment. Great networking!</p></div>';
            } else {
                suggestedContainer.innerHTML = suggestedUsers.map(user => {
                    const isConnected = Connections.isConnected(currentUser.email, user.email);
                    
                    return `
                        <div class="connection-card" data-email="${user.email}">
                            <div class="connection-header">
                                <div class="connection-avatar">${user.name.split(' ').map(n => n[0]).join('')}</div>
                                <div class="connection-info">
                                    <h3>${user.name}</h3>
                                    <p class="connection-title">${user.title}</p>
                                </div>
                            </div>
                            <p class="connection-location">📍 ${user.location}</p>
                            <p class="connection-bio">${user.bio}</p>
                            <button class="connect-btn" data-email="${user.email}" ${isConnected ? 'disabled' : ''}>
                                ${isConnected ? 'Connected ✓' : 'Connect'}
                            </button>
                        </div>
                    `;
                }).join('');
                
                // Add connect event listeners to non-disabled buttons
                document.querySelectorAll('.connect-btn:not(:disabled)').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const userEmail = this.dataset.email;
                        
                        // Find user data
                        const userData = suggestedUsers.find(u => u.email === userEmail);
                        
                        if (userData && Connections.connectUser(currentUser.email, userData)) {
                            // Update button state
                            this.textContent = 'Connected ✓';
                            this.disabled = true;
                            this.style.opacity = '0.7';
                            
                            // Create initial welcome message
                            Messages.saveMessage(currentUser.email, userEmail, currentUser.email, "Hello! Thanks for connecting.");
                            
                            // save from other user's perspective
                            Messages.saveMessage(userEmail, currentUser.email, currentUser.email, "Hello! Thanks for connecting.");
                            
                            // Show success message
                            showToast(`Connected with ${userData.name}!`);
                            
                            // Refresh page after a short delay
                            setTimeout(() => {
                                window.location.reload();
                            }, 500);
                        }
                    });
                });
            }
        }
    }

    //  MESSAGES PAGE 
    function updateMessagesPage() {
        if (!window.location.pathname.includes('messages.html')) return;
        
        // Check login first
        if (!Auth.isLoggedIn()) {
            alert("Please login to view messages");
            window.location.href = "login.html";
            return;
        }
        
        const currentUser = Auth.getUser();
        const chatList = document.getElementById('chat-list-users');
        const chatTitle = document.getElementById('chat-title');
        const chatMessages = document.getElementById('chat-messages');
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');
        const connectionCount = document.getElementById('connection-count');
        
        // Update connection count
        const connectedUsers = Connections.getConnectedUsers(currentUser.email);
        if (connectionCount) {
            connectionCount.textContent = `${connectedUsers.length} ${connectedUsers.length === 1 ? 'connection' : 'connections'}`;
        }
        
        // Update chat list
        if (chatList) {
            if (connectedUsers.length === 0) {
                chatList.innerHTML = `
                    <li class="no-chats">
                        <div class="empty-chat-state">
                            <p>No connections yet</p>
                            <p class="small-text">Connect with people in the Network page to start chatting</p>
                            <a href="network.html" class="cta-btn-small">Go to Network</a>
                        </div>
                    </li>
                `;
            } else {
                chatList.innerHTML = connectedUsers.map(user => {
                    const messages = Messages.getMessages(currentUser.email, user.email);
                    const lastMessage = messages.slice(-1)[0];
                    
                    return `
                        <li class="chat-user" data-email="${user.email}">
                            <div class="chat-user-avatar">${user.name.split(' ').map(n => n[0]).join('')}</div>
                            <div class="chat-user-details">
                                <strong>${user.name}</strong>
                                <p class="last-message">${lastMessage ? `${lastMessage.senderEmail === currentUser.email ? 'You' : user.name.split(' ')[0]}: ${lastMessage.text}` : 'No messages yet'}</p>
                            </div>
                            ${lastMessage ? `<span class="message-time">${lastMessage.timestamp}</span>` : ''}
                        </li>
                    `;
                }).join('');
                
                // Add click event listeners to chat users
                document.querySelectorAll('.chat-user').forEach(item => {
                    item.addEventListener('click', function() {
                        const userEmail = this.dataset.email;
                        window.currentChatUser = connectedUsers.find(u => u.email === userEmail);
                        
                        // Update UI
                        document.querySelectorAll('.chat-user').forEach(li => li.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Load messages
                        loadMessages(userEmail);
                        
                        // Enable input
                        if (messageInput) {
                            messageInput.disabled = false;
                            messageInput.placeholder = `Message ${window.currentChatUser.name.split(' ')[0]}...`;
                        }
                        if (sendBtn) sendBtn.disabled = false;
                        
                        // Update title
                        if (chatTitle) chatTitle.textContent = window.currentChatUser.name;
                        
                        // Focus input
                        setTimeout(() => {
                            if (messageInput) messageInput.focus();
                        }, 100);
                    });
                });
                
                // Auto-select first user if none selected
                if (!window.currentChatUser && connectedUsers.length > 0) {
                    const firstUser = document.querySelector('.chat-user');
                    if (firstUser) firstUser.click();
                }
            }
        }
        
        window.currentChatUser = null;
        
        function loadMessages(otherUserEmail) {
            if (!chatMessages) return;
            
            const messages = Messages.getMessages(currentUser.email, otherUserEmail);
            chatMessages.innerHTML = '';
            
            if (messages.length === 0) {
                chatMessages.innerHTML = `
                    <div class="no-messages">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                `;
            } else {
                messages.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `message ${msg.senderEmail === currentUser.email ? 'sent' : 'received'}`;
                    messageDiv.innerHTML = `
                        <div class="message-content">
                            <div class="message-text">${msg.text}</div>
                            <div class="message-time">${msg.timestamp}</div>
                        </div>
                    `;
                    chatMessages.appendChild(messageDiv);
                });
                
                // Scroll to bottom
                setTimeout(() => {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 100);
            }
        }
        
        function sendMessage() {
            if (!window.currentChatUser || !messageInput || messageInput.value.trim() === '') return;
            
            const text = messageInput.value.trim();
            
            // Save message from current user's perspective
            Messages.saveMessage(currentUser.email, window.currentChatUser.email, currentUser.email, text);
            
            // Also save from other user's perspective
            Messages.saveMessage(window.currentChatUser.email, currentUser.email, currentUser.email, text);
            
            // Clear input
            messageInput.value = '';
            
            // Reload messages
            loadMessages(window.currentChatUser.email);
            
            // Update last message in chat list
            updateLastMessageInList(window.currentChatUser.email, text, true);
            
            // Auto-reply after 1 second 
            setTimeout(() => {
                const replies = [
                    "Thanks for your message!",
                    "I'll get back to you soon.",
                    "That's interesting!",
                    "Great to hear from you!"
                ];
                const reply = replies[Math.floor(Math.random() * replies.length)];
                
                // Save auto-reply from other user's perspective to current user
                Messages.saveMessage(currentUser.email, window.currentChatUser.email, window.currentChatUser.email, reply);
                
                // Save auto-reply from other user's perspective to themselves
                Messages.saveMessage(window.currentChatUser.email, currentUser.email, window.currentChatUser.email, reply);
                
                loadMessages(window.currentChatUser.email);
                updateLastMessageInList(window.currentChatUser.email, reply, false);
            }, 1000);
        }
        
        function updateLastMessageInList(userEmail, text, isFromCurrentUser = true) {
            const chatUser = document.querySelector(`.chat-user[data-email="${userEmail}"]`);
            if (chatUser) {
                const lastMessage = chatUser.querySelector('.last-message');
                if (lastMessage) {
                    const displayName = isFromCurrentUser ? 'You' : window.currentChatUser.name.split(' ')[0];
                    lastMessage.textContent = `${displayName}: ${text}`;
                }
                
                // Update timestamp
                const messageTime = chatUser.querySelector('.message-time');
                if (messageTime) {
                    messageTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                }
            }
        }
        
        // Initialize message sending
        if (sendBtn && messageInput) {
            sendBtn.addEventListener('click', sendMessage);
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') sendMessage();
            });
        }
    }

    //  HELPER FUNCTIONS 
    function showToast(message, type = 'success') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Style the toast
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
        toast.style.color = 'white';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '6px';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        toast.style.zIndex = '9999';
        toast.style.fontWeight = '500';
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    //  BASIC FUNCTIONALITY 
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // Initialize demo users
    function initializeDemoUsers() {
        if (!localStorage.getItem('demoUsersInitialized')) {
            const demoUsers = {
                'user@example.com': {
                    password: 'password123',
                    name: 'John Doe',
                    email: 'user@example.com',
                    location: 'New York, USA',
                    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
                    experience: ['Frontend Developer – TechCorp (2023-Present)'],
                    education: ['Computer Science – University of Tech'],
                    about: 'Passionate frontend developer.',
                    profileImage: '../assets/default-profile.jpg',
                    phone: '+1 234 567 8900',
                    linkedin: 'https://linkedin.com/in/johndoe',
                    portfolio: 'https://johndoe.dev'
                },
                'fenet@example.com': {
                    password: 'password123',
                    name: 'Fenet Firomsa',
                    email: 'fenet@example.com',
                    location: 'Ethiopia, Addis Ababa',
                    skills: ['HTML', 'CSS', 'JavaScript'],
                    experience: ['Frontend Developer – TechNova Solutions'],
                    education: ['Software Engineering – AASTU'],
                    about: 'I am a passionate Frontend Developer.',
                    profileImage: '../assets/women2.jpg',
                    phone: '+1 647 555 1290',
                    linkedin: 'https://linkedin.com/in/fenetfiromsa',
                    portfolio: 'https://fenetfiromsa.dev'
                },
                // Pre-defined suggested users
                'sarah@example.com': {
                    password: 'password123',
                    name: 'Sarah Johnson',
                    email: 'sarah@example.com',
                    title: 'Frontend Developer',
                    location: 'Austin, USA',
                    bio: 'Specializes in React and modern web applications',
                    profileImage: '../assets/default-profile.jpg'
                },
                'michael@example.com': {
                    password: 'password123',
                    name: 'Michael Brown',
                    email: 'michael@example.com',
                    title: 'Data Analyst',
                    location: 'Toronto, Canada',
                    bio: 'Expert in data visualization and business intelligence',
                    profileImage: '../assets/default-profile.jpg'
                },
                'anna@example.com': {
                    password: 'password123',
                    name: 'Anna Williams',
                    email: 'anna@example.com',
                    title: 'UI/UX Designer',
                    location: 'Berlin, Germany',
                    bio: 'Focused on creating intuitive user experiences',
                    profileImage: '../assets/default-profile.jpg'
                }
            };
            
            localStorage.setItem('demoUsers', JSON.stringify(demoUsers));
            localStorage.setItem('demoUsersInitialized', 'true');
        }
    }

    // Job search filter
    const searchForm = document.querySelector(".search-form");
    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const keyword = searchForm.querySelector("input[type='text']").value.toLowerCase();
            const jobs = document.querySelectorAll(".job-card");
            jobs.forEach(job => {
                const text = job.innerText.toLowerCase();
                job.style.display = text.includes(keyword) ? "block" : "none";
            });
        });
    }

    // Login validation
    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = loginForm.querySelector("input[type='email']").value;
            const password = loginForm.querySelector("input[type='password']").value;

            initializeDemoUsers();
            const demoUsers = JSON.parse(localStorage.getItem('demoUsers')) || {};

            if (demoUsers[email] && demoUsers[email].password === password) {
                const userData = { ...demoUsers[email] };
                delete userData.password;
                Auth.setUser(userData);
                showToast(`Welcome back, ${userData.name}!`);
                setTimeout(() => {
                    window.location.href = "profile.html";
                }, 500);
            } else {
                alert("Invalid credentials. Try:\nEmail: user@example.com\nPassword: password123\n\nOr:\nEmail: fenet@example.com\nPassword: password123");
            }
        });
    }

    // Signup validation
    const signupForm = document.querySelector(".signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nameInput = signupForm.querySelector("input[type='text']");
            const emailInput = signupForm.querySelector("input[type='email']");
            const passwordInput = signupForm.querySelector("input[type='password']");

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!name || !email || !password) {
                alert("Please fill in all fields");
                return;
            }

            if (password.length < 6) {
                alert("Password must be at least 6 characters");
                return;
            }

            initializeDemoUsers();
            const demoUsers = JSON.parse(localStorage.getItem('demoUsers')) || {};
            
            if (demoUsers[email]) {
                alert("Email already registered. Please login instead.");
                return;
            }

            const newUser = {
                name: name,
                email: email,
                password: password,
                location: '',
                skills: [],
                experience: [],
                education: [],
                about: `Hello! I'm ${name}. I'm excited to join CareerLink and connect with professionals in my field.`,
                profileImage: '../assets/default-profile.jpg',
                phone: '',
                linkedin: '',
                portfolio: ''
            };

            demoUsers[email] = newUser;
            localStorage.setItem('demoUsers', JSON.stringify(demoUsers));

            const sessionUser = { ...newUser };
            delete sessionUser.password;
            Auth.setUser(sessionUser);

            alert(`Welcome to CareerLink, ${name}! Your account has been created.`);
            window.location.href = "profile.html";
        });
    }

    // Job application
    const applyButtons = document.querySelectorAll(".job-apply button, .details-link");
    applyButtons.forEach(btn => {
        btn.addEventListener("click", function(e) {
            if (!Auth.isLoggedIn()) {
                e.preventDefault();
                alert("Please login to apply for jobs");
                window.location.href = "login.html";
            } else {
                e.preventDefault();
                
                const jobTitle = this.closest('.job-card')?.querySelector('h3')?.textContent || 'Job';
                const company = this.closest('.job-card')?.querySelector('p strong:contains("Company")')?.nextSibling?.textContent?.trim() || 'Unknown Company';
                
                // Store the job application data
                const applicationData = {
                    jobTitle: jobTitle,
                    company: company,
                    status: 'Applied',
                    dateApplied: new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    })
                };
                
                // Save application to localStorage
                saveJobApplication(applicationData);
                
                // Redirect to applications page
                window.location.href = "applications.html";
            }
        });
    });

    // Function to save job application
    function saveJobApplication(applicationData) {
        const currentUser = Auth.getUser();
        if (!currentUser) return;
        
        const userApplications = JSON.parse(localStorage.getItem(`applications_${currentUser.email}`)) || [];
        
        // Check if this job application already exists
        const existingApp = userApplications.find(app => 
            app.jobTitle === applicationData.jobTitle && 
            app.company === applicationData.company
        );
        
        if (!existingApp) {
            userApplications.push(applicationData);
            localStorage.setItem(`applications_${currentUser.email}`, JSON.stringify(userApplications));
            showToast(`Applied for ${applicationData.jobTitle} at ${applicationData.company}!`);
        } else {
            showToast(`You've already applied for this position!`, 'info');
        }
    }

    //  APPLICATIONS PAGE FUNCTIONALITY 
    function updateApplicationsPage() {
        if (!window.location.pathname.includes('applications.html')) return;
        
        // Check login first
        if (!Auth.isLoggedIn()) {
            alert("Please login to view your applications");
            window.location.href = "login.html";
            return;
        }
        
        const currentUser = Auth.getUser();
        const userApplications = JSON.parse(localStorage.getItem(`applications_${currentUser.email}`)) || [];
        
        // Update applications table
        const table = document.querySelector('table');
        if (table && userApplications.length > 0) {
            // Clear existing rows (except header)
            const rows = table.querySelectorAll('tr:not(:first-child)');
            rows.forEach(row => row.remove());
            
            // Add application rows
            userApplications.forEach(app => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${app.jobTitle}</td>
                    <td>${app.company}</td>
                    <td>${app.status}</td>
                    <td>${app.dateApplied}</td>
                `;
                table.appendChild(row);
            });
        }
    }

    //  PROFILE PAGE UPDATES 
    function updateProfilePage() {
        if (!window.location.pathname.includes('profile.html')) return;
        
        const currentUser = Auth.getUser();
        if (!currentUser) {
            window.location.href = "login.html";
            return;
        }
        
        // Check if user has education, if not, show suggestion
        if ((!currentUser.education || currentUser.education.length === 0) && 
            (!currentUser.about || !currentUser.about.includes('Computer Science') && 
             !currentUser.about.includes('Software') && !currentUser.about.includes('Engineering'))) {
            
            const profileEditSection = document.querySelector('.profile-edit');
            if (profileEditSection) {
                const educationPrompt = document.createElement('div');
                educationPrompt.className = 'education-prompt';
                educationPrompt.innerHTML = `
                    <div class="prompt-content">
                        <h3>📚 Improve Your Job Recommendations</h3>
                        <p>Add your education information to get personalized job recommendations!</p>
                        <p><strong>Example:</strong> "Computer Science at University" or "Software Engineering Degree"</p>
                    </div>
                `;
                profileEditSection.insertAdjacentElement('beforebegin', educationPrompt);
            }
        }
    }

    //  INITIALIZE EVERYTHING 
    initializeDemoUsers();
    updateNavigation();
    updateNetworkPage();
    updateMessagesPage();
    updateApplicationsPage();
    updateProfilePage();
    
    // Show job recommendations on jobs page
    SimpleJobRecommender.showJobRecommendations();
    
    // Show/hide login reminder on jobs page
    function updateLoginReminder() {
        const loginReminder = document.getElementById('login-reminder');
        if (!loginReminder) return;
        
        // Hide if user is logged in
        if (Auth.isLoggedIn()) {
            loginReminder.style.display = 'none';
        }
    }
    
    updateLoginReminder();
    
    // Listen for profile updates to refresh recommendations
    document.addEventListener('profileUpdated', function() {
        setTimeout(() => {
            SimpleJobRecommender.showJobRecommendations();
        }, 500);
    });
    
    // Override Auth.setUser to trigger updates when user logs in/out
    const originalSetUser = Auth.setUser;
    Auth.setUser = function(userData) {
        originalSetUser.call(this, userData);
        document.dispatchEvent(new CustomEvent('profileUpdated'));
    };
});