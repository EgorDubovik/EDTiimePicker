import { formatDate } from "./FormatDate";

const getYears = (date: Date, format = "YYYY") => {
	let currentYear = date.getFullYear();
	let years = [];
	for (let i = currentYear - 15; i < currentYear + 15; i++) {
		// Добавить фунцию для определения количества дней в месяце
		// что бы с 29 февраля не было проблем при перехоже на год где 28 февраля
		// так же как и при изменения месяцы поставить проверку на количство дней в месяце
		let newDate = new Date(date);
		newDate.setFullYear(i);
		years.push({
			text: formatDate(newDate, format),
			value: newDate,
			isSelected: newDate.getFullYear() === currentYear,
		});
	}
	return years;
};

const getMonths = (date: Date, format = "MMMM") => {
	let currentMonth = date.getMonth();
	let months = [];
	for (let i = -15; i < 15; i++) {
		let newDate = new Date(date);
		let currentYear = newDate.getFullYear();
		let currentDay = newDate.getDate();
		let tempDate = new Date(currentYear, currentMonth + i + 1, 0);
		let daysInNewMonth = tempDate.getDate();
		if (currentDay > daysInNewMonth) {
			newDate.setDate(daysInNewMonth);
		}
		newDate.setMonth(currentMonth + i);
		newDate.setFullYear(currentYear);
		months.push({
			text: formatDate(newDate, format),
			value: newDate,
			isSelected: newDate.getMonth() === currentMonth,
		});
	}
	return months;
};

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

const getHours = (date: Date, format: string) => {
	format = format ?? "hh";
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

const getMinutes = (date: Date, format: string, step = 15) => {
	format = format ?? "mm";
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

const getDaysNameArray = (date: Date, format: string) => {
	format = format ?? "DDD, MMM DD";
	const today = new Date();
	const datesArray = [];
	for (let i = -15; i < 15; i++) {
		var newDate = new Date(date.getTime() + i * 24 * 60 * 60 * 1000);
		const result =
			newDate.getDate() === today.getDate() &&
			newDate.getMonth() === today.getMonth() &&
			newDate.getFullYear() === today.getFullYear()
				? `Today`
				: formatDate(newDate, format);
		datesArray.push({
			text: result,
			value: newDate,
			isSelected:
				newDate.getDate() === date.getDate() &&
				newDate.getMonth() === date.getMonth() &&
				newDate.getFullYear() === date.getFullYear(),
		});
	}
	return datesArray;
};

const getAmPm = (date: Date) => {
	let hours = date.getHours();
	let index = hours >= 12 ? 1 : 0;
	let am = new Date(date);
	let pm = new Date(date);
	const items = [
		{
			text: "AM",
			value: hours >= 12 ? new Date(am.setHours(hours - 12)) : am,
			isSelected: index === 0,
		},
		{
			text: "PM",
			value: hours <= 12 ? new Date(pm.setHours(hours + 12)) : pm,
			isSelected: index === 1,
		},
	];

	return items;
};

export { getDays, getHours, getMinutes, getMonths, getYears, getDaysNameArray, getAmPm };
