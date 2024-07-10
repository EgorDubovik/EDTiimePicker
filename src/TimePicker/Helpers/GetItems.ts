import { formatDate } from "./FormatDate";

const getDays = (date: Date, format = "DD") => {
	let currentMonth = date.getMonth();
	let currentYear = date.getFullYear();
	let currentDay = date.getDate();
	let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

	const arraySize = 40;
	const halfSize = Math.floor(arraySize / 2);
	const maxDay = daysInMonth;
	const result = new Array(arraySize);
	for (let i = 0; i < arraySize; i++) {
		const newDate = new Date(date);
		let day = currentDay + i - halfSize;
		if (day < 1) {
			day += maxDay;
		} else if (day > maxDay) {
			day -= maxDay;
		}
		newDate.setDate(day);
		result[i] = {
			text: formatDate(newDate, format),
			value: newDate,
			isSelected: day === currentDay,
		};
	}
	return result;
};

export { getDays };
