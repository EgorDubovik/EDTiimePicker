
const PickerWheel = (props:any) => {
   const onGetItems = props.onGetItems;
   const items = onGetItems(new Date());
   const itemHeight = props.itemHeight || 40;

	return (
		<div className="picker-wheel">
			<div className="picker-wheel-window" style={{ height:itemHeight,borderColor: "#2867f9" }}></div>
         <div className="picker-wheel-items">
            {items.map((item:any, index:number) => (
                  <div key={index} className="picker-wheel-item" style={{height:itemHeight}}>{item.text}</div>
               ))
            }
            
         </div>
		</div>
	);
};

export default PickerWheel;
