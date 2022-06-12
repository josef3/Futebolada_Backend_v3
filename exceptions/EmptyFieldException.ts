import HttpException from './HttpException';
//----------------------------------------------------------

class EmptyFieldException extends HttpException {
	constructor(fieldName: string) {
		super(400, `O(s) campo(s) ${fieldName} não pode(m) estar vazio(s)`);
	}
}

export default EmptyFieldException;
