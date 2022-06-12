import request from 'supertest';
import app from '../app';
import { pool } from '../dbConnection';
//----------------------------------------------------------
import IdNotFoundException from '../exceptions/IdNotFoundException';
import EmptyFieldException from '../exceptions/EmptyFieldException';
import InvalidValueException from '../exceptions/InvalidValueException';
import HttpException from '../exceptions/HttpException';
import DuplicatedValueException from '../exceptions/DuplicatedValueException';
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

describe('DELETE /years/:id', () => {
	test(`It should return 200 on delete with success`, async () => {
		//create an yearPoll
		const newYearPoll = await request(app).post(`${API_URL}`).send({
			idYear: 2,
			startDate: '2022/06/12',
			endDate: '2022/06/15',
		});

		const res = await request(app).delete(
			`${API_URL}/${newYearPoll.body.idYearPoll}`
		);

		expect(res.status).toBe(200);
		expect(Object.keys(res.body).length).toBe(0);

		const resAfterDelete = await request(app).get(
			`${API_URL}/${newYearPoll.body.idYearPoll}`
		);

		expect(resAfterDelete.status).toBe(404);
		expect(resAfterDelete.body.message).toBe(
			new IdNotFoundException(newYearPoll.body.idYearPoll, 'votação anual')
				.message
		);
	});

	test(`It should return 404 if doesn't exist a year with the given id`, async () => {
		const res = await request(app).delete(`${API_URL}/0`);

		expect(res.status).toBe(404);
		expect(res.body.message).toBe(
			new IdNotFoundException('0', 'votação anual').message
		);
	});
});

describe('POST /year-polls', () => {
	test(`It should return 201 & yearPoll id on success`, async () => {
		const res = await request(app).post(`${API_URL}`).send({
			idYear: 2,
			startDate: '2022/06/12',
			endDate: '2022/06/15',
		});

		expect(res.status).toBe(201);

		expect(Object.keys(res.body).length).toBe(1);
		expect(res.body).toHaveProperty('idYearPoll');
		expect(res.body.idYearPoll).toBeGreaterThan(0);

		await request(app).delete(`${API_URL}/${res.body.idYearPoll}`);
	});

	test(`It should return 201 & yearPoll id on success, even when endDate is not passed`, async () => {
		const res = await request(app).post(`${API_URL}`).send({
			idYear: 2,
			startDate: '2022/06/12',
		});

		expect(res.status).toBe(201);

		expect(Object.keys(res.body).length).toBe(1);
		expect(res.body).toHaveProperty('idYearPoll');
		expect(res.body.idYearPoll).toBeGreaterThan(0);

		await request(app).delete(`${API_URL}/${res.body.idYearPoll}`);
	});

	test(`It should return 400 if none is passed in the body`, async () => {
		const res = await request(app).post(`${API_URL}`);

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(
			new EmptyFieldException('id_ano, data começo').message
		);
	});

	test(`It should return 400 if idYear is passed but startDate don't or it's blank`, async () => {
		const res = await request(app).post(`${API_URL}`).send({ idYear: 2 });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(
			new EmptyFieldException('id_ano, data começo').message
		);

		const res2 = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, startDate: '' });

		expect(res2.status).toBe(400);
		expect(res2.body.message).toBe(
			new EmptyFieldException('id_ano, data começo').message
		);

		const res3 = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, startDate: '        ' });

		expect(res3.status).toBe(400);
		expect(res3.body.message).toBe(
			new EmptyFieldException('id_ano, data começo').message
		);
	});

	test(`It should return 400 if idYear is passed but startDate don't or it's blank`, async () => {
		const res = await request(app)
			.post(`${API_URL}`)
			.send({ startDate: new Date() });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(
			new EmptyFieldException('id_ano, data começo').message
		);

		const res2 = await request(app)
			.post(`${API_URL}`)
			.send({ startDate: new Date(), idYear: '' });

		expect(res2.status).toBe(400);
		expect(res2.body.message).toBe(
			new EmptyFieldException('id_ano, data começo').message
		);
	});

	test(`It should return 400 if startDate or endDate are invalid dates`, async () => {
		const res = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, startDate: 'invalid date' });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(
			new InvalidValueException('data começo').message
		);

		const res2 = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, startDate: '2022/01/32' });

		expect(res2.status).toBe(400);
		expect(res2.body.message).toBe(
			new InvalidValueException('data começo').message
		);

		const res3 = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, startDate: new Date(), endDate: 'invalid date' });

		expect(res3.status).toBe(400);
		expect(res3.body.message).toBe(
			new InvalidValueException('data fim').message
		);

		const res4 = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, startDate: new Date(), endDate: '2022/02/00' });

		expect(res4.status).toBe(400);
		expect(res4.body.message).toBe(
			new InvalidValueException('data fim').message
		);
	});

	test(`It should return 400 if year already exists`, async () => {
		const res = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, startDate: '2022/05/05', endDate: '2022/01/01' });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(
			new HttpException(
				400,
				'A data fim não pode ser inferior à data de início'
			).message
		);
	});

	test(`It should return 400 if year already exists`, async () => {
		const res = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 1, startDate: '2022/06/12' });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(new DuplicatedValueException().message);
	});
});

//----------------------------------------------------------
afterAll(async () => {
	await pool.end();
});
