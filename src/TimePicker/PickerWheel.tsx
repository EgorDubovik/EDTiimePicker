import { useEffect, useState, useRef } from "react";

interface IPickerWheel {
	onGetItems: (
		currentDate: Date | string,
		textFormat?: string | null,
		textItemStep?: number
	) => any;
   updateDate: (date: Date) => void;
	textFormat: string | null;
	textItemStep: number;
	currentDate: Date | string;
	itemsView: number;
	itemHeight: number;
	isLoop?: boolean;
}

const PickerWheel = (props: IPickerWheel) => {
   
	const onGetItems = props.onGetItems;
   const updateDate = props.updateDate;
	const textFormat = props.textFormat || null;
	const textItemStep = props.textItemStep || 1;
	const isLoop = props.isLoop === false ? false : true;
	const [currenDate, setCurrentDate] = useState(new Date(props.currentDate) || new Date());
	const [items, setItems] = useState(
		onGetItems(currenDate, textFormat, textItemStep)
	);
   const itemsView = props.itemsView || 1;
	const itemHeight = props.itemHeight || 40;

	const [translateY, setTranslateY] = useState(() =>{
      if(isLoop)
         return (items.length / 2 - itemsView) * -itemHeight
      return currenDate.getHours() < 12 ? itemHeight * itemsView : itemHeight * (itemsView -1);
   });
	const [indexTranslateY, setIndexTranslateY] = useState( () =>{
      return Math.round(translateY / itemHeight) * -1 + itemsView
   });
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

   const getItems = (date: Date) => {
      return onGetItems(date, textFormat, textItemStep);
   }

   const returnValue = () => {
      if(updateDate) updateDate(getValue());
   }
   useEffect(() => {
      const newDate = new Date(props.currentDate);
      setCurrentDate(newDate);
      setItems(getItems(newDate));
   }, [props.currentDate]);

	useEffect(() => {
      returnValue();
      setItems(getItems(getValue()));
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

   const handleClick = (ind: number) => {
      const diff = indexTranslateY - marginTopIndex - ind
      setTranslateY((prev) => 
         updateTranslateY(prev + diff * itemHeight)
      );
   }

   // Touch Events
	const handleTouchStart = (e: any) => {
		isDraging.current = true;
		startY.current = e.touches[0].clientY;
		if (itemsRef.current) itemsRef.current.style.transition = 'transform 0s ease-out';
		document.addEventListener('touchmove', handleTouchMove, { passive: false });
		document.addEventListener('touchend', handleTouchEnd);
	};

	const handleTouchMove = (e: any) => {
		if (!isDraging.current) return;
		if (e.cancelable && typeof e.preventDefault === 'function') {
			e.preventDefault(); // Prevent default scrolling behavior if possible
		}
		const diff = e.touches[0].clientY - startY.current;
		setTranslateY((prev) => 
         updateTranslateY(prev + diff)
      );
		startY.current = e.touches[0].clientY;
	};

	const handleTouchEnd = () => {
		isDraging.current = false;
		setTranslateY((prev) =>
         updateTranslateY(Math.round(prev / itemHeight) * itemHeight)
      );
		if (itemsRef.current) itemsRef.current.style.transition = 'transform 0.5s ease-out';
		document.removeEventListener('touchmove', handleTouchMove);
		document.removeEventListener('touchend', handleTouchEnd);
	};

	useEffect(() => {
		itemsRef.current?.addEventListener("wheel", handleWheel, {
			passive: false,
		});
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
         document.removeEventListener("touchmove", handleTouchMove);
         document.removeEventListener("touchend", handleTouchEnd);
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
            onTouchStart={handleTouchStart}
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
