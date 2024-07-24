import { useEffect, useState, useRef } from "react";
import { getIndexTranslateY } from "./lib/utils";
import { IPickerWheel } from "./types";

const PickerWheel = (props: IPickerWheel) => {
	const onGetItems = props.onGetItems;
   const updateDate = props.updateDate;
	const textFormat = props.textFormat;
	const textItemStep = props.textItemStep;
	const isLoop = props.isLoop === false ? false : true;
   const borderColor = props.borderColor;
	const itemsView = props.itemsView;
	const itemHeight = props.itemHeight;
	const [currenDate, setCurrentDate] = useState<Date>(props.currentDate);
	const [items, setItems] = useState(
		onGetItems(currenDate, textFormat, textItemStep)
	);

	const itemsRef = useRef<HTMLDivElement>(null);
	const [translateY, setTranslateY] = useState(() =>{
      if(isLoop)
         return (items.length / 2 - itemsView) * -itemHeight
      return currenDate.getHours() < 12 ? itemHeight * itemsView : itemHeight * (itemsView -1);
   });

	const indexTranslateY = getIndexTranslateY(translateY, itemHeight, itemsView, isLoop);
	const [oldIndexTranslateY, setoldIndexTranslateY] = useState(indexTranslateY);
	const marginTopIndex = isLoop ? indexTranslateY - Math.round(items.length / 2) : 0;
	const marginTop = isLoop ?  marginTopIndex * itemHeight : 0;
	

	const getValue = () => {
		const index = 2 * indexTranslateY - marginTopIndex - oldIndexTranslateY;
		setoldIndexTranslateY(indexTranslateY);
		if(index < 0) return items[0].value;
		if(index >= items.length) return items[items.length - 1].value;
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
	}, [indexTranslateY]);

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
	const isDraging = useRef(false);
   const hasDragged = useRef(false);
   const draggDelta = useRef(0);
   
	const handleMouseDown = (e: any) => {
      hasDragged.current = false;
      draggDelta.current = 0;
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
      draggDelta.current += diff;
      if(draggDelta.current > 10 || draggDelta.current < -10) hasDragged.current = true;
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
      if(hasDragged.current) return;
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
				style={{ height: itemHeight, borderColor: borderColor }}
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
