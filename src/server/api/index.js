// Dependencies
import express from 'express';
import posts from './data/posts';

// Express Router
const router = express.Router();

router.get('/Blog/posts', (req, res) => res.json(posts));

export default router;
