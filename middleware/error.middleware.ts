import { DatabaseError } from 'pg';
//-------------------- Interfaces --------------------------
import { INext, IRequest, IResponse } from '../interfaces';
//-------------------- Exceptions --------------------------
import HttpException from '../exceptions/HttpException';
//----------------------------------------------------------
import dbErrorHandler from '../utils/dbErrorHandler';
//----------------------------------------------------------

function errorMiddleware(
	error: HttpException,
	req: IRequest,
	res: IResponse,
	next: INext
) {
	let statusCode = 500;
	let message = 'Algo inesperado ocorreu, por favor tenta mais tarde';

	if (error instanceof DatabaseError) {
		const dbError = dbErrorHandler(error);
		if (dbError != null) {
			statusCode = dbError.statusCode;
			message = dbError.message;
		}
	} else {
		if (error.statusCode) statusCode = error.statusCode;
		message = error.message;
	}

	res.status(statusCode).send({ message });
}

export default errorMiddleware;
