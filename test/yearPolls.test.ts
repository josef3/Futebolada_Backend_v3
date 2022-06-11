import request from 'supertest';
import app from '../app';
import { pool } from '../dbConnection';
//----------------------------------------------------------
import IdNotFoundException from '../exceptions/IdNotFoundException';
//----------------------------------------------------------

const API_URL = '/api/v3/year-polls';

describe('GET /year-polls', () => {
	test(`It should return 200 & all year polls`, async () => {
		const res = await request(app).get(`${API_URL}`);

		expect(res.status).toBe(200);

		expect(Object.keys(res.body[0]).length).toBe(5);
		expect(res.body[0]).toHaveProperty('id_year_poll');
		expect(res.body[0]).toHaveProperty('id_year');
		expect(res.body[0]).toHaveProperty('start_date');
		expect(res.body[0]).toHaveProperty('end_date');
		expect(res.body[0]).toHaveProperty('finished');
	});
});

describe('GET /year-polls/:id', () => {
	test(`It should return 200 & year polls's with the given id info`, async () => {
		const res = await request(app).get(`${API_URL}/1`);

		expect(res.status).toBe(200);

		expect(Object.keys(res.body).length).toBe(5);
		expect(res.body).toHaveProperty('id_year_poll');
		expect(res.body.id_year_poll).toBe(1);
		expect(res.body).toHaveProperty('id_year');
		expect(res.body).toHaveProperty('start_date');
		expect(res.body).toHaveProperty('end_date');
		expect(res.body).toHaveProperty('finished');
	});

	test(`It should return 404 if doesn't exist a year with the given id`, async () => {
		const res = await request(app).get(`${API_URL}/0`);

		expect(res.status).toBe(404);
		expect(res.body.message).toBe(
			new IdNotFoundException('0', 'votação anual').message
		);
	});
});

//----------------------------------------------------------
afterAll(async () => {
	await pool.end();
});
