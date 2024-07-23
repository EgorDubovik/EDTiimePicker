import { useEffect, useState } from "react";

export function useItems({
	initialDate,
	onGetItems,
	textFormat,
	textItemStep,
	itemHeight,
	itemsView,
}: {
	initialDate: Date;
	onGetItems: (date: Date, format: string, step: number) => any[];
	textFormat: string;
	textItemStep: number;
	itemHeight: number;
	itemsView: number;
}) {
	const [currentDate, setCurrentDate] = useState(initialDate);
	const [items, setItems] = useState(() =>
		onGetItems(initialDate, textFormat, textItemStep)
	);
	const [indexTranslateY, setIndexTranslateY] = useState(0);

	useEffect(() => {
		const newDate = new Date(initialDate);
		setCurrentDate(newDate);
		setItems(onGetItems(newDate, textFormat, textItemStep));
	}, [initialDate]);

	const updateItems = (translateY: number) => {
		const newIndexTranslateY =
			Math.round(translateY / itemHeight) * -1 + itemsView;
		setIndexTranslateY(newIndexTranslateY);
		setItems(onGetItems(currentDate, textFormat, textItemStep));
	};

	return {
		currentDate,
		items,
		updateItems,
		setIndexTranslateY,
		indexTranslateY,
	};
}
