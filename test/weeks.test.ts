import request from 'supertest';
import app from '../app';
import { pool } from '../dbConnection';
//-------------------- Exceptions --------------------------
import IdNotFoundException from '../exceptions/IdNotFoundException';
import EmptyFieldException from '../exceptions/EmptyFieldException';
import InvalidValueException from '../exceptions/InvalidValueException';
import HttpException from '../exceptions/HttpException';
import UniqueViolation from '../exceptions/UniqueViolation';
import ForeignKeyViolation from '../exceptions/ForeignKeyViolation';
//----------------------------------------------------------
import { addDays } from '../utils';
//----------------------------------------------------------

const API_URL = '/api/v3/weeks';

describe('GET /weeks', () => {
	test(`It should return 200 & all weeks`, async () => {
		const res = await request(app).get(`${API_URL}`);

		expect(res.status).toBe(200);

		expect(Object.keys(res.body[0]).length).toBe(6);
		expect(res.body[0]).toHaveProperty('id_week');
		expect(res.body[0]).toHaveProperty('date');
		expect(res.body[0]).toHaveProperty('poll_start_date');
		expect(res.body[0]).toHaveProperty('poll_end_date');
		expect(res.body[0]).toHaveProperty('poll_finished');
		expect(res.body[0]).toHaveProperty('id_year');

		//check if its ordered by date desscending
		expect(`${res.body[0].date}` > `${res.body[1].date}`).toBeTruthy();
	});
});

describe('GET /weeks/:id', () => {
	test(`It should return 200 & year polls's with the given id info`, async () => {
		const res = await request(app).get(`${API_URL}/75`);

		expect(res.status).toBe(200);

		expect(Object.keys(res.body).length).toBe(6);
		expect(res.body).toHaveProperty('id_week');
		expect(res.body.id_week).toBe(75);
		expect(res.body).toHaveProperty('date');
		expect(res.body).toHaveProperty('poll_start_date');
		expect(res.body).toHaveProperty('poll_end_date');
		expect(res.body).toHaveProperty('poll_finished');
		expect(res.body).toHaveProperty('id_year');
	});

	test(`It should return 404 if doesn't exist a year with the given id`, async () => {
		const res = await request(app).get(`${API_URL}/0`);

		expect(res.status).toBe(404);
		expect(res.body.message).toBe(
			new IdNotFoundException('0', 'semana').message
		);
	});
});

describe('DELETE /weeks/:id', () => {
	test(`It should return 200 on delete with success`, async () => {
		//create a week
		const newWeek = await request(app).post(`${API_URL}`).send({
			idYear: 2,
			date: new Date(),
		});

		const res = await request(app).delete(`${API_URL}/${newWeek.body.idWeek}`);

		expect(res.status).toBe(200);
		expect(Object.keys(res.body).length).toBe(0);

		const resAfterDelete = await request(app).get(
			`${API_URL}/${newWeek.body.idWeek}`
		);

		expect(resAfterDelete.status).toBe(404);
		expect(resAfterDelete.body.message).toBe(
			new IdNotFoundException(newWeek.body.idWeek, 'semana').message
		);
	});

	test(`It should return 404 if doesn't exist a week with the given id`, async () => {
		const res = await request(app).delete(`${API_URL}/0`);

		expect(res.status).toBe(404);
		expect(res.body.message).toBe(
			new IdNotFoundException('0', 'semana').message
		);
	});
});

describe('POST /weeks', () => {
	test(`It should return 201 & week id on success`, async () => {
		const res = await request(app).post(`${API_URL}`).send({
			idYear: 2,
			date: '2022/06/13',
			pollStartDate: '2022/06/14',
			pollEndDate: '2022/06/15',
		});

		expect(res.status).toBe(201);

		expect(Object.keys(res.body).length).toBe(1);
		expect(res.body).toHaveProperty('idWeek');
		expect(res.body.idWeek).toBeGreaterThan(0);

		await request(app).delete(`${API_URL}/${res.body.idWeek}`);
	});

	test(`It should return 201 & week id on success, even when pollStartDate or pollEndDate are not passed`, async () => {
		const res = await request(app).post(`${API_URL}`).send({
			idYear: 2,
			date: '2022/06/12',
		});

		expect(res.status).toBe(201);

		expect(Object.keys(res.body).length).toBe(1);
		expect(res.body).toHaveProperty('idWeek');
		expect(res.body.idWeek).toBeGreaterThan(0);

		await request(app).delete(`${API_URL}/${res.body.idWeek}`);
	});

	test(`It should return 400 if none is passed in the body`, async () => {
		const res = await request(app).post(`${API_URL}`);

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(
			new EmptyFieldException('id_ano, data').message
		);
	});

	test(`It should return 400 if idYear is passed but date don't or it's blank`, async () => {
		const res = await request(app).post(`${API_URL}`).send({ idYear: 2 });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(
			new EmptyFieldException('id_ano, data').message
		);

		const res2 = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, date: '' });

		expect(res2.status).toBe(400);
		expect(res2.body.message).toBe(
			new EmptyFieldException('id_ano, data').message
		);

		const res3 = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, date: '        ' });

		expect(res3.status).toBe(400);
		expect(res3.body.message).toBe(
			new EmptyFieldException('id_ano, data').message
		);
	});

	test(`It should return 400 if date is passed but idYear don't or it's blank`, async () => {
		const res = await request(app)
			.post(`${API_URL}`)
			.send({ date: new Date() });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(
			new EmptyFieldException('id_ano, data').message
		);

		const res2 = await request(app)
			.post(`${API_URL}`)
			.send({ date: new Date(), idYear: '' });

		expect(res2.status).toBe(400);
		expect(res2.body.message).toBe(
			new EmptyFieldException('id_ano, data').message
		);
	});

	test(`It should return 400 if date, pollStartDate or pollEndDate are invalid dates`, async () => {
		const res = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, date: 'invalid date' });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(new InvalidValueException('data').message);

		const res2 = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, date: '2022/01/32' });

		expect(res2.status).toBe(400);
		expect(res2.body.message).toBe(new InvalidValueException('data').message);

		const res3 = await request(app).post(`${API_URL}`).send({
			idYear: 2,
			date: new Date(),
			pollStartDate: 'invalid date',
		});

		expect(res3.status).toBe(400);
		expect(res3.body.message).toBe(
			new InvalidValueException('data início').message
		);

		const res4 = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, date: new Date(), pollEndDate: '2022/02/00' });

		expect(res4.status).toBe(400);
		expect(res4.body.message).toBe(
			new InvalidValueException('data fim').message
		);
	});

	test(`It should return 400 if date is later than the current date`, async () => {
		const res = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, date: addDays(new Date(), 1) });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(
			new HttpException(400, 'A data não pode ser posterior ao dia de hoje')
				.message
		);
	});

	test(`It should return 400 if pollStartDate is previous to date`, async () => {
		const res = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 2, date: new Date(), pollStartDate: '2022/01/01' });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(
			new HttpException(
				400,
				'A data de início da votação não pode ser anterior à data da semana'
			).message
		);
	});

	test(`It should return 400 if end Date is previous to the start date`, async () => {
		const res = await request(app).post(`${API_URL}`).send({
			idYear: 2,
			date: '2022/05/05',
			pollStartDate: '2022/05/05',
			pollEndDate: '2022/01/01',
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(
			new HttpException(
				400,
				'A data fim não pode ser inferior à data de início'
			).message
		);
	});

	test(`It should return 400 if a week already exists for that date`, async () => {
		const res = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 1, date: '2022-04-04' });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(new UniqueViolation().message);
	});

	test(`It should return 400 if the id of the year doesn't exist`, async () => {
		const res = await request(app)
			.post(`${API_URL}`)
			.send({ idYear: 1000000, date: new Date() });

		expect(res.status).toBe(400);
		expect(res.body.message).toBe(new ForeignKeyViolation().message);
	});
});

//----------------------------------------------------------
afterAll(async () => {
	await pool.end();
});
