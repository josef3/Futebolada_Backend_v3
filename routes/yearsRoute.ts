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
//---------------------------------------------------------

const router = express.Router();

router.get('/', getAllYears);
router.get('/current', getCurrentYear);
router.get('/:id', getYearById);

router.post('/', createYear);
router.patch('/:id', updateYear);
router.delete('/:id', deleteYear);

router.get('/:id/year-poll', getYearPollByYearId);

export default router;
