import HttpException from './HttpException';
//----------------------------------------------------------

class UniqueViolation extends HttpException {
	constructor() {
		super(400, `O valor já existe no sistema`);
	}
}

export default UniqueViolation;
