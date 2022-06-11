import { pool } from '../dbConnection';
//-------------------- Interfaces --------------------------
import { INext, IRequest, IResponse } from '../interfaces';
import IYearPoll from '../interfaces/yearPoll';
//-------------------- Exceptions --------------------------
import IdNotFoundException from '../exceptions/IdNotFoundException';
//----------------------------------------------------------

export async function getAllYearPolls(
	req: IRequest,
	res: IResponse,
	next: INext
) {
	try {
		const { rows: yearPolls } = await pool.query<IYearPoll>(`
        SELECT *
        FROM year_poll
        ORDER BY start_date DESC`);

		res.send(yearPolls);
	} catch (error) {
		next(error);
	}
}

export async function getYearPollById(
	req: IRequest,
	res: IResponse,
	next: INext
) {
	const { id } = req.params;

	try {
		const { rows, rowCount } = await pool.query<IYearPoll>(
			`
        SELECT *
        FROM year_poll
        WHERE id_year_poll = $1`,
			[id]
		);

		if (!rowCount) {
			throw new IdNotFoundException(id, 'votação anual');
		}

		res.send(rows[0]);
	} catch (error) {
		next(error);
	}
}

export async function getYearPollByYearId(
	req: IRequest,
	res: IResponse,
	next: INext
) {
	const { id } = req.params;

	try {
		const { rows } = await pool.query<IYearPoll>(
			`
        SELECT *
        FROM year_poll
        WHERE id_year = $1`,
			[id]
		);

		res.send(rows[0]);
	} catch (error) {
		next(error);
	}
}
