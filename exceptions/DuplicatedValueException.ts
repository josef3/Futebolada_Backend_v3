import HttpException from './HttpException';
//----------------------------------------------------------

class DuplicatedValueException extends HttpException {
	constructor() {
		super(400, `O valor já existe no sistema`);
	}
}

export default DuplicatedValueException;
