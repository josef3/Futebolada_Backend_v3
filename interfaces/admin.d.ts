export default interface IAdmin {
	id_admin: number;
	username: string;
	password: string;
	role: 'read-only' | 'admin';
}
