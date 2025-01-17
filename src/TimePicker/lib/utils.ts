import { getDays, getDaysNameArray, getHours, getMinutes, getMonths, getYears, getAmPm } from "../Helpers/GetItems";
import { splitTimeFormat } from "../Helpers/FormatDate";

export function getWheels(showDate: boolean, showTime: boolean, daysNameWheel: boolean, daysNameFormat: string, timeFormat: string, dateWheelsFormat: string, minutesStep: number): any[] {
   const wheelArray = new Array();
   if (showDate) {
      if (daysNameWheel)
         wheelArray.push({
            onGetItems: getDaysNameArray,
            textFormat: daysNameFormat,
         });
      else {
         const dateWheels = dateWheelsFormat.split("|");
         dateWheels.forEach((dateWheel) => {
            if (
               dateWheel === "MMMM" ||
               dateWheel === "MMM" ||
               dateWheel === "MM" ||
               dateWheel === "M"
            )
               wheelArray.push({
                  onGetItems: getMonths,
                  textFormat: dateWheel,
               });
            else if (
               dateWheel === "DDD" ||
               dateWheel === "DD" ||
               dateWheel === "D"
            )
               wheelArray.push({
                  onGetItems: getDays,
                  textFormat: dateWheel,
               });
            else if (dateWheel === "YYYY" || dateWheel === "YY")
               wheelArray.push({
                  onGetItems: getYears,
                  textFormat: dateWheel,
               });
         });
      }
   }

   if (showTime) {
      const timeWheels = splitTimeFormat(timeFormat);
      timeWheels.forEach((timeWheel) => {
         if (timeWheel === "HH" || timeWheel === "hh" || timeWheel === "H" || timeWheel === "h")
            wheelArray.push({
               onGetItems: getHours,
               textFormat: timeWheel,
            });
         else if (timeWheel === "mm" || timeWheel === "m")
            wheelArray.push({
               onGetItems: getMinutes,
               textFormat: timeWheel,
               textItemStep: minutesStep,
            });
         else if (timeWheel === "A" && timeFormat.includes("h"))
            wheelArray.push({
               onGetItems: getAmPm,
               isLoop: false,
            });
      });
   }

   return wheelArray;
}

export function getIndexTranslateY(translateY: number, itemHeight: number, itemsView: number, isLoop: boolean): number {
   if (!isLoop) {
      let newCurrentIndex = Math.round(Number(translateY) / itemHeight) - itemsView;
      newCurrentIndex = newCurrentIndex < 0 ? 1 : newCurrentIndex;
      return newCurrentIndex;
   }
   return Math.round(Number(translateY) / itemHeight) * -1 + itemsView;
}