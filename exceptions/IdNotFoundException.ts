import HttpException from './HttpException';
//----------------------------------------------------------

class IdNotFoundException extends HttpException {
	constructor(id: string | number, entity: string) {
		super(404, `O/A ${entity} com o id ${id} não existe`);
	}
}

export default IdNotFoundException;
