import { useState } from "react";
import TimePicker from "./TimePicker/index";

function App() {
   const [date, setDate] = useState('2021-10-05 13:00');
	return (
		<>
			<div className="main-container">
            <div style={{ marginBottom:"50px",textAlign:"center" }}>{date.toLocaleString()}</div>
				<div className="">
               <TimePicker 
                  currentDate={date}
                  options={{ 
                     showTime: false,
                   }}
                  onDateChange={(date: Date) => {
                     //setDate(date.toLocaleString());
                  }}
               />
            </div>
			</div>
		</>
	);
}

export default App;
