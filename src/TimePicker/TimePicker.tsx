import "./style.css";
import PickerWheel from "./PickerWheel";
import { nomrolizeDate } from "./Helpers/FormatDate";
import { useState, Fragment } from "react";
import { getWheels } from "./lib/utils";

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
      addClass?: string;
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
   addClass: "",
};

const TimePicker = (prop: ITimePicker) => {
	console.log('TimePicker');
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
   const addClass = prop.options?.addClass || defaultOptions.addClass;

   const updateCurrentDate = (date: Date) => {
      setCurrentDate(date);
		if(onDateChange) onDateChange(date);
   }

	const wheelArray = getWheels(showDate, showTime, daysNameWheel, daysNameFormat, timeFormat, dateWheelsFormat, minutesStep);

	return (
		<div
			className={"picker-wrapper " + addClass}
			style={{ height: itemHeight * viewItems + "px" }}
		>
			{wheelArray.map((item, index) => (
				<Fragment key={index}>
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
				</Fragment>
			))}
		</div>
	);
};

export default TimePicker;
