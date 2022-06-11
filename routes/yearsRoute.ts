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
//---------------------------------------------------------

const router = express.Router();

router.get('/', getAllYears);
router.get('/current', getCurrentYear);
router.get('/:id', getYearById);

router.post('/', createYear);
router.patch('/:id', updateYear);
router.delete('/:id', deleteYear);

export default router;
