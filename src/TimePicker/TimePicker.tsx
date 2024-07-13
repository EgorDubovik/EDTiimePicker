import "./style.css";
import PickerWheel from "./PickerWheel";
import {
	getDays,
	getHours,
	getMinutes,
	getMonths,
	getYears,
	getDaysNameArray,
} from "./Helpers/GetItems";
import React, { useState } from "react";

interface ITimePicker {
	currentDate?: Date | string | null;
	options?: {
		itemsView?: number;
		itemsHeight?: number;
		daysNameFormat?: string;
		timeFormat?: string;
		dateWheelsFormat?: string;
		showTime?: boolean;
		showDate?: boolean;
		daysNameWheels?: boolean;
	};
}

const TimePicker = (prop: ITimePicker) => {
	const [currenDate, setCurrentDate] = useState(
		prop.currentDate || new Date()
	);
	const itemsView = prop.options?.itemsView || 3;
	const itemHeight = prop.options?.itemsHeight || 40;
	const daysNameWheel = prop.options?.daysNameWheels === false ? false : true;
	const daysNameFormat = prop.options?.daysNameFormat || "DDDD, MMM DD";
	const timeFormat = prop.options?.timeFormat || "hh:mm A";
	const dateWheelsFormat = prop.options?.dateWheelsFormat || "MMMM|DD|YYYY";
	const showTime = prop.options?.showTime === false ? false : true;
	const showDate = prop.options?.showDate === false ? false : true;

	const splitTimeFormat = (format: string): string[] => {
		const regex = /(HH|hh|mm|ss|A|a)/g;
		const matches = format.match(regex);
		const remaining = format.replace(regex, "").trim();
		const remainingParts = remaining
			? remaining.split(" ").filter((part) => part)
			: [];
		return matches ? [...matches, ...remainingParts] : remainingParts;
	};

	const getWeelsArray = () => {
		const wheelArray = new Array();
		console.log(daysNameWheel);
		if (showDate) {
			if (daysNameWheel)
				wheelArray.push({
					onGetItems: getDaysNameArray,
					textFormat: daysNameFormat,
				});
			else {
				const dateWheels = dateWheelsFormat.split("|");
				dateWheels.forEach((dateWheel) => {
					if (
						dateWheel === "MMMM" ||
						dateWheel === "MMM" ||
						dateWheel === "MM" ||
						dateWheel === "M"
					)
						wheelArray.push({
							onGetItems: getMonths,
							textFormat: dateWheel,
						});
					else if (
						dateWheel === "DDD" ||
						dateWheel === "DD" ||
						dateWheel === "D"
					)
						wheelArray.push({
							onGetItems: getDays,
							textFormat: dateWheel,
						});
					else if (dateWheel === "YYYY" || dateWheel === "YY")
						wheelArray.push({
							onGetItems: getYears,
							textFormat: dateWheel,
						});
				});
			}
		}

		if (showTime) {
			const timeWheels = splitTimeFormat(timeFormat);
         timeWheels.forEach((timeWheel) => {
            if (timeWheel === "HH" || timeWheel === "hh")
               wheelArray.push({
                  onGetItems: getHours,
                  textFormat: timeWheel,
               });
            else if (timeWheel === "mm" || timeWheel === "m")
               wheelArray.push({
                  onGetItems: getMinutes,
                  textFormat: timeWheel,
                  textItemStep: 15,
               });
            else if (timeWheel === "A" || timeWheel === "a")
               console.log("AM/PM");
         });
		}

		return wheelArray;
	};

	const wheelArray = getWeelsArray();
	
	return (
		<div
			className="picker-wrapper"
			style={{ height: itemHeight * itemsView + "px" }}
		>
			{wheelArray.map((item, index) => (
				<React.Fragment key={index}>
					<PickerWheel
						onGetItems={item.onGetItems}
						textFormat={item.textFormat}
						textItemStep={item.textItemStep}
						currentDate={currenDate}
						viewItems={itemsView}
						itemHeight={itemHeight}
					/>
					{(item.textFormat === "hh" || item.textFormat === "HH") &&
						index < wheelArray.length && (
							<div className="picker-divider">:</div>
						)}
				</React.Fragment>
			))}
		</div>
	);
};

export default TimePicker;
