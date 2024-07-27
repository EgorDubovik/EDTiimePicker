import { useState } from "react";
// import TimePicker from "edtimepicker";
import TimePicker from "./TimePicker";
function App() {
   const [date, setDate] = useState('2021-11-06 13:00');
	const onDateChange = (date: Date) => {
		setDate(date.toLocaleString());
	}
	return (
		<>
			<div className="main-container">
            <div style={{ marginBottom:"50px",textAlign:"center" }}>{date.toLocaleString()}</div>
				<div className="">
               <TimePicker	
						options={{
							viewItems: 5,
						}}
						onDateChange={onDateChange}
					/>
            </div>
			</div>
		</>
	);
}

export default App;
