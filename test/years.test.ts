import request from 'supertest';
import app from '../app';
import { pool } from '../dbConnection';
//-------------------- Exceptions --------------------------
import DuplicatedValueException from '../exceptions/DuplicatedValueException';
import EmptyFieldException from '../exceptions/EmptyFieldException';
import IdNotFoundException from '../exceptions/IdNotFoundException';
//----------------------------------------------------------

const API_URL = '/api/v3/years';

describe('GET /years', () => {
	test(`It should return 200 & all years`, async () => {
		const res = await request(app).get(`${API_URL}`);

		expect(res.status).toBe(200);

		expect(Object.keys(res.body[0]).length).toBe(2);
		expect(res.body[0]).toHaveProperty('id_year');
		expect(res.body[0]).toHaveProperty('year_desc');

		//check if its ordered by year_desc desscending
		expect(
			`${res.body[0].year_desc}` > `${res.body[1].year_desc}`
		).toBeTruthy();
	});
});

describe('GET /years/:id', () => {
	test(`It should return 200 & years's with the given id info`, async () => {
		const res = await request(app).get(`${API_URL}/1`);

		expect(res.status).toBe(200);

		expect(Object.keys(res.body).length).toBe(2);
		expect(res.body).toHaveProperty('id_year');
		expect(res.body.id_year).toBe(1);
		expect(res.body).toHaveProperty('year_desc');
	});

	test(`It should return 404 if doesn't exist a year with the given id`, async () => {
		const res = await request(app).get(`${API_URL}/0`);

		expect(res.status).toBe(404);
		expect(res.body.message).toBe(new IdNotFoundException('0', 'ano').message);
	});
});

describe('GET /years/current', () => {
	test(`It should return 200 & current year`, async () => {
		const currentYear = new Date().getFullYear();

		const res = await request(app).get(`${API_URL}/current`);

		expect(res.status).toBe(200);

		expect(Object.keys(res.body).length).toBe(2);
		expect(res.body).toHaveProperty('id_year');
		expect(res.body).toHaveProperty('year_desc');
		expect(res.body.year_desc).toBe(currentYear);
	});
});

describe('POST /years', () => {
	test(`It should return 201 & year id on success`, async () => {
		const res = await request(app).post(`${API_URL}`).send({ year: '2026' });

		expect(res.status).toBe(201);

		expect(Object.keys(res.body).length).toBe(1);
		expect(res.body).toHaveProperty('idYear');
		expect(res.body.idYear).toBeGreaterThan(0);

		//delete the record
		await request(app).delete(`${API_URL}/${res.body.idYear}`);
	});

	test(`It should return 400 if year not passed`, async () => {
		const res = await request(app).post(`${API_URL}`);

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(new EmptyFieldException('ano').message);
	});

	test(`It should return 400 if year is blank`, async () => {
		const res = await request(app).post(`${API_URL}`).send({ year: '' });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(new EmptyFieldException('ano').message);
	});

	test(`It should return 400 if year already exists`, async () => {
		const res = await request(app).post(`${API_URL}`).send({ year: '2021' });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(new DuplicatedValueException().message);
	});
});

describe('PATCH /years', () => {
	test(`It should return 200 & year id on success`, async () => {
		const res = await request(app).patch(`${API_URL}/1`).send({ year: '2029' });

		expect(res.status).toBe(200);
		expect(Object.keys(res.body).length).toBe(0);

		const resAfterUpdate = await request(app).get(`${API_URL}/1`);

		expect(resAfterUpdate.status).toBe(200);
		expect(Object.keys(resAfterUpdate.body).length).toBe(2);
		expect(resAfterUpdate.body).toHaveProperty('id_year');
		expect(resAfterUpdate.body.id_year).toBe(1);
		expect(resAfterUpdate.body).toHaveProperty('year_desc');

		//revert the changes
		await request(app).patch(`${API_URL}/1`).send({ year: '2021' });
	});

	test(`It should return 400 if year not passed`, async () => {
		const res = await request(app).patch(`${API_URL}/1`);

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(new EmptyFieldException('ano').message);
	});

	test(`It should return 400 if year is blank`, async () => {
		const res = await request(app).patch(`${API_URL}/1`).send({ year: '' });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(new EmptyFieldException('ano').message);
	});

	test(`It should return 400 if year already exists`, async () => {
		const res = await request(app).patch(`${API_URL}/1`).send({ year: '2022' });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(new DuplicatedValueException().message);
	});
});

describe('GET /years/:id/year-poll', () => {
	test(`It should return 200 & years's poll info`, async () => {
		const res = await request(app).get(`${API_URL}/1/year-poll`);

		expect(res.status).toBe(200);

		expect(Object.keys(res.body).length).toBe(5);
		expect(res.body).toHaveProperty('id_year_poll');
		expect(res.body).toHaveProperty('id_year');
		expect(res.body.id_year).toBe(1);
		expect(res.body).toHaveProperty('start_date');
		expect(res.body).toHaveProperty('end_date');
		expect(res.body).toHaveProperty('finished');
	});

	test(`It should return 200 & empty object if year exists but doesn't have a poll yet`, async () => {
		const res = await request(app).get(`${API_URL}/2/year-poll`);

		expect(res.status).toBe(200);

		expect(Object.keys(res.body).length).toBe(0);
	});
});

//----------------------------------------------------------
afterAll(async () => {
	await pool.end();
});
