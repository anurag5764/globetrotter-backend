Globetrotter Backend
Overview
This is the backend for the Globetrotter travel guessing game, where users guess cities based on clues. It serves destination data and manages user scores.
The frontend is in a separate repository: globetrotter-client.
Tech Stack

Backend:
Node.js & Express: For the server.
CORS: To allow frontend requests.


Frontend (globetrotter-client):
React: For the user interface.
Axios: For API requests.


Data: Stored in server/data/destination.json.

Setup Instructions
Prerequisites

Node.js (v18+)
npm
Git

Backend Setup

Clone the Repository:
git clone https://github.com/anurag5764/globetrotter-backend.git
cd globetrotter-backend


Install Dependencies:
npm install


Set Up Environment Variables:Create server/.env:
PORT=3001
CORS_ORIGIN=http://localhost:3000


Run the Backend:
npm start

Test it: curl http://localhost:3001/api/health (should return {"status":"ok"}).


Frontend Setup

Clone the Frontend Repository:
git clone https://github.com/anurag5764/globetrotter-client.git
cd globetrotter-client


Install Dependencies:
npm install


Set Up Environment Variables:Create .env:
REACT_APP_API_URL=http://localhost:3001


Run the Frontend:
npm start

Visit http://localhost:3000.



Created on May 15, 2025, by Anurag5764
