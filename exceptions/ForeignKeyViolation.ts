import HttpException from './HttpException';
//----------------------------------------------------------

class ForeignKeyViolation extends HttpException {
	constructor() {
		super(400, `ReferĂȘncia a um valor inexistente`);
	}
}

export default ForeignKeyViolation;
