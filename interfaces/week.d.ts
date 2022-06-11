export default interface IWeek {
	id_week: number;
	date: Date;
	poll_start_date: Date;
	poll_end_date: Date;
	poll_finished: boolean;

	id_year: number;
}
