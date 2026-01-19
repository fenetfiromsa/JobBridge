                           # CareerLink — Job Networking & Career Management Web Application

        GROUP MEMBERS
1.  Fenet Firomsa
2.  Fikerte Yimer                    
3.	Fiker Robel                        
4.	Hawi Sebsibe                     
5.	Haleluya Desalegn                                
 


**CareerLink** is a multi-page web application designed to help users find jobs, manage their professional profiles, track applications, and network with other professionals. This version includes **full HTML structure**. CSS and JavaScript will be implemented in later stages to enhance UI and interactivity.

---


## Overview

CareerLink is a job networking and career management platform that allows users to:

- Create and manage personal profiles  
- Explore and apply for jobs  
- Post job listings (for recruiters)  
- Track applications and notifications  
- Network with other professionals  
- Send and receive messages  

This version of CareerLink is built purely in HTML to establish the **page structure**. Future versions will include **CSS styling** and **JavaScript interactivity** for a dynamic user experience.

---

## Features

| Module | Description |
|--------|-------------|
| Dashboard | Overview of user profile, stats, recommended jobs, notifications, posts, and messages |
| Profile Management | View and edit personal information, skills, experience, and contact details |
| Job Listings | Browse available jobs with search functionality |
| Job Details | View job description, requirements, and apply (placeholder) |
| Post Job | Submit a new job listing (for recruiters) |
| Applications | Track submitted applications with status updates |
| Networking | Explore suggested connections and connect with other professionals |
| Messaging | Chat with connections; see recent conversations |
| Settings | Manage account, privacy, and notification preferences |

---

## System Architecture
User
├── Dashboard
├── Profile
├── Jobs
│ ├── Job Details
│ └── Post Job
├── Applications
├── Network
└── Messages
↓



---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5 |
| Future Enhancements | CSS3, JavaScript |
| Storage | Local storage (future: database integration) |

---

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/fenetfiromsa/careerlink.git

Open the index.html file in your browser to start exploring the app.

## Usage Guide
Action	Description
Navigate Pages               	Use the top navigation bar to access Home, Jobs, Network, Messages, and Profile
View Profile	                Check user info, skills, experience, and edit profile form
Explore Jobs                 	Browse job listings and click "View Details" for more info
Apply for Jobs	              Click "Apply Now" on job details page (placeholder)
Post a Job	                  Fill in the job post form (for recruiters)
Track Applications           	View the table of submitted applications and their status
Connect with Professionals  	Use the network page to send connection requests
Send Messages	                Open messages page to chat with connections
Manage Settings	              Update account, privacy, and notification preferences





careerlink/
│
├── index.html                          → Home / Dashboard Overview
├── login.html                          → Login form
├── signup.html                         → Signup form
├── dashboard.html                      → User dashboard overview
├── profile.html                        → User profile & edit page
├── settings.html                       → Account, privacy, notifications
├── jobs.html                            → Job listings
├── job-details.html                     → Job description & apply
├── post-job.html                         → Post new job form
├── applications.html                     → Table of user applications
├── network.html                           → Suggested connections
├── messages.html                          → Chat interface
├── assets/                               → Images, placeholders
└── README.md


Future Enhancements
Enhancement	Description
CSS Styling                	Add layout, colors, typography, and responsiveness
JavaScript	                Add interactivity: forms validation, dynamic notifications, search functionality
Backend Integration       	Connect to a server for storing jobs, applications, and messages
User Authentication       	Secure login/signup with session management
Cloud Storage	              Persist data across devices
AI Recommendations	        Suggest jobs and connections based on user profile
