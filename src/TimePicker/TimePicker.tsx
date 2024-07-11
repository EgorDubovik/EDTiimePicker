import './style.css';
import PickerWheel from './PickerWheel';
import { getDays, getHours, getMinutes } from './Helpers/GetItems';
import { useState } from 'react';

const TimePicker = () => {
   const [currenDate, setCurrentDate] = useState(new Date());

   return (
      <div className="picker-wrapper" style={{ height: "120px" }}>
         <PickerWheel 
            onGetItems={getHours}
            currentDate={currenDate}
            textFormat="HH"
         />
         <div className="picker-divider">:</div>
         <PickerWheel 
            onGetItems={getMinutes}
            currentDate={currenDate}
            textFormat="mm"
         />
      </div>
   );
}

export default TimePicker;