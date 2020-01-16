// import React from 'react'


// const myData = {
//     "key1": "value1",
//     "key2": "value2",
//     "key3": "value3",
//     "key4": {
//       "k1": "val1",
//       "k2": {
//         "p1": "v1",
//         "p2": "v2",
//         "p3": "v3"
//       }
//     }
//   }

//   const generateElement = (key,value) => {
//     return (
//       <div key={key} className="row">
//         <div className="col-xs-6 ins-label">{key}</div>
//         <div className="col-xs-6">{value}</div>
//       </div>
//     );
//   }
  
//   function generateData(data) {
//     const newData = Object.keys(data).reduce((result, currentKey) => {
//       if (typeof data[currentKey] === 'string' || data[currentKey] instanceof String) {
//         const elementToPush = generateElement(currentKey, data[currentKey]);
//         result.push(elementToPush);
//       } else {
//         const nested = generateData(data[currentKey]);
//         result.push(...nested);
//       }
//       return result;
//     }, []);
//     return newData;
//   }

// const Test = () => {
//     return (
//         <div>
//             {generateData(data)}
//         </div>
//     );
// }


// export default Test;