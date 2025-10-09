import express, { urlencoded } from 'express'

const app = express();

app.use(express.json())
app.use(urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        baseURL:'/api',
    })
})

export default app;