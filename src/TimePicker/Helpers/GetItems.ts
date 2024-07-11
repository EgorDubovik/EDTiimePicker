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

const getHours = (date: Date, format = "hh") => {
	let currentHour = date.getHours();
	let hours = [];
	for (let i = -15; i < 15; i++) {
		let newDate = new Date(date);
		newDate.setHours(date.getHours() + i);
		let newHour = newDate.getHours();
		if (format === "hh") {
			if (currentHour >= 12 && newHour < 12) {
				newHour += 12;
			} else if (currentHour < 12 && newHour >= 12) {
				newHour -= 12;
			}
		}
		newDate.setHours(newHour);

		newDate.setMinutes(date.getMinutes());
		newDate.setDate(date.getDate());
		newDate.setMonth(date.getMonth());
		newDate.setFullYear(date.getFullYear());

		hours.push({
			text: formatDate(newDate, format),
			value: newDate,
			isSelected: newDate.getHours() === date.getHours(),
		});
	}
	return hours;
};

const getMinutes = (date: Date, format = "mm" ,step = 15) => {
	let currentMinute = date.getMinutes();
	const arraySize = 60;
	const minutes = [];
	const halfSize = Math.floor(arraySize / 2);
	currentMinute = Math.ceil(currentMinute / step) * step;
	currentMinute = currentMinute === 60 ? 0 : currentMinute;
	for (let i = -halfSize; i <= halfSize; i += step) {
		let minute = (currentMinute + i + 60) % 60; // Wrap around using modulo
		let newDate = new Date(date);
		newDate.setMinutes(minute);
		minutes.push({
			text: formatDate(newDate, format),
			value: newDate,
			isSelected: minute === currentMinute,
		});
	}
	if (
		minutes.length > 1 &&
		minutes[0].text === minutes[minutes.length - 1].text
	) {
		minutes.pop(); // Remove the last element to prevent duplication
	}
	return [...minutes, ...minutes, ...minutes];
};

export { getDays, getHours, getMinutes};
