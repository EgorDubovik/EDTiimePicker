import { useState } from "react";
import TimePicker from "./TimePicker/index";

function App() {
   const [date, setDate] = useState('2021-09-01 11:55:00');
	return (
		<>
			<div className="main-container">
            <div style={{ marginBottom:"50px",textAlign:"center" }}>{date.toLocaleString()}</div>
				<div className="">
               <TimePicker 
                  currentDate={date}
                  options={{
                     daysNameWheels: false,
                     viewItems: 5,
                  }}
                  onDateChange={(date: Date) => {
                     setDate(date.toLocaleString());
                  }}
               />
            </div>
			</div>
		</>
	);
}

export default App;
