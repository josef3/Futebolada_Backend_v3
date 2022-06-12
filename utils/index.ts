export const isDateValid = (date: string) => !isNaN(new Date(date).getTime());

export function addDays(date: string | Date, daysToAdd: number) {
	const newDate = new Date(date);
	newDate.setDate(newDate.getDate() + daysToAdd);
	return newDate;
}
