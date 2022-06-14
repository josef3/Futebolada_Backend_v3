import { pool } from '../dbConnection';
//-------------------- Interfaces --------------------------
import { INext, IRequest, IResponse } from '../interfaces';
import IWeek from '../interfaces/week';
//-------------------- Exceptions --------------------------
import IdNotFoundException from '../exceptions/IdNotFoundException';
import InvalidValueException from '../exceptions/InvalidValueException';
import EmptyFieldException from '../exceptions/EmptyFieldException';
//----------------------------------------------------------
import { addDays, isDateValid } from '../utils';
import HttpException from '../exceptions/HttpException';
//----------------------------------------------------------

const DEFAULT_POLL_DAYS_DURATION = 3;

export async function getAllWeeks(req: IRequest, res: IResponse, next: INext) {
	try {
		const { rows: weeks } = await pool.query<IWeek>(`
        SELECT *
        FROM week
        ORDER BY date DESC`);

		res.send(weeks);
	} catch (error) {
		next(error);
	}
}

export async function getWeekById(req: IRequest, res: IResponse, next: INext) {
	const { id } = req.params;

	try {
		const { rows, rowCount } = await pool.query<IWeek>(
			`
        SELECT *
        FROM week
        WHERE id_week = $1`,
			[id]
		);

		if (!rowCount) {
			throw new IdNotFoundException(id, 'semana');
		}

		res.send(rows[0]);
	} catch (error) {
		next(error);
	}
}

export async function getWeeksByYearId(
	req: IRequest,
	res: IResponse,
	next: INext
) {
	const { id } = req.params;

	try {
		const { rows } = await pool.query<IWeek>(
			`
        SELECT *
        FROM week
        WHERE id_year = $1
		ORDER BY date DESC`,
			[id]
		);

		res.send(rows);
	} catch (error) {
		next(error);
	}
}

export async function createWeek(req: IRequest, res: IResponse, next: INext) {
	const { idYear, date } = req.body;
	let { pollStartDate, pollEndDate } = req.body;
	try {
		if (!idYear || !date?.trim()) {
			return next(new EmptyFieldException('id_ano, data'));
		}

		if (!isDateValid(date)) {
			return next(new InvalidValueException('data'));
		}

		if (new Date(date) > new Date()) {
			return next(
				new HttpException(400, 'A data não pode ser posterior ao dia de hoje')
			);
		}

		if (pollStartDate) {
			if (!isDateValid(pollStartDate)) {
				return next(new InvalidValueException('data início'));
			}
			if (new Date(pollStartDate) < new Date(date)) {
				return next(
					new HttpException(
						400,
						'A data de início da votação não pode ser anterior à data da semana'
					)
				);
			}
		} else {
			pollStartDate = new Date();
		}

		if (pollEndDate) {
			if (!isDateValid(pollEndDate)) {
				return next(new InvalidValueException('data fim'));
			}
			if (new Date(pollEndDate) < new Date(pollStartDate)) {
				return next(
					new HttpException(
						400,
						'A data fim não pode ser inferior à data de início'
					)
				);
			}
		} else {
			pollEndDate = addDays(pollStartDate, DEFAULT_POLL_DAYS_DURATION);
		}

		const { rows } = await pool.query<Pick<IWeek, 'id_week'>>(
			`INSERT INTO week(date, poll_start_date, poll_end_date, poll_finished, id_year) VALUES($1, $2, $3, $4, $5)
			RETURNING id_week`,
			[date, pollStartDate, pollEndDate, false, idYear]
		);

		res.status(201).send({ idWeek: rows[0].id_week });
	} catch (error) {
		next(error);
	}
}

export async function deleteWeek(req: IRequest, res: IResponse, next: INext) {
	const { id } = req.params;

	try {
		const { rowCount } = await pool.query(
			`DELETE FROM week WHERE id_week = $1`,
			[id]
		);

		if (!rowCount) {
			throw new IdNotFoundException(id, 'semana');
		}

		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
}
