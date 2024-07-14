import { useState } from "react";
import TimePicker from "./TimePicker/index";

function App() {
	return (
		<>
			<div className="main-container">
				<div className="">
               <TimePicker 
                  currentDate={'2021-09-01 11:55:00'}
               />
            </div>
			</div>
		</>
	);
}

export default App;
