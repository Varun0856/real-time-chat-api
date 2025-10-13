import cookieParser from 'cookie-parser';
import express from 'express'
import authRouter from './routes/auth.route.js';
import roomRouter from './routes/room.route.js';
import { getMessages } from './controllers/message.controller.js';
import messageRouter from './routes/message.route.js';

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())


app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        baseURL:'/api',
        endpoints: {
            register: "POST /api/v1/auth/register",
            login: "POST /api/v1/auth/login",
            logout: "POST /api/v1/auth/logout",
            generateRefreshToken: "POST /api/v1/auth/refreshToken",
            createRoom: "POST /api/v1/room/",
            joinRoom: 'POST /api/v1/room/:roomId/join',
            updateRoom: 'PATCH /api/v1/room/:roomId',
            leaveRoom: 'DELETE /api/v1/room/:roomId/members',
            getUserRooms: 'GET /api/v1/room',
            getRoomById: 'GET /api/v1/room/:roomId',
            getPublicRooms: 'GET /api/v1/room/public',
            getMessages: 'GET /api/v1/room/:roomId/messages'
        },
    })
})

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/room', roomRouter);

export default app;