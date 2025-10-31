import express from 'express';
import { fetchMgnregaFor } from '../controllers/mgnregaController.js';


const router = express.Router();

router.get('/', fetchMgnregaFor);


export default router;