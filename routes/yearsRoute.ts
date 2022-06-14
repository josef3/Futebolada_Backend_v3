import express from 'express';
//-------------------- Controllers --------------------------
import {
	createYear,
	deleteYear,
	getAllYears,
	getCurrentYear,
	getYearById,
	updateYear,
} from '../controllers/yearsController';
import { getYearPollByYearId } from '../controllers/yearPollsController';
import { getWeeksByYearId } from '../controllers/weeksController';
//---------------------------------------------------------

const router = express.Router();

router.get('/', getAllYears);
router.get('/current', getCurrentYear);
router.get('/:id', getYearById);

router.post('/', createYear);
router.patch('/:id', updateYear);
router.delete('/:id', deleteYear);

router.get('/:id/year-poll', getYearPollByYearId);
router.get('/:id/weeks', getWeeksByYearId);

export default router;
