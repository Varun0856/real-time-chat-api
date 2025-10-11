import cookieParser from 'cookie-parser';
import express from 'express'
import authRouter from './routes/auth.route.js';

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
            generateRefreshToken: "POST /api/v1/auth/refreshToken"
        },
    })
})

app.use('/api/v1/auth', authRouter);

export default app;