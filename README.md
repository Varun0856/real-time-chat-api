# real-time-chat-api

Real-time chat API with user auth, chat rooms, WebSocket messaging, file sharing, and message encryption. Includes message persistence, online user status, and Docker containerization for scalable deployment. Built with Node.js, Express, and MongoDB.

---

# Features

- Real-time bi-directional chat using Socket.io
- REST API for user and chat management
- Authentication with JWT
- MongoDB for persistent storage
- File and image upload support with Multer
- Image storage and delivery via Cloudinary
- Error handling and validation
- Global async handler
- Scalable and container-ready structure

---

# Tech Stack

- Backend: Node.js, Express.js
- Read-time: Socket.io
- Database: MongoDB + Mongoose
- Authentication: JWT
- File Upload: Multer
- Cloud Storage: Cloudinary
- Environment: Docker

---

# Project Setup

## Prerequisites

- Node.js >= 18
- MongoDB running locally or via cloud (MongoDB Atlas)
- npm

---

# Steps

```bash
# Clone repo
git clone https://github.com/Varun0856/real-time-chat-api.git
cd real-time-chat-api

# Install dependencies
npm install

# Create .env.development/production.local files
PORT=5000
MONGO_URI=your_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=your_access_token_expiry
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Run server
npm start
```

---

# API Endpoints

| Method | Endpoint                      | Description                   |
| ------ | ----------------------------- | ----------------------------- |
| POST   | /api/v1/auth/register         | Register user                 |
| POST   | /api/v1/auth/login            | Login user                    |
| POST   | /api/v1/auth/logout           | Log out user                  |
| POST   | /api/v1/auth/refreshToken     | Generate Refresh Token        |
| POST   | /api/v1/room/                 | Create a room                 |
| POST   | /api/v1/room/:roomId/join     | Join a room                   |
| PATCH  | /api/v1/room/:roomId          | Update a room                 |
| DELETE | /api/v1/room/:roomId/members  | Leave a room                  |
| GET    | /api/v1/room                  | Get user rooms                |
| GET    | /api/v1/room/:roomId          | Get rooms by Id               |
| GET    | /api/v1/room/public           | Get public rooms              |
| GET    | /api/v1/room/:roomId/messages | Get messages for a room       |
| POST   | /api/v1/upload/image          | Upload image to get image url |

---

# Socket Events

## Server Lifecycle

| Event        | Trigger               | Description                                              |
| ------------ | --------------------- | -------------------------------------------------------- |
| `connection` | When user connects    | Authenticates the socket, marks user online, joins rooms |
| `disconnect` | When user disconnects | Marks user offline and logs disconnection                |

## Client -> Server Events

| Event          | Payload                                      | Description                                             |
| -------------- | -------------------------------------------- | ------------------------------------------------------- |
| `join_room`    | `{ roomId }`                                 | Join a specific chat room                               |
| `leave_room`   | `{ roomId }`                                 | Leave a specific chat room                              |
| `send_message` | `{ roomId, content, messageType, imageUrl }` | Send a text or image message to a room                  |

## Server -> Client

| Event             | Payload                                                              | Description                                           |
| ----------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| `user-online`     | `{ userId, roomId }`                                                 | Triggered when a user connects and joins rooms        |
| `user-offline`    | `{ userId, roomId }`                                                 | Triggered when a user disconnects                     |
| `user-joined`     | `{ userId, roomId }`                                                 | Notifies others in the room that a user joined        |
| `user-left`       | `{ userId, roomId }`                                                 | Notifies others in the room that a user left          |
| `new-message`     | `{ messageId, senderId, content, messageType, imageUrl, createdAt }` | Broadcasts a new message to other members in the room |
| `message-history` | `{ roomId, messages: [...] }`                                        | Sends recent messages when user joins a room          |
| `error`           | `{ message }`                                                        | Emits when authentication or other errors occur       |

---

# License
MIT License © 2025 Varun Kulkarni
