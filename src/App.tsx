import { useState } from "react";
import TimePicker from "./TimePicker/index";

function App() {
	return (
		<>
			<div className="main-container">
				<TimePicker 
               currentDate={"2021-09-20T10:00:00"} 
               options={{ 
                  timeFormat: "hh:mm A",
               }}
            />
			</div>
		</>
	);
}

export default App;
