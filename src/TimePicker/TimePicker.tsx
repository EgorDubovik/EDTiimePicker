import "./style.css";
import PickerWheel from "./PickerWheel";
import { nomrolizeDate } from "./Helpers/FormatDate";
import { useState, Fragment } from "react";
import { getWheels } from "./lib/utils";
import { ITimePicker } from "./types";

const DEFAULT_VIEW_ITEMS = 3;
const DEFAULT_ITEM_HEIGHT = 40;
const DEFAULT_DAYS_NAME_FORMAT = "DDDD, MMM DD";
const DEFAULT_TIME_FORMAT = "hh:mm A";
const DEFAULT_DATE_WHEELS_FORMAT = "MMMM|DD|YYYY";
const DEFAULT_MINUTES_STEP = 15;
const DEFAULT_SHOW_TIME = true;
const DEFAULT_SHOW_DATE = true;
const DEFAULT_DAYS_NAME_WHEELS = true;
const DEFAULT_BORDER_COLOR = "#2867f9";
const DEFAULT_ADD_CLASS = "";
const DEFAULT_ON_DATA_CHANGE = null;

const TimePicker = (prop: ITimePicker) => {

   const minutesStep = prop.options?.minutesStep || DEFAULT_MINUTES_STEP;
	const viewItems = prop.options?.viewItems || DEFAULT_VIEW_ITEMS;
   const itemsView = viewItems % 2 === 0 ? viewItems / 2 : (viewItems - 1) / 2;
	const itemHeight = prop.options?.itemsHeight || DEFAULT_ITEM_HEIGHT;
	const daysNameWheel = prop.options?.daysNameWheels === false ? false : DEFAULT_DAYS_NAME_WHEELS;
	const daysNameFormat = prop.options?.daysNameFormat || DEFAULT_DAYS_NAME_FORMAT;
	const timeFormat = prop.options?.timeFormat || DEFAULT_TIME_FORMAT;
	const dateWheelsFormat = prop.options?.dateWheelsFormat || DEFAULT_DATE_WHEELS_FORMAT;
	const showTime = prop.options?.showTime === false ? false : DEFAULT_SHOW_TIME;
	const showDate = prop.options?.showDate === false ? false : DEFAULT_SHOW_DATE;
   const onDateChange = prop.onDateChange || DEFAULT_ON_DATA_CHANGE;
   const borderColor = prop.options?.borderColor || DEFAULT_BORDER_COLOR;
   const addClass = prop.options?.addClass || DEFAULT_ADD_CLASS;
	const [currenDate, setCurrentDate] = useState(
      nomrolizeDate(new Date(prop.currentDate || new Date()), minutesStep)
	);
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
