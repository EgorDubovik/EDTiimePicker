import { useState } from "react";
import TimePicker from "./TimePicker/index";

function App() {
	return (
		<>
			<div className="main-container">
				<TimePicker 
               options={{ 
                  timeFormat: "hh:mm A",
               }}
            />
			</div>
		</>
	);
}

export default App;
