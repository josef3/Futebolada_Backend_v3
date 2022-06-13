import { pool } from '../dbConnection';
//-------------------- Interfaces --------------------------
import { INext, IRequest, IResponse } from '../interfaces';
import IYearPoll from '../interfaces/yearPoll';
//-------------------- Exceptions --------------------------
import IdNotFoundException from '../exceptions/IdNotFoundException';
import InvalidValueException from '../exceptions/InvalidValueException';
import EmptyFieldException from '../exceptions/EmptyFieldException';
//----------------------------------------------------------
import { addDays, isDateValid } from '../utils';
import HttpException from '../exceptions/HttpException';
//----------------------------------------------------------

const DEFAULT_POLL_DAYS_DURATION = 3;

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

export async function createYearPoll(
	req: IRequest,
	res: IResponse,
	next: INext
) {
	const { idYear, startDate } = req.body;
	let { endDate } = req.body;
	try {
		if (!idYear || !startDate?.trim()) {
			return next(new EmptyFieldException('id_ano, data começo'));
		}

		if (!isDateValid(startDate)) {
			return next(new InvalidValueException('data começo'));
		}

		if (endDate) {
			if (!isDateValid(endDate)) {
				return next(new InvalidValueException('data fim'));
			}
			if (!(new Date(endDate) > new Date(startDate))) {
				return next(
					new HttpException(
						400,
						'A data fim não pode ser inferior à data de início'
					)
				);
			}
		} else {
			endDate = addDays(startDate, DEFAULT_POLL_DAYS_DURATION);
		}

		const { rows } = await pool.query<Pick<IYearPoll, 'id_year_poll'>>(
			`INSERT INTO year_poll(id_year, start_date, end_date, finished) VALUES($1, $2, $3, $4)
			RETURNING id_year_poll`,
			[idYear, startDate, endDate, false]
		);

		res.status(201).send({ idYearPoll: rows[0].id_year_poll });
	} catch (error) {
		next(error);
	}
}

export async function deleteYearPoll(
	req: IRequest,
	res: IResponse,
	next: INext
) {
	const { id } = req.params;

	try {
		const { rowCount } = await pool.query(
			`DELETE FROM year_poll WHERE id_year_poll = $1`,
			[id]
		);

		if (!rowCount) {
			throw new IdNotFoundException(id, 'votação anual');
		}

		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
}
