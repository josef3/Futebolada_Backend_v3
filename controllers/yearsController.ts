import { pool } from '../dbConnection';
//-------------------- Interfaces --------------------------
import { INext, IRequest, IResponse } from '../interfaces';
import IYear from '../interfaces/year';
//-------------------- Exceptions --------------------------
import IdNotFoundException from '../exceptions/IdNotFoundException';
import EmptyFieldException from '../exceptions/EmptyFieldException';
//----------------------------------------------------------

export async function getAllYears(req: IRequest, res: IResponse, next: INext) {
	try {
		const { rows: years } = await pool.query<IYear[]>(`
        SELECT *
        FROM year 
        ORDER BY year_desc DESC`);

		res.send(years);
	} catch (error) {
		next(error);
	}
}

export async function getYearById(req: IRequest, res: IResponse, next: INext) {
	const { id } = req.params;

	try {
		const { rows, rowCount } = await pool.query<IYear>(
			`
        SELECT *
        FROM year
        WHERE id_year = $1`,
			[id]
		);

		if (!rowCount) {
			throw new IdNotFoundException(id, 'ano');
		}

		res.send(rows[0]);
	} catch (error) {
		next(error);
	}
}

export async function getCurrentYear(
	req: IRequest,
	res: IResponse,
	next: INext
) {
	const currentYear = new Date().getFullYear();

	try {
		const { rows, rowCount } = await pool.query<IYear>(
			`
        SELECT *
        FROM year
        WHERE year_desc = $1`,
			[currentYear]
		);

		if (!rowCount) {
			throw new Error();
		}

		res.send(rows[0]);
	} catch (error) {
		next(error);
	}
}

export async function createYear(req: IRequest, res: IResponse, next: INext) {
	const { year } = req.body;
	try {
		if (!year) return next(new EmptyFieldException('ano'));

		const { rows } = await pool.query<Pick<IYear, 'id_year'>>(
			`INSERT INTO year(year_desc) VALUES($1) 
			RETURNING id_year`,
			[year]
		);

		res.status(201).send({ idYear: rows[0].id_year });
	} catch (error) {
		next(error);
	}
}

export async function updateYear(req: IRequest, res: IResponse, next: INext) {
	const { id } = req.params;
	const { year } = req.body;
	try {
		if (!year) return next(new EmptyFieldException('ano'));

		await pool.query(
			`UPDATE year 
			SET year_desc = $1
			WHERE id_year = $2`,
			[year, id]
		);

		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
}

export async function deleteYear(req: IRequest, res: IResponse, next: INext) {
	const { id } = req.params;

	try {
		await pool.query(`DELETE FROM year WHERE id_year = $1`, [id]);

		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
}
