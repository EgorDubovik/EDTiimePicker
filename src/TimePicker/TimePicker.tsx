import "./style.css";
import PickerWheel from "./PickerWheel";
import {
	getDays,
	getHours,
	getMinutes,
	getMonths,
	getYears,
	getDaysNameArray,
   getAmPm
} from "./Helpers/GetItems";
import { nomrolizeDate, splitTimeFormat } from "./Helpers/FormatDate";
import React, { useEffect, useState } from "react";

interface ITimePicker {
	currentDate?: Date | string | null;
	options?: {
		viewItems?: number;
		itemsHeight?: number;
		daysNameFormat?: string;
		timeFormat?: string;
		dateWheelsFormat?: string;
      minutesStep?: number;
		showTime?: boolean;
		showDate?: boolean;
		daysNameWheels?: boolean;
      borderColor?: string;
	};
   onDateChange?: (date: Date) => void;
}

const defaultOptions = {
   viewItems: 3,
   itemsHeight: 40,
   daysNameFormat: "DDDD, MMM DD",
   timeFormat: "hh:mm A",
   dateWheelsFormat: "MMMM|DD|YYYY",
   minutesStep: 15,
   showTime: true,
   showDate: true,
   daysNameWheels: true,
   borderColor: "#2867f9",
   onDataChange: null,
};

const TimePicker = (prop: ITimePicker) => {
   // TODO: Add aditional class option
   const minutesStep = prop.options?.minutesStep || defaultOptions.minutesStep;
	const [currenDate, setCurrentDate] = useState(
      nomrolizeDate(new Date(prop.currentDate || new Date()), minutesStep)
	);
	const viewItems = prop.options?.viewItems || defaultOptions.viewItems;
   const itemsView = viewItems % 2 === 0 ? viewItems / 2 : (viewItems - 1) / 2;
	const itemHeight = prop.options?.itemsHeight || defaultOptions.itemsHeight;
   
	const daysNameWheel = prop.options?.daysNameWheels === false ? false : defaultOptions.daysNameWheels;
	const daysNameFormat = prop.options?.daysNameFormat || defaultOptions.daysNameFormat;
	const timeFormat = prop.options?.timeFormat || defaultOptions.timeFormat;
	const dateWheelsFormat = prop.options?.dateWheelsFormat || defaultOptions.dateWheelsFormat;
	const showTime = prop.options?.showTime === false ? false : defaultOptions.showTime;
	const showDate = prop.options?.showDate === false ? false : defaultOptions.showDate;
   const onDateChange = prop.onDateChange || defaultOptions.onDataChange;
   const borderColor = prop.options?.borderColor || defaultOptions.borderColor;

	const getWeelsArray = () => {
		const wheelArray = new Array();
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
            if (timeWheel === "HH" || timeWheel === "hh" || timeWheel === "H" || timeWheel === "h")
               wheelArray.push({
                  onGetItems: getHours,
                  textFormat: timeWheel,
               });
            else if (timeWheel === "mm" || timeWheel === "m")
               wheelArray.push({
                  onGetItems: getMinutes,
                  textFormat: timeWheel,
                  textItemStep: minutesStep,
               });
            else if (timeWheel === "A" && timeFormat.includes("h"))
               wheelArray.push({
                  onGetItems: getAmPm,
                  isLoop: false,
               });
         });
		}

		return wheelArray;
	};

	const wheelArray = getWeelsArray();
	
   useEffect(() => {
      if(onDateChange) onDateChange(currenDate);
   }, [currenDate]);

   const updateCurrentDate = (date: Date) => {
      setCurrentDate(date);
   }

	return (
		<div
			className="picker-wrapper"
			style={{ height: itemHeight * viewItems + "px" }}
		>
			{wheelArray.map((item, index) => (
				<React.Fragment key={index}>
					<PickerWheel
						onGetItems={item.onGetItems}
                  updateDate={updateCurrentDate}
						textFormat={item.textFormat}
						textItemStep={item.textItemStep}
						currentDate={currenDate}
						itemsView={itemsView}
						itemHeight={itemHeight}
                  isLoop={item.isLoop}
                  borderColor={borderColor}
					/>
					{(item.textFormat === "hh" || item.textFormat === "HH") &&
						index < wheelArray.length-1 && (
							<div className="picker-divider">:</div>
						)}
				</React.Fragment>
			))}
		</div>
	);
};

export default TimePicker;
