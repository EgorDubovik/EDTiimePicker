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
	};
   onDateChange?: (date: Date) => void;
}