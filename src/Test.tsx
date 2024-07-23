import React, { useEffect, useState } from 'react';
const Test = () => {
   console.log('Test component');
   const [value, setValue] = useState(0);
   const [value2, setValue2] = useState(23);

   useEffect(() => {
      
   }, [value2]);

   useEffect(() => {
      //setValue2(new Date().getTime());
   }, [value]);

   return (
      <div>
         <h1>Test</h1>
      </div>
   );
}

export default Test;