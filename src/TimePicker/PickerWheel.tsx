import { useEffect, useState, useRef } from "react";

interface IPickerWheel {
	onGetItems: (
		currentDate: Date | string,
		textFormat: string | null,
		textItemStep: number
	) => any;
	textFormat: string | null;
	textItemStep: number;
	currentDate: Date | string;
	viewItems: number;
	itemHeight: number;
	isLoop?: boolean;
}

const PickerWheel = (props: IPickerWheel) => {
	const onGetItems = props.onGetItems;
	const textFormat = props.textFormat || null;
	const textItemStep = props.textItemStep || 1;
	const isLoop = props.isLoop === false ? false : true;
	const currenDate = new Date(props.currentDate) || new Date();
	const [items, setItems] = useState(
		onGetItems(currenDate, textFormat, textItemStep)
	);
	const viewItems = props.viewItems || 3;
	const itemsView = viewItems % 2 === 0 ? viewItems / 2 : (viewItems - 1) / 2;
	const itemHeight = props.itemHeight || 40;

	const [translateY, setTranslateY] = useState(
		(items.length / 2 - itemsView) * -itemHeight
	);
	const [indexTranslateY, setIndexTranslateY] = useState(
		Math.round(translateY / itemHeight) * -1 + itemsView
	);
	const [fixedIndex, setFixedIndex] = useState(indexTranslateY);

	const [marginTop, setMarginTop] = useState(0);
	const [marginTopIndex, setMarginTopIndex] = useState(0);
	const itemsRef = useRef<HTMLDivElement>(null);
	const isDraging = useRef(false);

	const getValue = () => {
		const index = indexTranslateY - marginTopIndex;
		if (index < 0 || index >= items.length) return currenDate;
		return items[index].value;
	};

	useEffect(() => {
		setItems(onGetItems(getValue(), textFormat, textItemStep));
		const newMarginTopIndex = getMarginTopIndex();
      if(isLoop){
         setMarginTopIndex(newMarginTopIndex);
         setMarginTop(newMarginTopIndex * itemHeight);
      }
	}, [indexTranslateY]);

	useEffect(() => {
		setIndexTranslateY(getIndexTranslateY());
	}, [translateY]);

	function getMarginTopIndex() {
		return indexTranslateY - fixedIndex;
	}
	const getIndexTranslateY = () => {
		if (!isLoop) {
			let newCurrentIndex = Math.round(translateY / itemHeight) - itemsView;
			newCurrentIndex = newCurrentIndex < 0 ? 1 : newCurrentIndex;
			return newCurrentIndex;
		}
		return Math.round(translateY / itemHeight) * -1 + itemsView;
	};


   const updateTranslateY = (newTranslateY:number) => {
      if (!isLoop) {
         if (newTranslateY < itemHeight * (itemsView - 1))
            return itemHeight * (itemsView - 1);
         if (newTranslateY > itemHeight * itemsView)
            return itemHeight * itemsView;
      }
      return newTranslateY;
   }

	const startY = useRef(0);
	const handleMouseDown = (e: any) => {
		isDraging.current = true;
		startY.current = e.clientY;
		if (itemsRef.current)
			itemsRef.current.style.transition = "transform 0s ease-out";
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleMouseMove = (e: any) => {
		if (!isDraging.current) return;
		const diff = e.clientY - startY.current;
      setTranslateY((prev) => 
         updateTranslateY(prev + diff)
      );
		startY.current = e.clientY;
	};

	const handleMouseUp = (e: any) => {
		isDraging.current = false;
      setTranslateY((prev) =>
         updateTranslateY(Math.round(prev / itemHeight) * itemHeight)
      );
		if (itemsRef.current)
			itemsRef.current.style.transition = "transform 0.5s ease-out 0s";
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	};

	const handleWheel = (e: any) => {
		e.preventDefault();
		if (e.deltaY < 0) {
			setTranslateY((prev) => 
            updateTranslateY(prev + itemHeight)
         );
         
		} else {
			setTranslateY((prev) => 
            updateTranslateY(prev - itemHeight)
         );
		}
	};

	useEffect(() => {
		itemsRef.current?.addEventListener("wheel", handleWheel, {
			passive: false,
		});
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	return (
		<div className="picker-wheel">
			<div
				className="picker-wheel-window"
				style={{ height: itemHeight, borderColor: "#2867f9" }}
			></div>
			<div
				className="picker-wheel-items"
				onMouseDown={handleMouseDown}
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
						className={`picker-wheel-item ${item.isSelected && "active"}`}
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
