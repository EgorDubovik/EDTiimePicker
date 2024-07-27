import { useEffect, useState, useRef } from "react";
import { getIndexTranslateY } from "./lib/utils";
import { IPickerWheel } from "./types";
import { useEventHandlers } from "./lib/hooks";

const PickerWheel = (props: IPickerWheel) => {
	const onGetItems = props.onGetItems;
	const updateDate = props.updateDate;
	const textFormat = props.textFormat;
	const textItemStep = props.textItemStep;
	const isLoop = props.isLoop === false ? false : true;
	const borderColor = props.borderColor;
	const itemsView = props.itemsView;
	const itemHeight = props.itemHeight;
	const textAlign = props.textAlign || "left";
	const [currenDate, setCurrentDate] = useState<Date>(props.currentDate);
	const [items, setItems] = useState(
		onGetItems(currenDate, textFormat, textItemStep)
	);

	const itemsRef = useRef<HTMLDivElement>(null);
	const [translateY, setTranslateY] = useState(() => {
		if (isLoop) return (items.length / 2 - itemsView) * -itemHeight;
		return currenDate.getHours() < 12
			? itemHeight * itemsView
			: itemHeight * (itemsView - 1);
	});

	const indexTranslateY = getIndexTranslateY(
		translateY,
		itemHeight,
		itemsView,
		isLoop
	);
	const [oldIndexTranslateY, setoldIndexTranslateY] =
		useState(indexTranslateY);
	const marginTopIndex = isLoop
		? indexTranslateY - Math.round(items.length / 2)
		: 0;
	const marginTop = isLoop ? marginTopIndex * itemHeight : 0;

	const getValue = () => {
		const index = 2 * indexTranslateY - marginTopIndex - oldIndexTranslateY;
		setoldIndexTranslateY(indexTranslateY);
		if (index < 0) return items[0].value;
		if (index >= items.length) return items[items.length - 1].value;
		return items[index].value;
	};

	const getItems = (date: Date) => {
		return onGetItems(date, textFormat, textItemStep);
	};

	const returnValue = () => {
		if (updateDate) updateDate(getValue());
	};
	useEffect(() => {
		const newDate = new Date(props.currentDate);
		setCurrentDate(newDate);
		setItems(getItems(newDate));
	}, [props.currentDate]);

	useEffect(() => {
		returnValue();
		setItems(getItems(getValue()));
	}, [indexTranslateY]);

	const { handleClick } = useEventHandlers(
		itemsRef,
		itemHeight,
		setTranslateY,
		itemsView,
		isLoop,
		indexTranslateY,
		marginTopIndex
	);

	return (
		<div className="picker-wheel">
			<div
				className="picker-wheel-window"
				style={{ height: itemHeight, borderColor: borderColor }}
			></div>
			<div
				className="picker-wheel-items"
				ref={itemsRef}
				style={{
					transform: `translateY(${translateY}px)`,
					marginTop: `${marginTop}px`,
					transition: `transform 0.5s ease-out 0s`,
				}}
			>
				{items.map((item: any, index: number) => (
					<div
						key={index}
						onClick={() => handleClick(index)}
						className={`picker-wheel-item text-${textAlign} ${item.isSelected && "active"}`}
						style={{ height: itemHeight }}
					>
						{item.text}
					</div>
				))}
			</div>
		</div>
	);
};

export default PickerWheel;
