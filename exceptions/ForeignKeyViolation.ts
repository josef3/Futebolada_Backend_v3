import HttpException from './HttpException';
//----------------------------------------------------------

class ForeignKeyViolation extends HttpException {
	constructor() {
		super(400, `Referência a um valor inexistente`);
	}
}

export default ForeignKeyViolation;
