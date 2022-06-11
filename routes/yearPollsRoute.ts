import express from 'express';
//-------------------- Controllers --------------------------
import {
	getAllYearPolls,
	getYearPollById,
} from '../controllers/yearPollsController';
//----------------------------------------------------------

const router = express.Router();

router.get('/', getAllYearPolls);
router.get('/:id', getYearPollById);

export default router;
