import { useState } from "react";
import TimePicker from "./TimePicker/index";

function App() {
   const [date, setDate] = useState('2021-11-06 13:00');
	return (
		<>
			<div className="main-container">
            <div style={{ marginBottom:"50px",textAlign:"center" }}>{date.toLocaleString()}</div>
				<div className="">
               <TimePicker 
                  currentDate={date}
                  options={{ 
                     showTime: true,
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
