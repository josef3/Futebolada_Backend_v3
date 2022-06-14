import express from 'express';
//-------------------- Controllers --------------------------
import {
	createWeek,
	deleteWeek,
	getAllWeeks,
	getWeekById,
} from '../controllers/weeksController';
//----------------------------------------------------------

const router = express.Router();

router.get('/', getAllWeeks);
router.get('/:id', getWeekById);

router.post('/', createWeek);
router.delete('/:id', deleteWeek);

export default router;
