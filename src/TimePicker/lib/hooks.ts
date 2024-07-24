import { useRef, useEffect } from "react";

export function useEventHandlers(
	itemsRef: React.MutableRefObject<HTMLDivElement | null>,
	itemHeight: number,
	setTranslateY: React.Dispatch<React.SetStateAction<number>>,
	itemsView: number,
	isLoop: boolean,
   indexTranslateY: number,
   marginTopIndex: number
) {
	const startY = useRef(0);
	const isDraging = useRef(false);
	const hasDragged = useRef(false);
	const draggDelta = useRef(0);

	const updateTranslateY = (newTranslateY: number) => {
		if (!isLoop) {
			if (newTranslateY < itemHeight * (itemsView - 1))
				return itemHeight * (itemsView - 1);
			if (newTranslateY > itemHeight * itemsView)
				return itemHeight * itemsView;
		}
		return newTranslateY;
	};

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
		if (draggDelta.current > 10 || draggDelta.current < -10)
			hasDragged.current = true;
		setTranslateY((prev) => updateTranslateY(prev + diff));
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
			setTranslateY((prev) => updateTranslateY(prev + itemHeight));
		} else {
			setTranslateY((prev) => updateTranslateY(prev - itemHeight));
		}
	};

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

    const handleClick = (ind: number) => {
      if(hasDragged.current) return;
      const diff = indexTranslateY - marginTopIndex - ind
      setTranslateY((prev) => 
         updateTranslateY(prev + diff * itemHeight)
      );
   }

	useEffect(() => {
		const wheel = itemsRef.current;
		if (!wheel) return;

		wheel.addEventListener("mousedown", handleMouseDown);
      wheel.addEventListener("touchstart", handleTouchStart, { passive: false });
		wheel.addEventListener("wheel", handleWheel, {
			passive: false,
		});
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleTouchEnd);
		};
	}, [itemsRef]);

   return { handleClick };
}
