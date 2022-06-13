import { DatabaseError } from 'pg';
//-------------------- Exceptions --------------------------
import ForeignKeyViolation from '../exceptions/ForeignKeyViolation';
import UniqueViolation from '../exceptions/UniqueViolation';
//----------------------------------------------------------

type Errors = {
	[key: string]: {
		statusCode: number;
		message: string;
	};
};

const errors: Errors = {
	//foreign_key_violation
	'23503': {
		statusCode: new ForeignKeyViolation().statusCode,
		message: new ForeignKeyViolation().message,
	},
	//unique_violation
	'23505': {
		statusCode: new UniqueViolation().statusCode,
		message: new UniqueViolation().message,
	},
};

const dbErrorHandler = (error: DatabaseError) => {
	if (!error.code) return null;

	return errors[error.code];
};

export default dbErrorHandler;
