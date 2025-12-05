TeamChat - Mini Team Collaboration App
A full-stack, real-time messaging application similar to Slack. This project allows users to create accounts, join channels, and chat in real-time with other users. It features live presence tracking (online/offline status) and message history pagination.

🚀 Live Demo
Frontend (Live): [Insert your Netlify Link Here]

Backend API: [Insert your Render Link Here]

🛠️ Tech Stack 

Frontend:

React (Vite): For building the user interface.

Tailwind CSS: For styling and responsive design.

Socket.io-client: For real-time bi-directional communication.

Axios: For HTTP requests (Auth, Channel management).

Backend:

Node.js & Express: REST API and Server logic.

Socket.io: WebSocket server for real-time events.

MongoDB & Mongoose: Database for storing Users, Channels, and Messages.

JWT (JSON Web Tokens): For secure stateless authentication.

✨ Features Implemented
Core Requirements
User Authentication: Users can Sign Up and Login. Sessions persist on refresh using JWT stored in LocalStorage .


Channel Management: Users can browse existing channels and create new ones .


Membership: Explicit "Join" and "Leave" functionality for channels.


Real-Time Messaging: Messages appear instantly for all users in a channel without refreshing.


Message History & Pagination: When scrolling to the top of the chat, older messages are automatically fetched from the database .


Online Presence: A sidebar displays channel members with a green dot indicating if they are currently online .

Optional Features 

Live Member Sidebar: A dedicated sidebar showing the list of members in the current channel and their real-time online status.


Unread/Member Counts: The channel list displays the total number of members in each channel.

⚙️ Setup and Run Instructions 

Follow these steps to run the project locally.

Prerequisites
Node.js installed

MongoDB Atlas Connection String

1. Clone the Repository
Bash

git clone https://github.com/YOUR_USERNAME/team-chat-app.git
cd team-chat-app
2. Backend Setup
Navigate to the server folder:

Bash

cd server
Install dependencies:

Bash

npm install
Create a .env file in the server folder and add the following:

Code snippet

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
Start the server:

Bash

npm start
The server will run on http://localhost:5000

3. Frontend Setup
Open a new terminal and navigate to the client folder:

Bash

cd client
Install dependencies:

Bash

npm install
Create a .env file in the client folder:

Code snippet

VITE_BACKEND_URL=http://localhost:5000
Start the React app:

Bash

npm run dev
Open your browser to http://localhost:5173.

📝 Assumptions and Limitations 

Assumptions
Unique Emails: The system assumes every user registers with a unique email address.

Public Channels: All channels created are public; any registered user can view the channel list and join them.

Security: For this assignment, JWT_SECRET and database credentials are managed via environment variables, but in a large-scale production app, strict secret management (like AWS Secrets Manager) would be used.

Limitations
Rich Media: The chat currently supports text-only messages. File uploads or images are not supported.

Message Editing: Messages cannot be edited or deleted once sent.

Single Workspace: The app operates as a single "workspace" (like one Slack team), rather than allowing users to create distinct workspaces.

Pagination UX: Pagination is implemented as "Infinite Scroll Upwards". It loads 20 messages at a time. Jumping to a specific date in history is not currently supported.