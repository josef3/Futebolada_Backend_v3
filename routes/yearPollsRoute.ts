import express from 'express';
//-------------------- Controllers --------------------------
import {
	createYearPoll,
	deleteYearPoll,
	getAllYearPolls,
	getYearPollById,
} from '../controllers/yearPollsController';
//----------------------------------------------------------

const router = express.Router();

router.get('/', getAllYearPolls);
router.get('/:id', getYearPollById);

router.post('/', createYearPoll);
router.delete('/:id', deleteYearPoll);

export default router;
