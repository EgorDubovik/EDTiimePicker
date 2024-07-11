import './style.css';
import PickerWheel from './PickerWheel';
import { getDays, getHours, getMinutes } from './Helpers/GetItems';
import { useState } from 'react';

const TimePicker = () => {
   const [currenDate, setCurrentDate] = useState(new Date());
   const itemsView = 3;
   const itemHeight = 40;
   return (
      <div className="picker-wrapper" style={{ height: (itemHeight*itemsView)+"px" }}>
         <PickerWheel 
            onGetItems={getHours}
            currentDate={currenDate}
            
         />
         <div className="picker-divider">:</div>
         <PickerWheel 
            onGetItems={getMinutes}
            currentDate={currenDate}
            textItemStep={10}
         />
      </div>
   );
}

export default TimePicker;