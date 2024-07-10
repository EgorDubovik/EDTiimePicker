import './style.css';
import PickerWheel from './PickerWheel';
import { getDays } from './Helpers/GetItems';

const TimePicker = () => {
   return (
      <div className="picker-wrapper" style={{ height: "120px" }}>
         <PickerWheel 
            onGetItems={getDays}
         />
      </div>
   );
}

export default TimePicker;