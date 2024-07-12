import "./style.css";
import PickerWheel from "./PickerWheel";
import { getDays, getHours, getMinutes } from "./Helpers/GetItems";
import { useState } from "react";

const TimePicker = () => {
	const [currenDate, setCurrentDate] = useState(new Date());
	const itemsView = 3;
	const itemHeight = 40;
	const wheelArray = new Array(
		{
			onGetItems: getDays,
			textFormat: "DD",
		},
		{
			onGetItems: getHours,
			textFormat: "hh",
		},
		{
			onGetItems: getMinutes,
         textFormat: "mm",
			textItemStep: 15,
		}
	);
	return (
		<div
			className="picker-wrapper"
			style={{ height: itemHeight * itemsView + "px" }}
		>
			{wheelArray.map((item, index) => (
				<>
					<PickerWheel
						onGetItems={item.onGetItems}
						textFormat={item.textFormat}
						textItemStep={item.textItemStep}
						currentDate={currenDate}
						viewItems={itemsView}
						itemHeight={itemHeight}
					/>
					{item.textFormat === "hh" && index < wheelArray.length && (
						<div className="picker-divider">:</div>
					)}
				</>
			))}
		</div>
	);
};

export default TimePicker;
