import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in environment variables');
}

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'user' && password === 'password') {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.get('/protected', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ message: 'Protected data', user: decoded });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));