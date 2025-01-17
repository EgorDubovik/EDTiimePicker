const formatDate = (date: Date, format: string) => {
	if (!(date instanceof Date)) {
		throw new Error("Invalid date object");
	}

	const zeroPad = (num: number) => num.toString().padStart(2, "0");

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const monthAbbreviations = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const dayNames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	// First, handle longer tokens to avoid partial replacements
	const replacements : {[key:string]: string | number} = {
		YYYY: date.getFullYear(),
		YY: date.getFullYear().toString().slice(-2),
		MMMM: monthNames[date.getMonth()],
		MMM: monthAbbreviations[date.getMonth()],
		MM: zeroPad(date.getMonth() + 1), // Months are zero-based in JavaScript
		M: date.getMonth() + 1,
		DDDD: dayNames[date.getDay()],
		DDD: dayAbbreviations[date.getDay()],
		DD: zeroPad(date.getDate()),
		D: date.getDate(),
		HH: zeroPad(date.getHours()),
		H: date.getHours(),
		hh: zeroPad(date.getHours() % 12 || 12),
		h: date.getHours() % 12 || 12,
		mm: zeroPad(date.getMinutes()),
		m: date.getMinutes(),
		ss: zeroPad(date.getSeconds()),
	};

	return format.replace(
      /YYYY|YY|MMMM|MMM|MM|M|DDDD|DDD|DD|D|HH|H|hh|h|mm|m|ss/g,
      (match) => replacements[match as keyof typeof replacements].toString()
   );
};

const nomrolizeDate = (date:Date, minutesStep:number) => {
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const newDate = new Date(date);
	let normalizedMinutes = Math.ceil(minutes / minutesStep) * minutesStep;
	if(normalizedMinutes === 60){
		normalizedMinutes = 0;
		hours++;
	}
	newDate.setHours(hours);
	newDate.setMinutes(normalizedMinutes);
	newDate.setSeconds(0);
	return newDate;
}

const splitTimeFormat = (format: string): string[] => {
	const regex = /(HH|H|hh|h|mm|m|ss|A|a)/g;
	const matches = format.match(regex);
	const remaining = format.replace(regex, "").trim();
	const remainingParts = remaining
		? remaining.split(" ").filter((part) => part)
		: [];
	return matches ? [...matches, ...remainingParts] : remainingParts;
};

export { formatDate, nomrolizeDate, splitTimeFormat };