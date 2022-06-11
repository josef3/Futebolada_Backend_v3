import { DatabaseError } from 'pg';
//-------------------- Exceptions --------------------------
import DuplicatedValueException from '../exceptions/DuplicatedValueException';
//----------------------------------------------------------

type Errors = {
	[key: string]: {
		statusCode: number;
		message: string;
	};
};

const errors: Errors = {
	'23505': {
		statusCode: new DuplicatedValueException().statusCode,
		message: new DuplicatedValueException().message,
	},
};

const dbErrorHandler = (error: DatabaseError) => {
	if (!error.code) return null;

	return errors[error.code];
};

export default dbErrorHandler;
