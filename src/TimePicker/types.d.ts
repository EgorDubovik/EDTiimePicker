export interface ITimePicker {
	currentDate?: Date | string | null;
	options?: {
		viewItems?: number;
		itemsHeight?: number;
		daysNameFormat?: string;
		timeFormat?: string;
		dateWheelsFormat?: string;
      minutesStep?: number;
		showTime?: boolean;
		showDate?: boolean;
		daysNameWheels?: boolean;
      borderColor?: string;
      addClass?: string;
		textAlign?: "left" | "center" | "right";
	};
   onDateChange?: (date: Date) => void;
}

export interface IPickerWheel {
	onGetItems: (
		currentDate: Date | string,
		textFormat?: string | null,
		textItemStep?: number
	) => any;
   updateDate: (date: Date) => void;
	textFormat: string | null;
	textItemStep: number;
	currentDate: Date;
	itemsView: number;
	itemHeight: number;
	isLoop?: boolean;
   borderColor?: string;
	textAlign?: "left" | "center" | "right";
}