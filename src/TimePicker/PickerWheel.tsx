import { useEffect, useState } from "react";
const PickerWheel = (props:any) => {
   const onGetItems = props.onGetItems;
   const items = onGetItems(new Date());
   const viewItems = props.viewItems || 3;
   const itemsView = viewItems % 2 === 0 ? viewItems / 2 : (viewItems - 1) / 2;
   const itemHeight = props.itemHeight || 40;
   const [translateY, setTranslateY] = useState(0);
   const [marginTop, setMarginTop] = useState(0);

   useEffect(() => {
      console.log('items changed')
      const newTranslateY = (items.length / 2 - itemsView) * -itemHeight;
      setTranslateY(newTranslateY);
   }, [items]);

	return (
		<div className="picker-wheel">
			<div className="picker-wheel-window" style={{ height:itemHeight,borderColor: "#2867f9" }}></div>
         <div className="picker-wheel-items" style={{ 
            transform: `translateY(${translateY}px)`,
            marginTop: `${marginTop}px`,
            transition: `transform 0.5s ease-out 0s`
          }}>
            {items.map((item:any, index:number) => (
                  <div key={index} className={`picker-wheel-item ${(item.isSelected && 'active')}`} style={{height:itemHeight}}>{item.text}</div>
               ))
            }
         </div>
		</div>
	);
};

export default PickerWheel;
